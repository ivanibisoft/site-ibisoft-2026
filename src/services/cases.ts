import pb from '@/lib/pocketbase/client'

export interface CaseItem {
  id: string
  image?: string
  description?: string
  sort_order?: number
  created?: string
  updated?: string
}

export const getCases = async (): Promise<CaseItem[]> => {
  try {
    // Ordena primariamente por sort_order (ascendente) e secundariamente por -created como fallback
    return await pb.collection('cases').getFullList({
      sort: '+sort_order,-created',
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
