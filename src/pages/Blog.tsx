import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Rss, Calendar, Clock, ArrowRight, ArrowLeft, Tag, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getActiveBlogPosts, getBlogPostImageUrl, type BlogPost } from '@/services/blog'
import useRealtime from '@/hooks/use-realtime'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const loadPosts = async () => {
    try {
      const data = await getActiveBlogPosts()
      setPosts(data)
    } catch (err) {
      console.error('Failed to load blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useRealtime('posts', () => {
    loadPosts()
  })

  // Extract unique categories from active posts
  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((post) => {
      const cat = post.category?.trim()
      if (cat) {
        set.add(cat)
      }
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [posts])

  // Reset selected category if it no longer exists
  useEffect(() => {
    if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
      setSelectedCategory('all')
    }
  }, [categories, selectedCategory])

  // Filtered posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts
    return posts.filter((post) => post.category?.trim() === selectedCategory)
  }, [posts, selectedCategory])

  return (
    <div className="animate-fade-in">
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/600?q=technology&color=blue')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10 max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-8">
            <Rss className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Blog ibisoft</h1>
          <p className="text-lg text-primary-foreground/80">
            Artigos, novidades do mercado, dicas de gestão e tecnologia para impulsionar seu
            negócio.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <Rss className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Nenhuma publicação no momento</h2>
              <p className="text-muted-foreground mb-6">
                Estamos preparando novos conteúdos exclusivos para você. Volte em breve!
              </p>
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início
                </Link>
              </Button>
            </div>
          ) : (
            <div>
              {/* Category Filter Bar */}
              <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                  <Tag className="h-4 w-4 text-accent" />
                  <span>Filtrar por categoria:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className={
                      selectedCategory === 'all'
                        ? 'bg-primary text-primary-foreground shadow-sm rounded-full px-4'
                        : 'rounded-full px-4 hover:border-primary/40'
                    }
                  >
                    <Layers className="mr-1.5 h-3.5 w-3.5" />
                    Todos
                    <span
                      className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                        selectedCategory === 'all'
                          ? 'bg-white/20 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {posts.length}
                    </span>
                  </Button>

                  {categories.map((cat) => {
                    const count = posts.filter((p) => p.category?.trim() === cat).length
                    const isSelected = selectedCategory === cat
                    return (
                      <Button
                        key={cat}
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className={
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-sm rounded-full px-4'
                            : 'rounded-full px-4 hover:border-primary/40'
                        }
                      >
                        {cat}
                        <span
                          className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {count}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 max-w-md mx-auto">
                  <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <h3 className="text-lg font-semibold mb-1">Nenhum artigo nesta categoria</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Não encontramos publicações na categoria &quot;{selectedCategory}&quot;.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCategory('all')}>
                    Ver todos os artigos
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => {
                    const imageUrl =
                      getBlogPostImageUrl(post) ||
                      'https://img.usecurling.com/p/600/400?q=software&color=blue'
                    return (
                      <Dialog key={post.id}>
                        <DialogTrigger asChild>
                          <Card className="overflow-hidden group flex flex-col cursor-pointer hover:shadow-md hover:border-primary/30 transition-all">
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
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {post.published_at ||
                                  new Date(post.created).toLocaleDateString('pt-BR')}
                              </div>
                              {post.read_time && (
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" /> {post.read_time}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            {post.category && (
                              <span className="inline-block text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                                {post.category}
                              </span>
                            )}
                            <DialogTitle className="text-2xl leading-tight">
                              {post.title}
                            </DialogTitle>
                            {post.published_at && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                <Calendar className="h-3.5 w-3.5" /> Publicado em{' '}
                                {post.published_at}
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
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/40 py-16 border-t">
        <div className="container text-center max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Quer saber mais sobre nossas soluções?
          </h2>
          <p className="text-muted-foreground mb-8">
            Converse com os especialistas da ibisoft e descubra como otimizar a gestão da sua
            empresa.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white font-semibold"
          >
            <Link to="/quero-conhecer">
              Falar com um Especialista <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
