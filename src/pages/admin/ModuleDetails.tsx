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
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

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
          <div className="space-y-6">
            {groups.map((g) => (
              <ResourceGroupManager key={g.id} group={g} onDelete={() => deleteGroup(g.id)} />
            ))}
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

  useEffect(() => {
    pb.collection('resources')
      .getFullList({ filter: `group="${group.id}"`, sort: 'name' })
      .then(setResources)
  }, [group.id])

  const addRes = async () => {
    if (!name || !desc) return
    const r = await pb.collection('resources').create({ group: group.id, name, description: desc })
    setResources([...resources, r])
    setName('')
    setDesc('')
    setIsAdding(false)
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
        <h4 className="font-semibold text-gray-900">{group.name}</h4>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        {resources.map((r) => (
          <div
            key={r.id}
            className="flex justify-between items-start bg-white p-3 rounded-md shadow-sm border border-gray-100"
          >
            <div className="space-y-1">
              <p className="font-medium text-sm text-gray-900">{r.name}</p>
              <p className="text-sm text-gray-500">{r.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50 shrink-0"
              onClick={() => deleteRes(r.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
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
