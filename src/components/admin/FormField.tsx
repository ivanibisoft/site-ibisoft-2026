import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
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
  dynamicOptions?: string[]
  error?: string
  fileUrl?: string | null
}

export function FormField({
  field,
  value,
  onChange,
  onFileChange,
  relationOptions,
  dynamicOptions,
  error,
  fileUrl,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const renderInput = () => {
    switch (field.type) {
      case 'password':
        return (
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        )
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={5}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={field.placeholder}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          />
        )
      case 'bool':
        return <Switch checked={!!value} onCheckedChange={onChange} />
      case 'select': {
        const availableOptions =
          dynamicOptions && dynamicOptions.length > 0 ? dynamicOptions : field.options || []
        const hasCurrentValueInOptions = !value || availableOptions.includes(value)
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {!hasCurrentValueInOptions && value && (
                <SelectItem key={value} value={value}>
                  {value} (atual - não catalogada)
                </SelectItem>
              )}
              {availableOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
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
      {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
