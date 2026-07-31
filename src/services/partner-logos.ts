import pb from '@/lib/pocketbase/client'
import type { Segment } from '@/services/segments'

export interface PartnerLogo {
  id: string
  name: string
  logo: string
  order_number: number
  is_active: boolean
  segment: string
  created: string
  updated: string
}

export interface PartnerLogoWithExpand extends PartnerLogo {
  expand?: { segment?: Segment }
}

export const getActivePartnerLogos = async (): Promise<PartnerLogoWithExpand[]> => {
  try {
    return await pb.collection('partner_logos').getFullList<PartnerLogoWithExpand>({
      filter: 'is_active = true',
      sort: 'segment,order_number',
      expand: 'segment',
    })
  } catch (error) {
    console.error('Error fetching partner logos:', error)
    return []
  }
}

export const getLogoUrl = (logo: PartnerLogo): string => {
  return `${pb.baseURL}/api/files/partner_logos/${logo.id}/${logo.logo}`
}
