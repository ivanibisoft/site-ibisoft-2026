import { useState, useEffect, useCallback } from 'react'
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
import { Plus, Pencil, Trash2 } from 'lucide-react'

function formatValue(value: any, field: FieldConfig, record?: any): string {
  if (value === null || value === undefined || value === '') return '-'
  if (field.type === 'bool') return value ? 'Sim' : 'Não'
  if (field.type === 'file') return value.split('/').pop() || 'Arquivo'
  if (field.type === 'relation') {
    const expanded = record?.expand?.[field.name]
    if (expanded && field.relationLabel) {
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

  const expandFields =
    config?.fields
      .filter((f) => f.type === 'relation')
      .map((f) => f.name)
      .join(',') || undefined
  const sortBy = config?.defaultSort || '-created'

  const loadData = useCallback(async () => {
    try {
      setRecords(await getList(collectionName, sortBy, expandFields))
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
    loadData()
  })

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
        <h1 className="text-2xl font-bold">{config.label}</h1>
        <Button onClick={() => navigate(`/admin/${collectionName}/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Criar
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {displayFields.map((f) => (
                <TableHead key={f.name}>{f.label}</TableHead>
              ))}
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={displayFields.length + 2}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              records.map((r) => (
                <TableRow key={r.id}>
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
              ))
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
