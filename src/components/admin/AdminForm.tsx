import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { COLLECTIONS } from '@/config/admin-collections'
import { getList, getOne, createRecord, updateRecord, getFileUrl } from '@/services/admin'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { ArrowLeft, Save } from 'lucide-react'

interface AdminFormProps {
  collectionName: string
  recordId?: string
}

export function AdminForm({ collectionName, recordId }: AdminFormProps) {
  const config = COLLECTIONS.find((c) => c.name === collectionName)
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [relationData, setRelationData] = useState<Record<string, any[]>>({})
  const [dynamicOptionsData, setDynamicOptionsData] = useState<Record<string, string[]>>({})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(!!recordId)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!recordId) return
    getOne(collectionName, recordId)
      .then((r) => {
        setFormData(r)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Registro não encontrado')
        navigate(`/admin/${collectionName}`)
      })
  }, [recordId, collectionName, navigate])

  useEffect(() => {
    const relFields = config?.fields.filter((f) => f.type === 'relation') || []
    relFields.forEach((f) => {
      getList(f.relationCollection!)
        .then((d) => setRelationData((p) => ({ ...p, [f.name]: d })))
        .catch(() => {})
    })

    const dynamicSelectFields =
      config?.fields.filter((f) => f.type === 'select' && f.optionsSourceCollection) || []
    dynamicSelectFields.forEach((f) => {
      const sourceCol = f.optionsSourceCollection!
      const sourceField = f.optionsSourceField || 'name'
      getList(sourceCol, 'order,name')
        .then((list) => {
          const options = list
            .map((item: any) => item[sourceField])
            .filter((val: any) => typeof val === 'string' && val.trim().length > 0)
          setDynamicOptionsData((p) => ({ ...p, [f.name]: options }))
        })
        .catch((err) => {
          console.error(`Erro ao carregar opções dinâmicas para ${f.name}:`, err)
        })
    })
  }, [config])

  const handleChange = (name: string, value: any) => {
    setFormData((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleFileChange = (name: string, file: File | null) => {
    setFiles((p) => ({ ...p, [name]: file }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    // Client-side validation for constraints (min, max)
    const newErrors: FieldErrors = {}
    config.fields.forEach((field) => {
      const val = formData[field.name]
      if (field.type === 'number' && val !== null && val !== undefined && val !== '') {
        const num = Number(val)
        if (Number.isNaN(num)) {
          newErrors[field.name] = 'Informe um valor numérico válido.'
        } else {
          if (field.min !== undefined && num < field.min) {
            newErrors[field.name] = `O valor mínimo permitido é ${field.min}.`
          }
          if (field.max !== undefined && num > field.max) {
            newErrors[field.name] = `O valor máximo permitido é ${field.max}.`
          }
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSaving(false)
      toast.error('Corrija os erros no formulário antes de salvar')
      return
    }

    try {
      const hasFiles = Object.values(files).some((f) => f !== null)
      let data: any = { ...formData }
      if (hasFiles) {
        data = new FormData()
        for (const [k, v] of Object.entries(formData)) {
          if (v !== null && v !== undefined) data.append(k, String(v))
        }
        for (const [k, f] of Object.entries(files)) {
          if (f) data.append(k, f)
        }
      }
      if (recordId) {
        await updateRecord(collectionName, recordId, data)
      } else {
        await createRecord(collectionName, data)
      }
      toast.success('Registro salvo com sucesso')
      navigate(`/admin/${collectionName}`)
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Erro ao salvar registro')
    } finally {
      setSaving(false)
    }
  }

  if (!config) return <div className="text-muted-foreground">Coleção não encontrada</div>
  if (loading) return <div className="animate-pulse text-muted-foreground">Carregando...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/admin/${collectionName}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {recordId ? 'Editar' : 'Criar'} {config.singularLabel}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={(v) => handleChange(field.name, v)}
            onFileChange={(f) => handleFileChange(field.name, f)}
            relationOptions={relationData[field.name]}
            dynamicOptions={dynamicOptionsData[field.name]}
            error={errors[field.name]}
            fileUrl={
              recordId && formData[field.name]
                ? getFileUrl(collectionName, recordId, formData[field.name])
                : null
            }
          />
        ))}
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={`/admin/${collectionName}`}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
