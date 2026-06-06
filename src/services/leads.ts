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

export const updateLeadStatus = async (id: string, status: string) => {
  try {
    return await pb.collection('leads').update(id, { status })
  } catch (error) {
    console.error('Error updating lead:', error)
    throw error
  }
}

export const getLeads = async () => {
  try {
    // Only attempt to fetch if authenticated
    if (!pb.authStore.isValid) {
      console.warn('Unauthorized attempt to fetch leads blocked.')
      return []
    }
    return await pb.collection('leads').getFullList({
      sort: '-created',
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}
