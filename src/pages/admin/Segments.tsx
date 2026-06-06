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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from '@/hooks/use-toast'
import { Edit2, Plus, Trash2 } from 'lucide-react'

export default function AdminSegments() {
  const [segments, setSegments] = useState<any[]>([])

  const load = async () => setSegments(await pb.collection('segments').getFullList())
  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-3xl font-bold tracking-tight">Segmentos de Mercado</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Slug (URL)</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell className="text-gray-500">{s.slug}</TableCell>
                <TableCell className="text-right">
                  <SegmentDialog segment={s} onUpdate={load} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function SegmentDialog({ segment, onUpdate }: { segment: any; onUpdate: () => void }) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    title: segment.title,
    description: segment.description,
    icon: segment.icon,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [challenges, setChallenges] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      pb.collection('segment_challenges')
        .getFullList({ filter: `segment="${segment.id}"`, sort: 'order' })
        .then(setChallenges)
      setData({ title: segment.title, description: segment.description, icon: segment.icon })
      setErrors({})
    }
  }, [open, segment])

  const save = async () => {
    try {
      await pb.collection('segments').update(segment.id, data)
      toast({ title: 'Segmento salvo com sucesso' })
      onUpdate()
      setErrors({})
    } catch (e) {
      setErrors(extractFieldErrors(e))
    }
  }

  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const addChallenge = async () => {
    if (!newTitle) return
    const ch = await pb
      .collection('segment_challenges')
      .create({
        segment: segment.id,
        title: newTitle,
        description: newDesc,
        order: challenges.length + 1,
      })
    setChallenges([...challenges, ch])
    setNewTitle('')
    setNewDesc('')
  }
  const removeChallenge = async (id: string) => {
    await pb.collection('segment_challenges').delete(id)
    setChallenges(challenges.filter((c) => c.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Edit2 className="w-3 h-3 mr-2" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Segmento: {segment.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título Exibido</Label>
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label>Descrição da Página</Label>
              <Textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>
            <Button onClick={save}>Atualizar Dados Principais</Button>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-semibold text-lg mb-4">Desafios do Setor</h4>
            <div className="space-y-3 mb-6">
              {challenges.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-start bg-gray-50 border border-gray-100 p-3 rounded-md"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-900">{c.title}</p>
                    <p className="text-sm text-gray-500">{c.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 h-8 shrink-0"
                    onClick={() => removeChallenge(c.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-3 bg-blue-50/50 border border-blue-100 p-4 rounded-md">
              <h5 className="text-sm font-semibold text-blue-900">Novo Desafio</h5>
              <Input
                placeholder="Nome do desafio (Ex: Logística Complexa)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-white"
              />
              <Textarea
                placeholder="Como o ERP resolve isso?"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="bg-white resize-none"
                rows={3}
              />
              <Button onClick={addChallenge} size="sm" variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
