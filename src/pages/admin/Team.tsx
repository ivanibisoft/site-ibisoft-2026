import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from '@/hooks/use-toast'
import { Edit2, Plus, Trash2 } from 'lucide-react'

export default function AdminTeam() {
  const [team, setTeam] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = async () =>
    setTeam(await pb.collection('team_members').getFullList({ sort: 'order' }))
  useEffect(() => {
    load()
  }, [])

  const deleteMember = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      await pb.collection('team_members').delete(id)
      load()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Equipe ibisoft</h2>
        <Button
          onClick={() => {
            setEditingId(null)
            setOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Membro
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold w-24 text-center">Ordem</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Cargo</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-center font-medium text-gray-500">{t.order}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-gray-500">{t.role}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setEditingId(t.id)
                      setOpen(true)
                    }}
                  >
                    <Edit2 className="w-3 h-3 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteMember(t.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {open && <TeamDialog open={open} setOpen={setOpen} memberId={editingId} onSaved={load} />}
    </div>
  )
}

function TeamDialog({ open, setOpen, memberId, onSaved }: any) {
  const [data, setData] = useState({ name: '', role: '', bio: '', order: 0 })
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (memberId)
      pb.collection('team_members')
        .getOne(memberId)
        .then((m: any) => setData(m))
        .catch(() => {})
  }, [memberId])

  const save = async () => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)))
      if (file) formData.append('photo', file)

      if (memberId) await pb.collection('team_members').update(memberId, formData)
      else await pb.collection('team_members').create(formData)

      toast({ title: 'Membro salvo com sucesso' })
      setOpen(false)
      onSaved()
    } catch (e) {
      setErrors(extractFieldErrors(e))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            {memberId ? 'Editar Membro' : 'Novo Membro'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Ex: Ivan Guedes"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Cargo</Label>
            <Input
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              placeholder="Ex: CEO"
            />
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          <div className="space-y-2">
            <Label>Ordem de exibição (ex: 1, 2, 3)</Label>
            <Input
              type="number"
              value={data.order}
              onChange={(e) => setData({ ...data, order: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2 p-4 bg-gray-50 border border-gray-100 rounded-md">
            <Label>Foto de Perfil</Label>
            <Input
              type="file"
              className="bg-white"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 400x400px (Quadrado). JPG ou PNG.
            </p>
          </div>
          <Button onClick={save} className="w-full">
            Salvar Perfil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
