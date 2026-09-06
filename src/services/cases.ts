import pb from '@/lib/pocketbase/client'

export interface CaseItem {
  id: string
  image?: string
  description?: string
  created?: string
  updated?: string
}

export const getCases = async (): Promise<CaseItem[]> => {
  try {
    return await pb.collection('cases').getFullList({
      sort: '-created',
    })
  } catch (error) {
    console.error('Error fetching cases:', error)
    return []
  }
}

// Mantido para compatibilidade com outros imports
export const getFeaturedCases = async (): Promise<CaseItem[]> => {
  return getCases()
}

export const getCaseImageUrl = (record: CaseItem, filename?: string): string => {
  const file = filename || record.image
  if (!file) return ''
  return pb.files.getUrl(record, file)
}
