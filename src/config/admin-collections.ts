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
  MessageSquareQuote,
  MessageSquare,
  Newspaper,
  Tags,
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
  min?: number
  max?: number
  step?: number
  placeholder?: string
  helpText?: string
  options?: string[]
  optionsSourceCollection?: string
  optionsSourceField?: string
  optionsSourceFilter?: string
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
  defaultSort?: string
}

export const COLLECTIONS: CollectionConfig[] = [
  {
    name: 'cases',
    label: 'Cases',
    singularLabel: 'Case',
    icon: Briefcase,
    fields: [
      { name: 'image', label: 'Imagem', type: 'file', required: true, listDisplay: true },
      { name: 'description', label: 'Texto', type: 'textarea', required: true, listDisplay: true },
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
      {
        name: 'typewriter_pause_seconds',
        label: 'Pausa após cada mensagem do carrossel (segundos)',
        type: 'number',
        min: 1,
        max: 15,
        step: 0.5,
        placeholder: '3',
        helpText:
          'Tempo de espera antes de avançar para a próxima mensagem (entre 1 e 15 segundos). Padrão: 3',
        listDisplay: true,
      },
      {
        name: 'typewriter_typing_speed',
        label: 'Velocidade de digitação do carrossel (caracteres por segundo)',
        type: 'number',
        min: 10,
        max: 120,
        step: 1,
        placeholder: '35',
        helpText: 'Velocidade com que o texto é digitado (entre 10 e 120 cps). Padrão: 35',
        listDisplay: true,
      },
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
    label: 'Conteúdos do Site',
    singularLabel: 'Conteúdo',
    icon: FileArchive,
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, listDisplay: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'asset_file', label: 'Arquivo', type: 'file' },
      { name: 'alt_text', label: 'Texto Alternativo', type: 'text' },
      { name: 'mime_type', label: 'MIME Type', type: 'text', listDisplay: true },
    ],
  },
  {
    name: 'hero_messages',
    label: 'Mensagens do Hero',
    singularLabel: 'Mensagem',
    icon: MessageSquare,
    defaultSort: 'order',
    fields: [
      { name: 'text', label: 'Texto', type: 'text', required: true, listDisplay: true },
      { name: 'order', label: 'Ordem', type: 'number', listDisplay: true },
      { name: 'is_active', label: 'Ativo', type: 'bool', listDisplay: true },
    ],
  },
  {
    name: 'testimonials',
    label: 'Comentários',
    singularLabel: 'Comentário',
    icon: MessageSquareQuote,
    fields: [
      { name: 'name', label: 'Nome do cliente', type: 'text', required: true, listDisplay: true },
      { name: 'role', label: 'Cargo / Empresa', type: 'text', listDisplay: true },
      { name: 'content', label: 'Comentário', type: 'textarea', required: true, listDisplay: true },
      { name: 'order', label: 'Ordem de exibição', type: 'number', listDisplay: true },
      { name: 'is_active', label: 'Ativo', type: 'bool', listDisplay: true },
    ],
  },
  {
    name: 'post_categories',
    label: 'Categorias do Blog',
    singularLabel: 'Categoria',
    icon: Tags,
    defaultSort: 'order',
    fields: [
      { name: 'name', label: 'Nome da Categoria', type: 'text', required: true, listDisplay: true },
      { name: 'order', label: 'Ordem', type: 'number', listDisplay: true },
      { name: 'is_active', label: 'Ativo', type: 'bool', listDisplay: true },
    ],
  },
  {
    name: 'posts',
    label: 'Blog / Notícias',
    singularLabel: 'Publicação',
    icon: Newspaper,
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true, listDisplay: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'summary', label: 'Resumo', type: 'textarea' },
      { name: 'content', label: 'Conteúdo', type: 'textarea' },
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        optionsSourceCollection: 'post_categories',
        optionsSourceField: 'name',
        options: [
          'Atacadista e Distribuidora',
          'Comércio Exterior',
          'Estoque e Armazenagem',
          'Gestão Comercial e Vendas',
          'Gestão Empresarial',
          'Gestão Financeira',
          'Indústria e Produção',
          'Logística e Entregas',
          'Serviços',
          'Tecnologia e Inovação',
          'Tributação e Fiscal',
        ],
        listDisplay: true,
      },
      { name: 'image', label: 'Imagem', type: 'file' },
      { name: 'read_time', label: 'Tempo de leitura', type: 'text' },
      { name: 'published_at', label: 'Data de publicação', type: 'text', listDisplay: true },
      { name: 'is_active', label: 'Ativo', type: 'bool', listDisplay: true },
    ],
  },
]
