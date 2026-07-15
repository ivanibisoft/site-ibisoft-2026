import pb from '@/lib/pocketbase/client'

export interface PartnerLogo {
  id: string
  name: string
  logo: string
  order_number: number
  is_active: boolean
  created: string
  updated: string
}

export const getActivePartnerLogos = async (): Promise<PartnerLogo[]> => {
  try {
    return await pb.collection('partner_logos').getFullList<PartnerLogo>({
      filter: 'is_active = true',
      sort: 'order_number',
    })
  } catch (error) {
    console.error('Error fetching partner logos:', error)
    return []
  }
}

export const getAllPartnerLogos = async (): Promise<PartnerLogo[]> => {
  try {
    return await pb.collection('partner_logos').getFullList<PartnerLogo>({
      sort: 'order_number',
    })
  } catch (error) {
    console.error('Error fetching all partner logos:', error)
    return []
  }
}

export const getLogoUrl = (logo: PartnerLogo): string => {
  return `${pb.baseURL}/api/files/partner_logos/${logo.id}/${logo.logo}`
}
