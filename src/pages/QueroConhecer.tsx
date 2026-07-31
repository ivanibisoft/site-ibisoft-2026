import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Phone, Mail, Building, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'
import { WHATSAPP_URL } from '@/lib/constants'

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
})

type FormValues = z.infer<typeof formSchema>

export default function QueroConhecer() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const nameInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  })

  useEffect(() => {
    if (!isSuccess) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await pb.collection('leads').create({
        ...data,
        source_page: 'contato',
        status: 'new',
      })
      setIsSuccess(true)
      form.reset()
      toast({
        title: 'Mensagem enviada com sucesso!',
        description: 'Entraremos em contato o mais breve possível.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar mensagem',
        description: 'Tente novamente mais tarde.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Fale com a ibisoft</h1>
          <p className="text-lg text-slate-600">
            Estamos prontos para entender as necessidades da sua empresa e apresentar a melhor
            solução em tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-full">
              <h3 className="text-2xl font-semibold text-slate-900 mb-8">Informações de Contato</h3>

              <div className="space-y-8">
                <a
                  href="https://www.google.com/maps/@-25.4081498,-49.2539782,3a,75y,352.41h,96.45t/data=!3m7!1e1!3m5!1sfUkJfLguGL6BeJeJTA_V_A!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-6.453825593429272%26panoid%3DfUkJfLguGL6BeJeJTA_V_A%26yaw%3D352.4080766992003!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 group cursor-pointer"
                  aria-label="Abrir localização no Google Maps"
                >
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      Nosso Endereço
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      Cond. Opus One Cabral
                      <br />
                      Rua Dr. Manoel Pedro, 365 - Cj 401
                      <br />
                      Bairro Cabral - Curitiba / PR
                      <br />
                      CEP: 80035-030
                    </p>
                  </div>
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 group cursor-pointer"
                >
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      Telefone
                    </h4>
                    <p className="text-slate-600">
                      (41) 3027-2003
                      <br />
                      (41) 99116-6264 WhatsApp
                    </p>
                  </div>
                </a>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-slate-900 mb-2">E-mail</h4>
                    <p className="text-slate-600">contato@ibisoft.com.br</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-slate-900 mb-2">
                      Horário de Atendimento
                    </h4>
                    <p className="text-slate-600">
                      Segunda a Sexta 08:30 às 12:00 e 13:30 às 18:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-900 mb-8">Envie uma Mensagem</h3>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h4 className="text-2xl font-semibold text-slate-900">Mensagem Enviada!</h4>
                <p className="text-slate-600 max-w-xs">
                  Agradecemos o seu contato. Nossa equipe retornará em breve.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setIsSuccess(false)}>
                  Enviar nova mensagem
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input ref={nameInputRef} placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail Corporativo</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com.br" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone / WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Como podemos ajudar?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva sua necessidade ou projeto..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
