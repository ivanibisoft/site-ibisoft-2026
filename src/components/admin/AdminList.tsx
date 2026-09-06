import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { COLLECTIONS, type FieldConfig } from '@/config/admin-collections'
import { getList, deleteRecord, updateRecord } from '@/services/admin'
import { useRealtime } from '@/hooks/use-realtime'
import { Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatValue(value: any, field: FieldConfig, record?: any): string {
  if (value === null || value === undefined || value === '') return '-'
  if (field.type === 'bool') return value ? 'Sim' : 'Não'
  if (field.type === 'file') return value.split('/').pop() || 'Arquivo'
  if (field.type === 'relation') {
    const expanded = record?.expand?.[field.name]
    if (field.relationLabel && expanded) {
      return (
        expanded[field.relationLabel] || (typeof value === 'string' ? value.substring(0, 8) : '-')
      )
    }
    return typeof value === 'string' ? value.substring(0, 8) : '-'
  }
  return String(value)
}

export function AdminList({ collectionName }: { collectionName: string }) {
  const config = COLLECTIONS.find((c) => c.name === collectionName)
  const navigate = useNavigate()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [blockingWarning, setBlockingWarning] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const isDraggingRef = useRef(false)

  const isReorderable = !!config?.reorderable
  const orderField = config?.orderField || 'sort_order'

  const expandFields =
    config?.fields
      .filter((f) => f.type === 'relation')
      .map((f) => f.name)
      .join(',') || undefined
  const sortBy = config?.defaultSort || '-created'

  const loadData = useCallback(async () => {
    try {
      const data = await getList(collectionName, sortBy, expandFields)
      setRecords(data)
    } catch {
      toast.error('Erro ao carregar registros')
    } finally {
      setLoading(false)
    }
  }, [collectionName, expandFields, sortBy])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime(collectionName, () => {
    if (!isDraggingRef.current && !isReordering) {
      loadData()
    }
  })

  // Persistir nova lista reordenada no PocketBase
  const saveNewOrder = async (reorderedList: any[]) => {
    setIsReordering(true)
    const toastId = toast.loading('Salvando nova ordem...')
    try {
      // Atualiza o campo orderField para cada item cuja posição/ordem mudou
      const updates = reorderedList.map((item, index) => {
        const newOrder = index + 1
        if (item[orderField] !== newOrder) {
          return updateRecord(collectionName, item.id, { [orderField]: newOrder })
        }
        return Promise.resolve()
      })

      await Promise.all(updates)
      setRecords(reorderedList.map((item, index) => ({ ...item, [orderField]: index + 1 })))
      toast.success('Ordem atualizada com sucesso', { id: toastId })
    } catch (err) {
      console.error('Erro ao reordenar:', err)
      toast.error('Erro ao salvar nova ordem dos itens', { id: toastId })
      loadData()
    } finally {
      setIsReordering(false)
    }
  }

  // Mover item para cima ou para baixo (útil para touch e teclado)
  const handleMove = async (currentIndex: number, direction: 'up' | 'down') => {
    if (isReordering) return
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= records.length) return

    const newList = [...records]
    const [moved] = newList.splice(currentIndex, 1)
    newList.splice(targetIndex, 0, moved)
    setRecords(newList)
    await saveNewOrder(newList)
  }

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    if (!isReorderable || isReordering) return
    isDraggingRef.current = true
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    if (!isReorderable || draggedIndex === null) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    // Mantém dragOverIndex ou reseta se sair do container
  }

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex || isReordering) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      isDraggingRef.current = false
      return
    }

    const newList = [...records]
    const [draggedItem] = newList.splice(draggedIndex, 1)
    newList.splice(targetIndex, 0, draggedItem)

    setRecords(newList)
    setDraggedIndex(null)
    setDragOverIndex(null)
    isDraggingRef.current = false

    await saveNewOrder(newList)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    isDraggingRef.current = false
  }

  const handleToggle = async (id: string, field: string, value: boolean) => {
    try {
      await updateRecord(collectionName, id, { [field]: !value })
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: !value } : r)))
    } catch {
      toast.error('Erro ao atualizar registro')
    }
  }

  const initiateDelete = async (id: string) => {
    // Se for categoria de post, verificar se há posts usando essa categoria
    if (collectionName === 'post_categories') {
      const recordToDelete = records.find((r) => r.id === id)
      if (recordToDelete && recordToDelete.name) {
        try {
          const { countPostsByCategoryName } = await import('@/services/post-categories')
          const postsCount = await countPostsByCategoryName(recordToDelete.name)
          if (postsCount > 0) {
            setBlockingWarning(
              `A categoria "${recordToDelete.name}" está associada a ${postsCount} publicação(ões) no Blog. Para manter a integridade dos artigos, altere a categoria dos posts antes de excluí-la.`,
            )
            setDeleteId(id)
            return
          }
        } catch (err) {
          console.error('Erro ao verificar posts da categoria:', err)
        }
      }
    }
    setBlockingWarning(null)
    setDeleteId(id)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    if (blockingWarning) {
      // Se há bloqueio, não prosseguir
      setDeleteId(null)
      setBlockingWarning(null)
      return
    }
    setDeleting(true)
    try {
      await deleteRecord(collectionName, deleteId)
      setRecords((prev) => prev.filter((r) => r.id !== deleteId))
      toast.success('Registro excluído')
    } catch {
      toast.error('Erro ao excluir registro')
    } finally {
      setDeleting(false)
      setDeleteId(null)
      setBlockingWarning(null)
    }
  }

  if (!config) return <div className="text-muted-foreground">Coleção não encontrada</div>
  if (loading) return <div className="animate-pulse text-muted-foreground">Carregando...</div>

  const displayFields = config.fields.filter((f) => f.listDisplay)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{config.label}</h1>
          {isReorderable && (
            <p className="text-xs text-muted-foreground mt-1">
              Arraste as linhas pelo ícone ⋮⋮ para reordenar a exibição ou utilize os botões ↑ e ↓.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isReordering && (
            <div className="flex items-center text-xs text-muted-foreground gap-1.5 mr-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Salvando ordem...</span>
            </div>
          )}
          <Button onClick={() => navigate(`/admin/${collectionName}/new`)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {isReorderable && <TableHead className="w-[80px] text-center">Ordem</TableHead>}
              {displayFields.map((f) => (
                <TableHead key={f.name}>{f.label}</TableHead>
              ))}
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody onDragLeave={handleDragLeave}>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={displayFields.length + (isReorderable ? 3 : 2)}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              records.map((r, index) => {
                const isDragging = draggedIndex === index
                const isOver = dragOverIndex === index && draggedIndex !== index

                return (
                  <TableRow
                    key={r.id}
                    draggable={isReorderable && !isReordering}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'transition-colors',
                      isReorderable && 'cursor-default',
                      isDragging && 'opacity-40 bg-muted/80',
                      isOver && 'border-t-2 border-primary bg-primary/5',
                    )}
                  >
                    {isReorderable && (
                      <TableCell className="w-[90px] py-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                            title="Arrastar para reordenar"
                            aria-label="Arrastar para reordenar"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-semibold text-muted-foreground min-w-[18px] text-center">
                            {index + 1}
                          </span>
                          <div className="flex flex-col">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === 0 || isReordering}
                              onClick={() => handleMove(index, 'up')}
                              className="h-5 w-5 p-0 hover:bg-muted text-muted-foreground"
                              title="Mover para cima"
                              aria-label="Mover para cima"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === records.length - 1 || isReordering}
                              onClick={() => handleMove(index, 'down')}
                              className="h-5 w-5 p-0 hover:bg-muted text-muted-foreground"
                              title="Mover para baixo"
                              aria-label="Mover para baixo"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {displayFields.map((f) => (
                      <TableCell key={f.name} className="max-w-[200px] truncate">
                        {f.type === 'bool' && f.name === 'is_active' ? (
                          <Switch
                            checked={!!r[f.name]}
                            onCheckedChange={() => handleToggle(r.id, f.name, r[f.name])}
                          />
                        ) : (
                          formatValue(r[f.name], f, r)
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(r.created).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/${collectionName}/${r.id}/edit`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => initiateDelete(r.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => {
          if (!o) {
            setDeleteId(null)
            setBlockingWarning(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {blockingWarning ? 'Não é possível excluir' : 'Confirmar exclusão'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {blockingWarning ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium block">
                  {blockingWarning}
                </span>
              ) : (
                'Esta ação não pode ser desfeita. O registro será permanentemente excluído.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {blockingWarning ? (
              <AlertDialogAction
                onClick={() => {
                  setDeleteId(null)
                  setBlockingWarning(null)
                }}
              >
                Entendi
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {deleting ? 'Excluindo...' : 'Excluir'}
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
