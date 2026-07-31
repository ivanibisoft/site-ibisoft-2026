import pb from '@/lib/pocketbase/client'

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  order: number
  is_active: boolean
  created: string
  updated: string
}

export const getActiveTestimonials = async (): Promise<Testimonial[]> => {
  try {
    return await pb.collection('testimonials').getFullList<Testimonial>({
      filter: 'is_active = true',
      sort: 'order',
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}
