import { useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Plus,
  Trash2,
  Columns,
  Rows,
  Loader2,
  Undo2,
  Redo2,
  Quote,
  Minus,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        allowBase64: true,
        inline: false,
        HTMLAttributes: {
          class: 'rich-editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      // Return empty string if editor is effectively blank
      const html = ed.getHTML()
      if (ed.isEmpty) {
        onChange('')
      } else {
        onChange(html)
      }
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[280px] max-h-[650px] overflow-y-auto px-4 py-3 focus:outline-none text-foreground/90 leading-relaxed text-sm prose max-w-none',
      },
    },
  })

  // Handle image upload to PocketBase site_assets
  const handleFileUpload = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    const toastId = toast.loading('Enviando imagem...')
    try {
      const formData = new FormData()
      formData.append('name', `Blog Inline - ${file.name.slice(0, 30)}`)
      // Slug seguro e único
      const cleanSlug = `blog-inline-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20)}`
      formData.append('slug', cleanSlug)
      formData.append('asset_file', file)
      formData.append('alt_text', file.name)
      formData.append('mime_type', file.type)

      const created = await pb.collection('site_assets').create(formData)
      const fileUrl = `${pb.baseURL}/api/files/site_assets/${created.id}/${created.asset_file}`

      if (editor) {
        editor.chain().focus().setImage({ src: fileUrl, alt: file.name }).run()
      }
      toast.success('Imagem inserida com sucesso!', { id: toastId })
    } catch (err: any) {
      console.error('Erro ao enviar imagem inline:', err)
      const msg = err?.message || 'Falha ao salvar imagem no servidor.'
      toast.error(`Erro no upload: ${msg}`, { id: toastId })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const openLinkDialog = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || ''
    setLinkUrl(previousUrl)
    setLinkDialogOpen(true)
  }

  const applyLink = () => {
    if (!editor) return
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      let finalUrl = linkUrl.trim()
      if (
        !/^https?:\/\//i.test(finalUrl) &&
        !finalUrl.startsWith('/') &&
        !finalUrl.startsWith('mailto:')
      ) {
        finalUrl = `https://${finalUrl}`
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run()
    }
    setLinkDialogOpen(false)
  }

  const applyImageUrl = () => {
    if (!editor || !imageUrl.trim())
      return editor
        .chain()
        .focus()
        .setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || 'Imagem do artigo' })
        .run()
    setImageUrl('')
    setImageAlt('')
    setImageDialogOpen(false)
  }

  const applyInsertTable = () => {
    if (!editor) return
    const rows = Math.max(1, Math.min(20, tableRows || 3))
    const cols = Math.max(1, Math.min(10, tableCols || 3))
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setTableDialogOpen(false)
  }

  if (!editor) {
    return (
      <div className="border rounded-md p-4 text-sm text-muted-foreground">
        Carregando editor...
      </div>
    )
  }

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-all">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
      />

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/40 text-muted-foreground select-none">
        {/* Undo / Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Desfazer (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refazer (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 px-2 text-xs font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Título 2 (H2)"
        >
          <Heading2 className="h-4 w-4 mr-1" />
          H2
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 px-2 text-xs font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Título 3 (H3)"
        >
          <Heading3 className="h-4 w-4 mr-1" />
          H3
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Text Styles */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrito (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Itálico (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Alinhar à esquerda"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Centralizar"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Alinhar à direita"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justificar"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista com marcadores"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Linha divisória"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Links */}
        <Button
          type="button"
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-primary/10 text-primary' : ''}`}
          onClick={openLinkDialog}
          title="Inserir / editar link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        {editor.isActive('link') && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remover link"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        )}

        <div className="h-5 w-px bg-border mx-1" />

        {/* Image Dropdown: Upload from PC or URL */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-medium"
              disabled={isUploading}
              title="Inserir imagem"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin text-primary" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-1 text-primary" />
                  <span>Imagem</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click()
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Fazer upload do computador
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Inserir imagem por URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Table Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive('table') ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-8 px-2 text-xs font-medium ${editor.isActive('table') ? 'bg-primary/10 text-primary' : ''}`}
              title="Tabela"
            >
              <TableIcon className="h-4 w-4 mr-1 text-primary" />
              <span>Tabela</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {!editor.isActive('table') ? (
              <DropdownMenuItem onClick={() => setTableDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar tabela...
              </DropdownMenuItem>
            ) : (
              <>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Editar Tabela
                </div>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                  <Rows className="h-4 w-4 mr-2" />
                  Adicionar linha acima
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <Rows className="h-4 w-4 mr-2" />
                  Adicionar linha abaixo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                  Excluir linha
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                  <Columns className="h-4 w-4 mr-2" />
                  Adicionar coluna à esquerda
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Columns className="h-4 w-4 mr-2" />
                  Adicionar coluna à direita
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                  Excluir coluna
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                  Alternar cabeçalho
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
                  Mesclar células
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
                  Dividir célula
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir tabela inteira
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Editor Content Area */}
      <div className="tiptap-content-container relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && placeholder && (
          <div className="pointer-events-none absolute top-3 left-4 text-sm text-muted-foreground/60">
            {placeholder}
          </div>
        )}
      </div>

      {/* Dialog: Link */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inserir / Editar Link</DialogTitle>
            <DialogDescription>
              Cole ou digite a URL que o link deve abrir ao ser clicado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="text"
                placeholder="https://exemplo.com.br"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    applyLink()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={applyLink}>
              Aplicar Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Image by URL */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inserir Imagem por URL</DialogTitle>
            <DialogDescription>
              Cole a URL pública da imagem que deseja exibir no corpo do artigo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="image-url">URL da Imagem</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://exemplo.com/imagem.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt">Texto alternativo (Alt)</Label>
              <Input
                id="image-alt"
                type="text"
                placeholder="Descrição acessível da imagem"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={applyImageUrl} disabled={!imageUrl.trim()}>
              Inserir Imagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Create Table */}
      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Inserir Nova Tabela</DialogTitle>
            <DialogDescription>Defina o número inicial de linhas e colunas.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="table-rows">Linhas</Label>
              <Input
                id="table-rows"
                type="number"
                min={1}
                max={20}
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value, 10) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table-cols">Colunas</Label>
              <Input
                id="table-cols"
                type="number"
                min={1}
                max={10}
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTableDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={applyInsertTable}>
              Criar Tabela
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
