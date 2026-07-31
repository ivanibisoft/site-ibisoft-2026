import pb from '@/lib/pocketbase/client'

export const createLead = async (data: {
  name: string
  email: string
  phone?: string
  message: string
  source_page?: string
}) => {
  try {
    return await pb.collection('leads').create({
      ...data,
      status: 'new',
    })
  } catch (error) {
    console.error('Error creating lead:', error)
    throw error
  }
}
