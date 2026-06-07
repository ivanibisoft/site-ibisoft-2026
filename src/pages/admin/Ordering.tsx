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
import { GripVertical, Loader2 } from 'lucide-react'
import type { Module, ResourceGroup, Resource } from '@/services/modules'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

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
                Arraste e solte para alterar a ordem dos módulos na navegação e na tela inicial. O
                salvamento é automático.
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
                Selecione um módulo e arraste os grupos para reordená-los. O salvamento é
                automático.
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
                Selecione um módulo e um grupo e arraste os recursos para reordená-los. O salvamento
                é automático.
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isSaving) {
      e.preventDefault()
      return
    }
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    setItems(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)

    onSave(newItems.map((i) => i.id))
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg bg-slate-50">
        <p className="text-muted-foreground">Nenhum item encontrado nesta categoria.</p>
      </div>
    )
  }

  return (
    <div className="relative space-y-2 pb-4">
      {isSaving && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-md backdrop-blur-[1px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      {items.map((item, index) => {
        const isDraggingThis = draggedIndex === index
        const isDragOver =
          dragOverIndex === index && draggedIndex !== null && draggedIndex !== index

        return (
          <div
            key={item.id}
            draggable={!isSaving}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center justify-between p-3 bg-white border rounded-md shadow-sm transition-all duration-200 ease-in-out cursor-grab active:cursor-grabbing hover:border-primary/30',
              isDraggingThis && 'opacity-50 scale-[0.98] shadow-md border-primary',
              isDragOver &&
                (dragOverIndex > draggedIndex
                  ? 'border-b-2 border-b-primary bg-primary/5'
                  : 'border-t-2 border-t-primary bg-primary/5'),
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <GripVertical className="text-slate-400 w-5 h-5 pointer-events-none" />
              <span className="font-medium text-slate-700 pointer-events-none select-none">
                {item.name}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
