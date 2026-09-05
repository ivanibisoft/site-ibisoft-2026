import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Rss, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FUNNEL_STAGES } from '@/lib/erp-content'
import { ModulesSection } from '@/components/ModulesSection'
import { useHasBlogPosts } from '@/hooks/use-has-blog-posts'
import { getActiveBlogPosts, getBlogPostImageUrl, type BlogPost } from '@/services/blog'
import useRealtime from '@/hooks/use-realtime'

export default function SobreErp() {
  const { hasBlogPosts } = useHasBlogPosts()
  const [posts, setPosts] = useState<BlogPost[]>([])

  const loadPosts = async () => {
    try {
      const data = await getActiveBlogPosts()
      setPosts(data)
    } catch (err) {
      console.error('Failed to load blog posts in SobreErp:', err)
    }
  }

  useEffect(() => {
    if (hasBlogPosts) {
      loadPosts()
    } else {
      setPosts([])
    }
  }, [hasBlogPosts])

  useRealtime('posts', () => {
    loadPosts()
  })

  // Exibir no máximo as 3 últimas publicações ativas no bloco da página Sobre ERP
  const latestPosts = posts.slice(0, 3)

  return (
    <div className="animate-fade-in">
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/600?q=library&color=blue')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-8">
            <BookOpen className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Guia Definitivo sobre ERP
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Tudo o que você precisa saber sobre Sistemas de Gestão Empresarial. Desde os conceitos
            básicos até as melhores práticas de implantação para dominar seu mercado.
          </p>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">A Jornada do Conhecimento ERP</h2>
            <p className="text-muted-foreground text-lg">
              Preparamos os conteúdos essenciais para guiar a sua empresa rumo à maturidade em
              gestão.
            </p>
          </div>

          <div className="space-y-16">
            {FUNNEL_STAGES.map((stage) => {
              const Icon = stage.icon
              return (
                <div key={stage.id} className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{stage.title}</h3>
                      <p className="text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 md:pl-16">
                    {stage.articles.map((article) => (
                      <Dialog key={article.id}>
                        <DialogTrigger asChild>
                          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 group h-full flex flex-col">
                            <CardHeader>
                              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {article.title}
                              </CardTitle>
                              <CardDescription className="text-base mt-2">
                                {article.summary}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-4 flex items-center text-sm font-medium text-accent">
                              Ler artigo completo{' '}
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl leading-tight">
                              {article.title}
                            </DialogTitle>
                            <DialogDescription className="text-base pt-6 space-y-4 text-foreground/80 text-left">
                              {article.content.split('\n\n').map((p, i) => (
                                <p key={i} className="leading-relaxed">
                                  {p}
                                </p>
                              ))}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ModulesSection />

      {hasBlogPosts && latestPosts.length > 0 && (
        <section className="py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                  <Rss className="h-4 w-4" /> Nosso Blog
                </div>
                <h2 className="text-3xl font-bold">Últimas sobre Gestão e Tecnologia</h2>
              </div>
              <Button variant="outline" className="hidden md:flex" asChild>
                <Link to="/blog">
                  Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => {
                const imageUrl =
                  getBlogPostImageUrl(post) ||
                  'https://img.usecurling.com/p/600/400?q=software&color=blue'
                const formattedDate =
                  post.published_at ||
                  (post.created ? new Date(post.created).toLocaleDateString('pt-BR') : '')

                const cardContent = (
                  <Card className="h-full overflow-hidden group flex flex-col hover:shadow-md hover:border-primary/40 transition-all">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      {post.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                          {post.summary}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                      {formattedDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                        </div>
                      ) : (
                        <span />
                      )}
                      {post.read_time && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {post.read_time}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )

                // Se tem slug definido, navega para a página individual do artigo
                if (post.slug && post.slug.trim()) {
                  return (
                    <Link
                      key={post.id}
                      to={`/blog/${encodeURIComponent(post.slug.trim())}`}
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                    >
                      {cardContent}
                    </Link>
                  )
                }

                // Fallback para modal se não tiver slug
                return (
                  <Dialog key={post.id}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer">{cardContent}</div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        {post.category && (
                          <span className="inline-block text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                            {post.category}
                          </span>
                        )}
                        <DialogTitle className="text-2xl leading-tight">{post.title}</DialogTitle>
                        {formattedDate && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                            <Calendar className="h-3.5 w-3.5" /> Publicado em {formattedDate}
                            {post.read_time && (
                              <>
                                <span>•</span>
                                <Clock className="h-3.5 w-3.5" /> {post.read_time}
                              </>
                            )}
                          </div>
                        )}
                        <div className="text-base pt-6 space-y-4 text-foreground/90 text-left whitespace-pre-line leading-relaxed">
                          {post.content || post.summary}
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )
              })}
            </div>
            <Button variant="outline" className="w-full mt-8 md:hidden" asChild>
              <Link to="/blog">
                Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Pronto para dar o próximo passo?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Agora que você já sabe como um ERP pode transformar o seu negócio, converse com um de
            nossos especialistas e descubra como a ibisoft se encaixa na sua realidade.
          </p>
          <Link to="/quero-conhecer">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20"
            >
              Agendar Diagnóstico Gratuito <CheckCircle2 className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
