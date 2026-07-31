import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FieldConfig } from '@/config/admin-collections'

interface FormFieldProps {
  field: FieldConfig
  value: any
  onChange: (value: any) => void
  onFileChange?: (file: File | null) => void
  relationOptions?: any[]
  error?: string
  fileUrl?: string | null
}

export function FormField({
  field,
  value,
  onChange,
  onFileChange,
  relationOptions,
  error,
  fileUrl,
}: FormFieldProps) {
  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return <Textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} />
      case 'number':
        return (
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          />
        )
      case 'bool':
        return <Switch checked={!!value} onCheckedChange={onChange} />
      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'file':
        return (
          <div className="space-y-2">
            {fileUrl && (
              <p className="text-sm text-muted-foreground">
                Arquivo atual:{' '}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  visualizar
                </a>
              </p>
            )}
            <Input type="file" onChange={(e) => onFileChange?.(e.target.files?.[0] || null)} />
          </div>
        )
      case 'relation':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {relationOptions?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r[field.relationLabel || 'name']}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            type={field.type === 'email' ? 'email' : 'text'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </Label>
      {renderInput()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
