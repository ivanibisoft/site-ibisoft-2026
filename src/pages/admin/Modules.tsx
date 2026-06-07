import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getModules, Module } from '@/services/modules'
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
import { Edit2, GripVertical, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function AdminModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadData = async () => setModules(await getModules())
  useEffect(() => {
    loadData()
  }, [])

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

    const newItems = [...modules]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    setModules(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
    setIsSaving(true)

    try {
      await Promise.all(
        newItems.map((m, i) => pb.collection('modules').update(m.id, { order: i + 1 })),
      )
      toast({ title: 'Ordem dos módulos atualizada!' })
    } catch (err) {
      toast({ title: 'Erro ao salvar ordem', variant: 'destructive' })
      loadData()
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Módulos do ERP</h2>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-12 text-center"></TableHead>
              <TableHead className="font-semibold">Módulo</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Slug</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {isSaving && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {modules.map((m, index) => {
              const isDraggingThis = draggedIndex === index
              const isDragOver =
                dragOverIndex === index && draggedIndex !== null && draggedIndex !== index
              return (
                <TableRow
                  key={m.id}
                  draggable={!isSaving}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'transition-colors cursor-grab active:cursor-grabbing',
                    isDraggingThis && 'opacity-50 bg-primary/5',
                    isDragOver &&
                      (dragOverIndex > draggedIndex
                        ? 'border-b-2 border-b-primary'
                        : 'border-t-2 border-t-primary'),
                  )}
                >
                  <TableCell className="text-center align-middle">
                    <GripVertical className="w-4 h-4 text-gray-400 mx-auto pointer-events-none" />
                  </TableCell>
                  <TableCell className="font-medium pointer-events-none select-none">
                    {m.name}
                  </TableCell>
                  <TableCell className="text-gray-500 hidden md:table-cell pointer-events-none select-none">
                    {m.slug}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 relative z-20"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Link to={`/admin/modules/${m.id}`}>
                        <Edit2 className="w-3 h-3 mr-2" /> Gerenciar
                      </Link>
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
