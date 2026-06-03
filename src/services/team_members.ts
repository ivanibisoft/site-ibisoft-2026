import pb from '@/lib/pocketbase/client'

export const getTeamMembers = async () => {
  try {
    return await pb.collection('team_members').getFullList({
      sort: 'order',
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}
