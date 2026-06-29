import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

export default function AdminHomeConfig() {
  const [configId, setConfigId] = useState<string | null>(null)
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const list = await pb.collection('home_config').getFullList({ sort: 'created' })
        if (list.length > 0) {
          const config = list[0]
          setConfigId(config.id)
          setHeroTitle(config.hero_title || '')
          setHeroSubtitle(config.hero_subtitle || '')
          if (config.hero_image) {
            setImagePreviewUrl(
              `${pb.baseURL}/api/files/home_config/${config.id}/${config.hero_image}`,
            )
          }
        }
      } catch (error) {
        console.error('Error loading home config:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (configId) {
        if (imageFile) {
          const formData = new FormData()
          formData.append('hero_title', heroTitle)
          formData.append('hero_subtitle', heroSubtitle)
          formData.append('hero_image', imageFile)
          await pb.collection('home_config').update(configId, formData)
        } else {
          await pb.collection('home_config').update(configId, {
            hero_title: heroTitle,
            hero_subtitle: heroSubtitle,
          })
        }
      } else {
        const formData = new FormData()
        formData.append('hero_title', heroTitle)
        formData.append('hero_subtitle', heroSubtitle)
        if (imageFile) formData.append('hero_image', imageFile)
        const record = await pb.collection('home_config').create(formData)
        setConfigId(record.id)
      }
      toast({ title: 'Configurações salvas com sucesso' })
      setImageFile(null)
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      const message = Object.values(fieldErrors).join(' ') || 'Erro ao salvar configurações.'
      toast({ title: 'Erro ao salvar', description: message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações da Home</h2>
        <p className="text-muted-foreground">
          Gerencie a imagem e textos do hero da página inicial.
        </p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Hero da Página Inicial</CardTitle>
          <CardDescription>Atualize a imagem e os textos exibidos no topo da home.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Título Principal</Label>
            <Input
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Título exibido no hero"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="resize-none"
              placeholder="Subtítulo exibido abaixo do título"
            />
          </div>
          <div className="space-y-2">
            <Label>Imagem do Hero</Label>
            {imagePreviewUrl && (
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imagePreviewUrl}
                  alt="Pré-visualização do hero"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="bg-white"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setImageFile(file)
                if (file) {
                  setImagePreviewUrl(URL.createObjectURL(file))
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 800x600px. JPG, PNG, WebP ou SVG.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
