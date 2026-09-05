import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
  Home,
  BookOpen,
  Linkedin,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getBlogPostBySlug,
  getBlogPostImageUrl,
  getRecentBlogPosts,
  type BlogPost,
} from '@/services/blog'
import useRealtime from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const loadPost = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    try {
      const decodedSlug = decodeURIComponent(slug)
      const data = await getBlogPostBySlug(decodedSlug)
      setPost(data)

      if (data) {
        const recents = await getRecentBlogPosts(data.id, 3)
        setRecentPosts(recents)
      } else {
        setRecentPosts([])
      }
    } catch (err) {
      console.error('Failed to load blog post:', err)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  // Realtime updates
  useRealtime('posts', () => {
    loadPost()
  })

  // SEO basics: document.title and meta description
  useEffect(() => {
    const originalTitle = document.title
    let metaDescriptionEl = document.querySelector('meta[name="description"]')
    const originalDescription = metaDescriptionEl?.getAttribute('content') || ''

    if (post) {
      document.title = `${post.title} | Blog ibisoft`
      if (post.summary) {
        if (!metaDescriptionEl) {
          metaDescriptionEl = document.createElement('meta')
          metaDescriptionEl.setAttribute('name', 'description')
          document.head.appendChild(metaDescriptionEl)
        }
        metaDescriptionEl.setAttribute('content', post.summary)
      }
    } else if (!loading) {
      document.title = 'Artigo não encontrado | Blog ibisoft'
    }

    return () => {
      document.title = originalTitle
      if (metaDescriptionEl && originalDescription) {
        metaDescriptionEl.setAttribute('content', originalDescription)
      }
    }
  }, [post, loading])

  const handleCopyLink = async () => {
    const shareUrl = window.location.href
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      toast({
        title: 'Link copiado!',
        description: 'O link do artigo foi copiado para sua área de transferência.',
      })
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      toast({
        title: 'Não foi possível copiar',
        description: 'Selecione e copie o endereço na barra do navegador.',
        variant: 'destructive',
      })
    }
  }

  const handleShareWhatsApp = () => {
    const shareUrl = window.location.href
    const title = post?.title ? `${post.title} | Blog ibisoft` : 'Blog ibisoft'
    const text = encodeURIComponent(`Confira este artigo: "${title}"\n${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareLinkedIn = () => {
    const shareUrl = encodeURIComponent(window.location.href)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="animate-fade-in py-12 md:py-20">
        <div className="container max-w-4xl mx-auto px-4 space-y-8">
          <Skeleton className="h-6 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-80 md:h-[420px] w-full rounded-2xl" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  // 404 / Friendly Not Found State
  if (!post) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex items-center justify-center py-20">
        <div className="container max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            Artigo não encontrado
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            O artigo que você está procurando não existe, foi desativado ou o endereço está
            incorreto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="bg-primary">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o blog
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Página inicial</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const imageUrl = getBlogPostImageUrl(post)
  const formattedDate =
    post.published_at || (post.created ? new Date(post.created).toLocaleDateString('pt-BR') : '')

  return (
    <article className="animate-fade-in">
      {/* Breadcrumb & Navigation Topbar */}
      <div className="border-b bg-muted/20">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-muted-foreground"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Início</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[220px] sm:max-w-xs md:max-w-md">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-10 md:py-14 bg-gradient-to-b from-muted/30 to-background border-b">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 text-muted-foreground hover:text-foreground w-fit"
            >
              <Link to="/blog">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Voltar para o blog
              </Link>
            </Button>

            {/* Direct Share Buttons (Top) */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-muted-foreground mr-1 hidden md:inline">
                Compartilhar:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareWhatsApp}
                className="rounded-full gap-1.5 text-xs h-8 px-3 text-[#25D366] hover:text-[#20bd5c] hover:bg-[#25D366]/10 border-[#25D366]/30 hover:border-[#25D366]"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0 fill-current" />
                <span>WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLinkedIn}
                className="rounded-full gap-1.5 text-xs h-8 px-3 text-[#0A66C2] hover:text-[#084e96] hover:bg-[#0A66C2]/10 border-[#0A66C2]/30 hover:border-[#0A66C2]"
                title="Compartilhar no LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5 shrink-0 fill-current" />
                <span>LinkedIn</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="rounded-full gap-1.5 text-xs h-8 px-3"
                title="Copiar link do artigo"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600 font-medium">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar link</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {post.category && (
            <div className="mb-4">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/15 font-semibold px-3 py-1 text-xs uppercase tracking-wider rounded-full"
              >
                {post.category}
              </Badge>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-[1.15] mb-6">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 font-normal">
              {post.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground pt-4 border-t border-border/60">
            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-accent" />
                <span>Publicado em {formattedDate}</span>
              </div>
            )}
            {post.read_time && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" />
                <span>{post.read_time}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {imageUrl && (
        <div className="container max-w-4xl mx-auto px-4 mt-8 md:mt-12">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border aspect-[16/9] bg-muted">
            <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Article Body Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="prose prose-slate max-w-none text-foreground/90 text-base md:text-lg leading-relaxed whitespace-pre-line space-y-6">
            {post.content || post.summary}
          </div>

          {/* Bottom Back Button & Share */}
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para todos os artigos
              </Link>
            </Button>

            {/* Direct Share Buttons (Bottom) */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-muted-foreground mr-1">Compartilhar:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareWhatsApp}
                className="gap-1.5 text-xs rounded-full px-3 text-[#25D366] hover:text-[#20bd5c] hover:bg-[#25D366]/10 border-[#25D366]/30 hover:border-[#25D366]"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="h-4 w-4 shrink-0 fill-current" />
                <span>WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLinkedIn}
                className="gap-1.5 text-xs rounded-full px-3 text-[#0A66C2] hover:text-[#084e96] hover:bg-[#0A66C2]/10 border-[#0A66C2]/30 hover:border-[#0A66C2]"
                title="Compartilhar no LinkedIn"
              >
                <Linkedin className="h-4 w-4 shrink-0 fill-current" />
                <span>LinkedIn</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-1.5 text-xs rounded-full px-3"
                title="Copiar link do artigo"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Link copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copiar link</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Relevant Call-to-Action (Demonstração / Contato) */}
      <section className="py-16 bg-muted/40 border-y">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5"
          >
            Transforme sua gestão
          </Badge>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Quer ver na prática como a ibisoft impulsiona o seu negócio?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Agende uma demonstração gratuita e personalizada com nossos especialistas em ERP e
            descubra as soluções ideais para a sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-md"
            >
              <Link to="/quero-conhecer">
                Solicitar Demonstração <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/sobre-erp">Conhecer o Guia ERP</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related/Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold font-display text-foreground">
                  Outras publicações recomendadas
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Continue aprendendo sobre gestão, tecnologia e inovação
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/blog">
                  Ver todos <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentPosts.map((recPost) => {
                const recImageUrl =
                  getBlogPostImageUrl(recPost) ||
                  'https://img.usecurling.com/p/600/400?q=software&color=blue'
                const recDate =
                  recPost.published_at ||
                  (recPost.created ? new Date(recPost.created).toLocaleDateString('pt-BR') : '')

                return (
                  <Link
                    key={recPost.id}
                    to={`/blog/${encodeURIComponent(recPost.slug || recPost.id)}`}
                    className="group"
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md hover:border-primary/40 transition-all">
                      <div className="relative h-40 overflow-hidden bg-muted">
                        <img
                          src={recImageUrl}
                          alt={recPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {recPost.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-primary text-[11px] font-bold rounded-full">
                              {recPost.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {recPost.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 mt-auto flex items-center justify-between text-xs text-muted-foreground border-t border-border/40">
                        <span>{recDate}</span>
                        {recPost.read_time && <span>{recPost.read_time}</span>}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/blog">
                  Ver todas as publicações <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
