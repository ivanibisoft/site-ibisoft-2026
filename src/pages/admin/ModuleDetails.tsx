import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminModuleDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [mod, setMod] = useState<any>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [desc, setDesc] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (id) {
      pb.collection('modules')
        .getOne(id)
        .then((m) => {
          setMod(m)
          setDesc(m.description)
        })
      pb.collection('resource_groups')
        .getFullList({ filter: `module="${id}"`, sort: 'order' })
        .then(setGroups)
    }
  }, [id])

  const saveModule = async () => {
    try {
      await pb.collection('modules').update(id!, { description: desc })
      toast({ title: 'Módulo salvo com sucesso' })
      setErrors({})
    } catch (err) {
      setErrors(extractFieldErrors(err))
    }
  }

  const [newGroup, setNewGroup] = useState('')
  const [draggedGroupIndex, setDraggedGroupIndex] = useState<number | null>(null)
  const [dragOverGroupIndex, setDragOverGroupIndex] = useState<number | null>(null)
  const [isSavingGroups, setIsSavingGroups] = useState(false)

  const loadGroups = async () => {
    if (!id) return
    const g = await pb
      .collection('resource_groups')
      .getFullList({ filter: `module="${id}"`, sort: 'order' })
    setGroups(g)
  }

  const addGroup = async () => {
    if (!newGroup) return
    const group = await pb
      .collection('resource_groups')
      .create({ module: id, name: newGroup, order: groups.length + 1 })
    setGroups([...groups, group])
    setNewGroup('')
  }

  const deleteGroup = async (gid: string) => {
    if (confirm('Excluir este grupo e todos os seus recursos?')) {
      await pb.collection('resource_groups').delete(gid)
      setGroups(groups.filter((g) => g.id !== gid))
    }
  }

  const handleGroupDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isSavingGroups) {
      e.preventDefault()
      return
    }
    setDraggedGroupIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleGroupDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverGroupIndex !== index) {
      setDragOverGroupIndex(index)
    }
  }

  const handleGroupDragLeave = () => {
    setDragOverGroupIndex(null)
  }

  const handleGroupDrop = async (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedGroupIndex === null || draggedGroupIndex === index) {
      setDraggedGroupIndex(null)
      setDragOverGroupIndex(null)
      return
    }

    const newItems = [...groups]
    const draggedItem = newItems[draggedGroupIndex]
    newItems.splice(draggedGroupIndex, 1)
    newItems.splice(index, 0, draggedItem)

    setGroups(newItems)
    setDraggedGroupIndex(null)
    setDragOverGroupIndex(null)
    setIsSavingGroups(true)

    try {
      await Promise.all(
        newItems.map((g, i) => pb.collection('resource_groups').update(g.id, { order: i + 1 })),
      )
      toast({ title: 'Ordem dos grupos atualizada!' })
    } catch (err) {
      toast({ title: 'Erro ao salvar ordem', variant: 'destructive' })
      loadGroups()
    } finally {
      setIsSavingGroups(false)
    }
  }

  const handleGroupDragEnd = () => {
    setDraggedGroupIndex(null)
    setDragOverGroupIndex(null)
  }

  if (!mod) return <div className="p-8">Carregando...</div>

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/modules')}
        className="-ml-4 text-gray-500"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para lista
      </Button>

      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">{mod.name}</h2>
        <p className="text-gray-500">
          Gerencie a descrição principal e a lista de recursos deste módulo.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Descrição Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={6}
              className="resize-none"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          <Button onClick={saveModule}>Atualizar Descrição</Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Grupos de Recursos (Abas)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Nome do novo grupo (ex: Visão Geral)"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
            <Button onClick={addGroup} variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </div>
          <div className="space-y-6 relative">
            {isSavingGroups && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {groups.map((g, index) => {
              const isDraggingThis = draggedGroupIndex === index
              const isDragOver =
                dragOverGroupIndex === index &&
                draggedGroupIndex !== null &&
                draggedGroupIndex !== index
              return (
                <div
                  key={g.id}
                  draggable={!isSavingGroups}
                  onDragStart={(e) => handleGroupDragStart(e, index)}
                  onDragOver={(e) => handleGroupDragOver(e, index)}
                  onDragLeave={handleGroupDragLeave}
                  onDrop={(e) => handleGroupDrop(e, index)}
                  onDragEnd={handleGroupDragEnd}
                  className={cn(
                    'transition-all border border-transparent rounded-lg cursor-grab active:cursor-grabbing',
                    isDraggingThis && 'opacity-50',
                    isDragOver &&
                      (dragOverGroupIndex > draggedGroupIndex
                        ? 'border-b-2 border-b-primary'
                        : 'border-t-2 border-t-primary'),
                  )}
                >
                  <ResourceGroupManager group={g} onDelete={() => deleteGroup(g.id)} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ResourceGroupManager({ group, onDelete }: { group: any; onDelete: () => void }) {
  const [resources, setResources] = useState<any[]>([])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadResources = async () => {
    const r = await pb
      .collection('resources')
      .getFullList({ filter: `group="${group.id}"`, sort: 'order' })
    setResources(r)
  }

  useEffect(() => {
    loadResources()
  }, [group.id])

  const addRes = async () => {
    if (!name || !desc) return
    const r = await pb
      .collection('resources')
      .create({ group: group.id, name, description: desc, order: resources.length + 1 })
    setResources([...resources, r])
    setName('')
    setDesc('')
    setIsAdding(false)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isSaving) {
      e.preventDefault()
      return
    }
    e.stopPropagation()
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...resources]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    setResources(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
    setIsSaving(true)

    try {
      await Promise.all(
        newItems.map((r, i) => pb.collection('resources').update(r.id, { order: i + 1 })),
      )
      toast({ title: 'Ordem dos recursos atualizada!' })
    } catch (err) {
      toast({ title: 'Erro ao salvar ordem', variant: 'destructive' })
      loadResources()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const deleteRes = async (rid: string) => {
    if (confirm('Remover recurso?')) {
      await pb.collection('resources').delete(rid)
      setResources(resources.filter((r) => r.id !== rid))
    }
  }

  return (
    <div className="border border-gray-200 p-5 rounded-lg bg-gray-50/50">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-gray-400 pointer-events-none" />
          <h4 className="font-semibold text-gray-900 select-none pointer-events-none">
            {group.name}
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 relative z-20"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3 mb-4 relative">
        {isSaving && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-md">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {resources.map((r, index) => {
          const isDraggingThis = draggedIndex === index
          const isDragOver =
            dragOverIndex === index && draggedIndex !== null && draggedIndex !== index

          return (
            <div
              key={r.id}
              draggable={!isSaving}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'flex justify-between items-start bg-white p-3 rounded-md shadow-sm border border-gray-100 transition-all cursor-grab active:cursor-grabbing',
                isDraggingThis && 'opacity-50',
                isDragOver &&
                  (dragOverIndex > draggedIndex
                    ? 'border-b-2 border-b-primary'
                    : 'border-t-2 border-t-primary'),
              )}
            >
              <div className="flex gap-3 w-full">
                <GripVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 pointer-events-none" />
                <div className="space-y-1 pointer-events-none select-none">
                  <p className="font-medium text-sm text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50 shrink-0 relative z-20"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => deleteRes(r.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )
        })}
        {resources.length === 0 && !isAdding && (
          <p className="text-sm text-gray-500 italic">Nenhum recurso cadastrado neste grupo.</p>
        )}
      </div>

      {isAdding ? (
        <div className="space-y-3 bg-white p-4 border border-blue-100 rounded-md shadow-sm">
          <Input
            placeholder="Título do recurso"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Descrição detalhada"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={addRes} size="sm">
              Salvar Recurso
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="bg-white" onClick={() => setIsAdding(true)}>
          <Plus className="w-3 h-3 mr-2" /> Novo Recurso
        </Button>
      )}
    </div>
  )
}
