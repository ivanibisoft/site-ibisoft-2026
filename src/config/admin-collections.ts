import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Users,
  Mail,
  Layers,
  ListChecks,
  LayoutGrid,
  FolderTree,
  FileText,
  Home,
  Image,
  FileArchive,
} from 'lucide-react'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'bool'
  | 'email'
  | 'select'
  | 'file'
  | 'relation'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  relationCollection?: string
  relationLabel?: string
  listDisplay?: boolean
}

export interface CollectionConfig {
  name: string
  label: string
  singularLabel: string
  icon: LucideIcon
  fields: FieldConfig[]
}

export const COLLECTIONS: CollectionConfig[] = [
  {
    name: 'cases',
    label: 'Cases',
    singularLabel: 'Case',
    icon: Briefcase,
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true, listDisplay: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea' },
      { name: 'category', label: 'Categoria', type: 'text', listDisplay: true },
      { name: 'client_name', label: 'Cliente', type: 'text', listDisplay: true },
      { name: 'image', label: 'Imagem', type: 'file' },
      { name: 'content', label: 'Conteúdo', type: 'textarea' },
      { name: 'featured', label: 'Destacado', type: 'bool', listDisplay: true },
    ],
  },
  {
    name: 'team_members',
    label: 'Equipe',
    singularLabel: 'Membro',
    icon: Users,
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'role', label: 'Cargo', type: 'text', required: true, listDisplay: true },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'photo', label: 'Foto', type: 'file' },
      { name: 'order', label: 'Ordem', type: 'number', listDisplay: true },
    ],
  },
  {
    name: 'leads',
    label: 'Leads',
    singularLabel: 'Lead',
    icon: Mail,
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'email', label: 'E-mail', type: 'email', required: true, listDisplay: true },
      { name: 'phone', label: 'Telefone', type: 'text', listDisplay: true },
      { name: 'message', label: 'Mensagem', type: 'textarea', required: true },
      { name: 'source_page', label: 'Origem', type: 'text', listDisplay: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['new', 'contacted', 'closed'],
        listDisplay: true,
      },
    ],
  },
  {
    name: 'segments',
    label: 'Segmentos',
    singularLabel: 'Segmento',
    icon: Layers,
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true, listDisplay: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea' },
      { name: 'icon', label: 'Ícone', type: 'text' },
      { name: 'image', label: 'Imagem', type: 'file' },
    ],
  },
  {
    name: 'segment_challenges',
    label: 'Desafios',
    singularLabel: 'Desafio',
    icon: ListChecks,
    fields: [
      {
        name: 'segment',
        label: 'Segmento',
        type: 'relation',
        required: true,
        relationCollection: 'segments',
        relationLabel: 'title',
        listDisplay: true,
      },
      { name: 'title', label: 'Título', type: 'text', required: true, listDisplay: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true },
      { name: 'order', label: 'Ordem', type: 'number', listDisplay: true },
    ],
  },
  {
    name: 'modules',
    label: 'Módulos',
    singularLabel: 'Módulo',
    icon: LayoutGrid,
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true },
      { name: 'icon', label: 'Ícone', type: 'text' },
      { name: 'order', label: 'Ordem', type: 'number', listDisplay: true },
    ],
  },
  {
    name: 'resource_groups',
    label: 'Grupos de Recursos',
    singularLabel: 'Grupo',
    icon: FolderTree,
    fields: [
      {
        name: 'module',
        label: 'Módulo',
        type: 'relation',
        required: true,
        relationCollection: 'modules',
        relationLabel: 'name',
        listDisplay: true,
      },
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'order', label: 'Ordem', type: 'number', listDisplay: true },
    ],
  },
  {
    name: 'resources',
    label: 'Recursos',
    singularLabel: 'Recurso',
    icon: FileText,
    fields: [
      {
        name: 'group',
        label: 'Grupo',
        type: 'relation',
        required: true,
        relationCollection: 'resource_groups',
        relationLabel: 'name',
        listDisplay: true,
      },
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true },
      { name: 'order', label: 'Ordem', type: 'number', listDisplay: true },
    ],
  },
  {
    name: 'home_config',
    label: 'Config. Home',
    singularLabel: 'Configuração',
    icon: Home,
    fields: [
      { name: 'hero_image', label: 'Imagem Hero', type: 'file' },
      { name: 'hero_title', label: 'Título Hero', type: 'text', listDisplay: true },
      { name: 'hero_subtitle', label: 'Subtítulo Hero', type: 'text', listDisplay: true },
    ],
  },
  {
    name: 'partner_logos',
    label: 'Logos Parceiros',
    singularLabel: 'Logo',
    icon: Image,
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'logo', label: 'Logo', type: 'file', required: true },
      { name: 'order_number', label: 'Ordem', type: 'number', listDisplay: true },
      { name: 'is_active', label: 'Ativo', type: 'bool', listDisplay: true },
      {
        name: 'segment',
        label: 'Segmento',
        type: 'relation',
        relationCollection: 'segments',
        relationLabel: 'title',
        listDisplay: true,
      },
    ],
  },
  {
    name: 'site_assets',
    label: 'Assets do Site',
    singularLabel: 'Asset',
    icon: FileArchive,
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'asset_file', label: 'Arquivo', type: 'file' },
      { name: 'alt_text', label: 'Texto Alternativo', type: 'text' },
      { name: 'mime_type', label: 'MIME Type', type: 'text', listDisplay: true },
    ],
  },
]
