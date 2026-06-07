import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { ArrowDown, ArrowUp, GripVertical, Loader2 } from 'lucide-react'
import type { Module, ResourceGroup, Resource } from '@/services/modules'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminOrdering() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [modules, setModules] = useState<Module[]>([])
  const [groups, setGroups] = useState<ResourceGroup[]>([])
  const [resources, setResources] = useState<Resource[]>([])

  const [selectedModuleForGroups, setSelectedModuleForGroups] = useState<string>('')
  const [selectedModuleForResources, setSelectedModuleForResources] = useState<string>('')
  const [selectedGroupForResources, setSelectedGroupForResources] = useState<string>('')

  const fetchData = useCallback(async () => {
    try {
      const [m, g, r] = await Promise.all([
        pb.collection('modules').getFullList<Module>({ sort: 'order,name' }),
        pb.collection('resource_groups').getFullList<ResourceGroup>({ sort: 'order,name' }),
        pb.collection('resources').getFullList<Resource>({ sort: 'order,name' }),
      ])
      setModules(m)
      setGroups(g)
      setResources(r)
    } catch (err) {
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSaveOrder = async (collection: string, orderedIds: string[]) => {
    setIsSaving(true)
    try {
      await Promise.all(
        orderedIds.map((id, index) => pb.collection(collection).update(id, { order: index })),
      )
      toast({ title: 'Ordem atualizada com sucesso!' })
      await fetchData() // Refresh all data to ensure sync
    } catch (err) {
      toast({ title: 'Erro ao salvar ordem', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ordenação de Conteúdo</h2>
          <p className="text-muted-foreground mt-2">Carregando hierarquia do sistema...</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredGroups = groups.filter((g) => g.module === selectedModuleForGroups)

  // Update available groups for resources when module changes
  const availableGroupsForResources = groups.filter((g) => g.module === selectedModuleForResources)
  const filteredResources = resources.filter((r) => r.group === selectedGroupForResources)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ordenação de Conteúdo</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie a sequência de exibição dos módulos, grupos e recursos no site público.
        </p>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="groups">Grupos de Recursos</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Módulos Principais</CardTitle>
              <CardDescription>
                Arraste ou use as setas para alterar a ordem dos módulos na navegação e na tela
                inicial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SortableList
                items={modules}
                onSave={(ids) => handleSaveOrder('modules', ids)}
                isSaving={isSaving}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Grupos de Recursos</CardTitle>
              <CardDescription>
                Selecione um módulo para ordenar seus grupos de recursos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select value={selectedModuleForGroups} onValueChange={setSelectedModuleForGroups}>
                <SelectTrigger className="w-full sm:w-[400px]">
                  <SelectValue placeholder="Selecione um módulo..." />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedModuleForGroups && (
                <SortableList
                  items={filteredGroups}
                  onSave={(ids) => handleSaveOrder('resource_groups', ids)}
                  isSaving={isSaving}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recursos</CardTitle>
              <CardDescription>
                Selecione um módulo e um grupo para ordenar os recursos individuais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  value={selectedModuleForResources}
                  onValueChange={(val) => {
                    setSelectedModuleForResources(val)
                    setSelectedGroupForResources('') // Reset group when module changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um módulo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedGroupForResources}
                  onValueChange={setSelectedGroupForResources}
                  disabled={!selectedModuleForResources}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroupsForResources.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedGroupForResources && (
                <SortableList
                  items={filteredResources}
                  onSave={(ids) => handleSaveOrder('resources', ids)}
                  isSaving={isSaving}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SortableList({
  items: initialItems,
  onSave,
  isSaving,
}: {
  items: Array<{ id: string; name: string }>
  onSave: (ids: string[]) => void
  isSaving: boolean
}) {
  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    setItems(newItems)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    setItems(newItems)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg bg-slate-50">
        <p className="text-muted-foreground">Nenhum item encontrado nesta categoria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm transition-colors hover:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <GripVertical className="text-slate-300 w-5 h-5" />
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveUp(index)}
                disabled={index === 0 || isSaving}
                className="text-slate-500 hover:text-slate-900"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1 || isSaving}
                className="text-slate-500 hover:text-slate-900"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4 border-t mt-4">
        <Button onClick={() => onSave(items.map((i) => i.id))} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Salvar Ordem
        </Button>
      </div>
    </div>
  )
}
