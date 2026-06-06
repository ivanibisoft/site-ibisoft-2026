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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from '@/hooks/use-toast'
import { Edit2, Plus, Trash2, CheckCircle2 } from 'lucide-react'

export default function AdminCases() {
  const [cases, setCases] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = async () => setCases(await pb.collection('cases').getFullList({ sort: '-created' }))
  useEffect(() => {
    load()
  }, [])

  const deleteCase = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este case?')) {
      await pb.collection('cases').delete(id)
      load()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Cases de Sucesso</h2>
        <Button
          onClick={() => {
            setEditingId(null)
            setOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Case
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold">Projeto</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold text-center w-24">Home</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-gray-500">{c.client_name}</TableCell>
                <TableCell className="text-center text-gray-500">
                  {c.featured && <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setEditingId(c.id)
                      setOpen(true)
                    }}
                  >
                    <Edit2 className="w-3 h-3 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteCase(c.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {open && <CaseDialog open={open} setOpen={setOpen} caseId={editingId} onSaved={load} />}
    </div>
  )
}

function CaseDialog({ open, setOpen, caseId, onSaved }: any) {
  const [data, setData] = useState({
    title: '',
    slug: '',
    client_name: '',
    category: '',
    description: '',
    content: '',
    featured: false,
  })
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (caseId)
      pb.collection('cases')
        .getOne(caseId)
        .then((c: any) => setData(c))
        .catch(() => {})
  }, [caseId])

  const save = async () => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)))
      if (file) formData.append('image', file)

      if (caseId) await pb.collection('cases').update(caseId, formData)
      else await pb.collection('cases').create(formData)

      toast({ title: 'Case salvo com sucesso' })
      setOpen(false)
      onSaved()
    } catch (e) {
      setErrors(extractFieldErrors(e))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{caseId ? 'Editar Case' : 'Novo Case'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título do Projeto</Label>
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Ex: Implantação ERP ABC"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
                placeholder="ex: implantacao-erp"
              />
              {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
            </div>
            <div className="space-y-2">
              <Label>Nome do Cliente</Label>
              <Input
                value={data.client_name}
                onChange={(e) => setData({ ...data, client_name: e.target.value })}
                placeholder="Ex: Indústria ABC"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria do Setor</Label>
              <Input
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                placeholder="Ex: Indústria"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Resumo (Card)</Label>
            <Textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Conteúdo Completo (Case Detail)</Label>
            <Textarea
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
              rows={8}
              className="resize-none"
            />
          </div>
          <div className="space-y-2 p-4 bg-gray-50 border border-gray-100 rounded-md">
            <Label>Capa do Case (Imagem)</Label>
            <Input
              type="file"
              className="bg-white"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-500 mt-1">Recomendado: 800x600px. JPG, PNG ou WebP.</p>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="featured"
              checked={data.featured}
              onCheckedChange={(c) => setData({ ...data, featured: !!c })}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Destacar na página inicial (Home)
            </Label>
          </div>
          <Button onClick={save} className="w-full">
            Salvar Case
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
