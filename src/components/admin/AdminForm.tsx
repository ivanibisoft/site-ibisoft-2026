import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { COLLECTIONS } from '@/config/admin-collections'
import {
  getList,
  getOne,
  createRecord,
  updateRecord,
  getFileUrl,
  sendTestEmail,
} from '@/services/admin'
import { extractFieldErrors, getErrorMessage, type FieldErrors } from '@/lib/pocketbase/errors'
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react'

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
  const [testingEmail, setTestingEmail] = useState(false)

  useEffect(() => {
    if (!recordId) return
    getOne(collectionName, recordId)
      .then((r) => {
        const initialData = { ...r }
        // Para campos de senha, não preenchemos com a hash/senha por segurança
        config?.fields.forEach((f) => {
          if (f.type === 'password') {
            initialData[f.name] = ''
          }
        })
        setFormData(initialData)
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

  const handleTestEmail = async () => {
    setTestingEmail(true)
    const toastId = toast.loading('Enviando e-mail de teste...')
    try {
      const res = await sendTestEmail()
      if (res.success) {
        toast.success(res.message || 'E-mail de teste enviado com sucesso!', {
          id: toastId,
          duration: 6000,
        })
      } else {
        toast.error(res.message || 'Falha ao enviar e-mail de teste.', {
          id: toastId,
          duration: 7000,
        })
      }
    } catch (err: any) {
      console.error('Erro ao testar envio de e-mail:', err)
      const detail =
        err?.response?.message || err?.message || 'Falha na conexão ao enviar e-mail de teste.'
      toast.error(`Falha no teste: ${detail}`, {
        id: toastId,
        duration: 8000,
      })
    } finally {
      setTestingEmail(false)
    }
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
      // Construir payload limpo contendo apenas os campos configurados na coleção
      // evitando enviar campos de sistema (ex: id, created, updated, expand, etc.)
      const allowedFieldMap = new Map(config.fields.map((f) => [f.name, f]))
      let data: any = {}

      for (const [fieldName, fieldDef] of allowedFieldMap.entries()) {
        if (fieldName in formData) {
          let val = formData[fieldName]

          // Sanitização por tipo de campo
          if (fieldDef.type === 'number') {
            if (val === '' || val === null || val === undefined) {
              val = null
            } else {
              const parsed = Number(val)
              val = Number.isNaN(parsed) ? null : parsed
            }
          } else if (fieldDef.type === 'bool') {
            val = Boolean(val)
          } else if (fieldDef.type === 'password') {
            // Se for edição e o campo de senha estiver vazio, não envia para manter a senha existente
            if (recordId && (val === undefined || val === null || String(val).trim() === '')) {
              continue
            }
          }

          data[fieldName] = val
        }
      }

      // Se for criação em coleção reordenável e não há ordem definida, definir como última
      if (
        !recordId &&
        config.reorderable &&
        config.orderField &&
        data[config.orderField] === undefined
      ) {
        try {
          const existing = await getList(collectionName, `-${config.orderField}`)
          const maxOrder =
            existing.length > 0 && typeof existing[0][config.orderField] === 'number'
              ? existing[0][config.orderField]
              : existing.length
          data[config.orderField] = maxOrder + 1
        } catch {
          data[config.orderField] = 1
        }
      }

      if (hasFiles) {
        const formDataPayload = new FormData()
        for (const [k, v] of Object.entries(data)) {
          if (v !== null && v !== undefined) formDataPayload.append(k, String(v))
        }
        for (const [k, f] of Object.entries(files)) {
          if (f) formDataPayload.append(k, f)
        }
        data = formDataPayload
      }
      if (recordId) {
        await updateRecord(collectionName, recordId, data)
      } else {
        await createRecord(collectionName, data)
      }
      toast.success('Registro salvo com sucesso')
      navigate(`/admin/${collectionName}`)
    } catch (err) {
      console.error(`Erro ao salvar na coleção ${collectionName}:`, err)
      const fieldErrors = extractFieldErrors(err)
      setErrors(fieldErrors)
      const detail = getErrorMessage(err)
      toast.error(`Erro ao salvar: ${detail}`)
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
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to={`/admin/${collectionName}`}>Cancelar</Link>
            </Button>
          </div>

          {collectionName === 'email_config' && recordId && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleTestEmail}
              disabled={testingEmail || saving}
              title="Envia um e-mail de teste para o e-mail do administrador configurado"
            >
              {testingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" />
                  Testando envio...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2 text-primary" />
                  Testar Envio de E-mail
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
