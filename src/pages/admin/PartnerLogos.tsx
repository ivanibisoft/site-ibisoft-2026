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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Edit2, GripVertical, Loader2, Plus, Trash2 } from 'lucide-react'

export default function AdminPartnerLogos() {
  const [logos, setLogos] = useState<any[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const load = async () => {
    const list = await pb.collection('partner_logos').getFullList({ sort: 'order_number' })
    setLogos(list)
  }

  useEffect(() => {
    load()
  }, [])

  const deleteLogo = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este logo?')) {
      await pb.collection('partner_logos').delete(id)
      toast({ title: 'Logo excluído com sucesso' })
      load()
    }
  }

  const toggleActive = async (logo: any) => {
    await pb.collection('partner_logos').update(logo.id, { is_active: !logo.is_active })
    load()
  }

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    if (isSaving) {
      e.preventDefault()
      return
    }
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...logos]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    setLogos(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
    setIsSaving(true)

    try {
      await Promise.all(
        newItems.map((l, i) =>
          pb.collection('partner_logos').update(l.id, { order_number: i + 1 }),
        ),
      )
      toast({ title: 'Ordem dos logos atualizada!' })
    } catch (err) {
      toast({ title: 'Erro ao salvar ordem', variant: 'destructive' })
      load()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Logos de Parceiros</h2>
        <PartnerLogoDialog onSaved={load} />
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-12 text-center"></TableHead>
              <TableHead className="font-semibold w-20 text-center">Ordem</TableHead>
              <TableHead className="font-semibold">Logo</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold text-center">Ativo</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {isSaving && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {logos.map((l, index) => {
              const isDraggingThis = draggedIndex === index
              const isDragOver =
                dragOverIndex === index && draggedIndex !== null && draggedIndex !== index
              return (
                <TableRow
                  key={l.id}
                  draggable={!isSaving}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'transition-colors cursor-grab active:cursor-grabbing',
                    isDraggingThis && 'opacity-50 bg-primary/5 shadow-md',
                    isDragOver &&
                      (dragOverIndex > draggedIndex
                        ? 'border-b-2 border-b-primary'
                        : 'border-t-2 border-t-primary'),
                  )}
                >
                  <TableCell className="text-center align-middle">
                    <GripVertical className="w-4 h-4 text-gray-400 mx-auto pointer-events-none" />
                  </TableCell>
                  <TableCell className="text-center font-medium text-gray-500 pointer-events-none select-none">
                    {l.order_number}
                  </TableCell>
                  <TableCell className="pointer-events-none">
                    <img
                      src={`${pb.baseURL}/api/files/partner_logos/${l.id}/${l.logo}`}
                      alt={l.name}
                      className="h-10 w-auto object-contain max-w-[120px]"
                    />
                  </TableCell>
                  <TableCell className="font-medium pointer-events-none select-none">
                    {l.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={l.is_active}
                      onCheckedChange={() => toggleActive(l)}
                      disabled={isSaving}
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <PartnerLogoDialog logo={l} onSaved={load} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteLogo(l.id)}
                      disabled={isSaving}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function PartnerLogoDialog({ logo, onSaved }: { logo?: any; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(logo?.name || '')
  const [orderNumber, setOrderNumber] = useState(logo?.order_number ?? 0)
  const [isActive, setIsActive] = useState(logo?.is_active ?? true)
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(logo?.name || '')
      setOrderNumber(logo?.order_number ?? 0)
      setIsActive(logo?.is_active ?? true)
      setFile(null)
      setErrors({})
    }
  }, [open, logo])

  const save = async () => {
    setSaving(true)
    try {
      if (logo) {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('order_number', String(orderNumber))
        formData.append('is_active', String(isActive))
        if (file) formData.append('logo', file)
        await pb.collection('partner_logos').update(logo.id, formData)
      } else {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('order_number', String(orderNumber))
        formData.append('is_active', String(isActive))
        if (file) formData.append('logo', file)
        await pb.collection('partner_logos').create(formData)
      }
      toast({ title: 'Logo salvo com sucesso' })
      setOpen(false)
      onSaved()
    } catch (e) {
      setErrors(extractFieldErrors(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={logo ? 'outline' : 'default'}
          size={logo ? 'sm' : 'default'}
          className={logo ? 'h-8' : ''}
        >
          {logo ? (
            <>
              <Edit2 className="w-3 h-3 mr-2" /> Editar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Logo
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{logo ? 'Editar Logo' : 'Novo Logo'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Nome da Empresa</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Microsoft"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Ordem de exibição</Label>
            <Input
              type="number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Logo (PNG, JPG, SVG)</Label>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="bg-white"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
            {logo && !file && (
              <img
                src={`${pb.baseURL}/api/files/partner_logos/${logo.id}/${logo.logo}`}
                alt={logo.name}
                className="h-12 w-auto object-contain"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Ativo (exibir na home)</Label>
          </div>
          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
