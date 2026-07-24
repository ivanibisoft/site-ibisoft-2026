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
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit2, Trash2, FileText, ImageIcon, AlertCircle } from 'lucide-react'

export default function AdminSiteAssets() {
  const [assets, setAssets] = useState<any[]>([])
  const [reloadKey, setReloadKey] = useState(0)

  const load = async () => {
    try {
      const list = await pb.collection('site_assets').getFullList({ sort: 'name' })
      setAssets(list)
    } catch (error) {
      console.error('Error loading assets:', error)
    }
  }

  useEffect(() => {
    load()
  }, [reloadKey])

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este asset?')) {
      try {
        await pb.collection('site_assets').delete(id)
        toast({ title: 'Asset excluído com sucesso' })
        setReloadKey((k) => k + 1)
      } catch {
        toast({ title: 'Erro ao excluir asset', variant: 'destructive' })
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assets do Site</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Alterações nos assets refletem imediatamente no site público.
          </p>
        </div>
        <AssetDialog onSaved={() => setReloadKey((k) => k + 1)} />
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold w-20 text-center">Preview</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Slug</TableHead>
              <TableHead className="font-semibold">Alt Text</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const fileUrl = asset.asset_file
                ? `${pb.baseURL}/api/files/site_assets/${asset.id}/${asset.asset_file}`
                : null
              const isPdf = asset.mime_type?.includes('pdf') || asset.asset_file?.endsWith('.pdf')
              return (
                <TableRow key={asset.id}>
                  <TableCell className="text-center">
                    {fileUrl ? (
                      isPdf ? (
                        <FileText className="h-10 w-10 text-gray-400 mx-auto" />
                      ) : (
                        <img
                          src={fileUrl}
                          alt={asset.alt_text || asset.name}
                          className="h-12 w-12 object-cover rounded mx-auto"
                        />
                      )
                    ) : (
                      <ImageIcon className="h-10 w-10 text-gray-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="text-sm text-gray-500 font-mono">{asset.slug}</TableCell>
                  <TableCell className="text-sm text-gray-500">{asset.alt_text || '—'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <AssetDialog asset={asset} onSaved={() => setReloadKey((k) => k + 1)} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(asset.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {assets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                  Nenhum asset encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function AssetDialog({ asset, onSaved }: { asset?: any; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(asset?.name || '')
  const [slug, setSlug] = useState(asset?.slug || '')
  const [altText, setAltText] = useState(asset?.alt_text || '')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(asset?.name || '')
      setSlug(asset?.slug || '')
      setAltText(asset?.alt_text || '')
      setFile(null)
      setErrors({})
    }
  }, [open, asset])

  const save = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('slug', slug)
      formData.append('alt_text', altText)
      if (file) {
        formData.append('asset_file', file)
        formData.append('mime_type', file.type)
      }
      if (asset) {
        await pb.collection('site_assets').update(asset.id, formData)
      } else {
        await pb.collection('site_assets').create(formData)
      }
      toast({ title: 'Asset salvo com sucesso' })
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
          variant={asset ? 'outline' : 'default'}
          size={asset ? 'sm' : 'default'}
          className={asset ? 'h-8' : ''}
        >
          {asset ? (
            <>
              <Edit2 className="w-3 h-3 mr-2" /> Editar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Novo Asset
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{asset ? 'Editar Asset' : 'Novo Asset'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Logo Principal"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Ex: logo-principal"
              disabled={!!asset}
            />
            {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
          </div>
          <div className="space-y-2">
            <Label>Arquivo (imagem ou PDF)</Label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
              className="bg-white"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {errors.asset_file && <p className="text-red-500 text-sm">{errors.asset_file}</p>}
            {asset?.asset_file && !file && (
              <p className="text-xs text-gray-500">Arquivo atual: {asset.asset_file}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Texto Alternativo (alt)</Label>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descrição para acessibilidade"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving} className="flex-1">
              Salvar
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
