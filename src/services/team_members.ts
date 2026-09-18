import pb from '@/lib/pocketbase/client'

export interface TeamMember {
  id: string
  name: string
  role: string
  quote?: string
  bio?: string
  photo?: string
  order?: number
  created?: string
  updated?: string
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    return await pb.collection('team_members').getFullList<TeamMember>({
      sort: 'order',
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}
