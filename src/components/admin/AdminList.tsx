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
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Loader2,
  Sparkles,
  Compass,
  Eye,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
  const [selectedLeadJourney, setSelectedLeadJourney] = useState<any | null>(null)

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
      // Se a coleção for do tipo singleton (ex: home_config, email_config):
      // se já possuir registro, redireciona diretamente para a tela de edição do registro existente;
      // se ainda não possuir, direciona para a tela de novo registro
      if (config?.isSingleton) {
        if (data.length > 0) {
          navigate(`/admin/${collectionName}/${data[0].id}/edit`, { replace: true })
        } else {
          navigate(`/admin/${collectionName}/new`, { replace: true })
        }
        return
      }
      setRecords(data)
    } catch {
      toast.error('Erro ao carregar registros')
    } finally {
      setLoading(false)
    }
  }, [collectionName, expandFields, sortBy, config?.isSingleton, navigate])

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
                    {displayFields.map((f) => {
                      if (collectionName === 'leads' && f.name === 'primary_interest') {
                        const interest = r.primary_interest || 'Contato Direto'
                        const isHighlight =
                          interest !== 'Contato Direto' &&
                          interest !== '-' &&
                          interest !== 'Exit Intent (Retenção)'
                        return (
                          <TableCell key={f.name} className="max-w-[220px]">
                            <div className="flex items-center gap-1.5">
                              {isHighlight ? (
                                <Badge
                                  variant="secondary"
                                  className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium truncate py-0.5 px-2 text-xs flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3 shrink-0 text-emerald-600" />
                                  <span className="truncate">{interest}</span>
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">{interest}</span>
                              )}
                            </div>
                          </TableCell>
                        )
                      }

                      if (collectionName === 'leads' && f.name === 'journey_summary') {
                        const summary = r.journey_summary || '-'
                        const hasSteps =
                          r.journey_details?.steps?.length > 0 ||
                          (summary && summary !== '-' && summary !== 'Contato Direto')
                        return (
                          <TableCell key={f.name} className="max-w-[260px]">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="text-xs text-muted-foreground truncate"
                                title={summary}
                              >
                                {summary}
                              </span>
                              {hasSteps && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-1.5 text-xs text-primary hover:text-primary/80 shrink-0"
                                  onClick={() => setSelectedLeadJourney(r)}
                                  title="Ver jornada completa percorrida pelo visitante"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Ver
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        )
                      }

                      return (
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
                      )
                    })}
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

      {/* Modal de Detalhamento da Jornada do Lead */}
      {collectionName === 'leads' && (
        <Dialog
          open={!!selectedLeadJourney}
          onOpenChange={(open) => {
            if (!open) setSelectedLeadJourney(null)
          }}
        >
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-lg">
                    Jornada de Navegação do Lead: {selectedLeadJourney?.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">
                    {selectedLeadJourney?.email} • Origem:{' '}
                    {selectedLeadJourney?.source_page || 'contato'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Card de Interesse Principal */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Alerta de Interesse do Lead
                </div>
                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-100">
                  {selectedLeadJourney?.primary_interest || 'Contato Geral'}
                </p>
                {selectedLeadJourney?.journey_summary && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Resumo: {selectedLeadJourney.journey_summary}
                  </p>
                )}
              </div>

              {/* Lista dos Passos da Jornada */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Páginas Navegadas na Sessão (
                  {selectedLeadJourney?.journey_details?.steps?.length || 0})
                </h4>
                {selectedLeadJourney?.journey_details?.steps?.length ? (
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/20">
                    {selectedLeadJourney.journey_details.steps.map((step: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 pb-2 last:pb-0 border-b last:border-0 border-muted"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-foreground truncate">
                              {step.section || 'Página'}
                            </span>
                            {step.created && (
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {new Date(step.created).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {step.title || step.path}
                          </p>
                          <code className="text-[10px] text-slate-500 bg-muted px-1 py-0.5 rounded">
                            {step.path}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                    {selectedLeadJourney?.journey_summary ||
                      'Nenhum evento detalhado registrado para esta sessão.'}
                  </div>
                )}
              </div>

              {/* Mensagem enviada pelo lead */}
              {selectedLeadJourney?.message && (
                <div className="border-t pt-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Mensagem Enviada
                  </h4>
                  <div className="text-xs bg-muted/30 p-2.5 rounded border text-foreground whitespace-pre-wrap">
                    {selectedLeadJourney.message}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

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
