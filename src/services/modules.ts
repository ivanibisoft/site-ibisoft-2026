import pb from '@/lib/pocketbase/client'

export interface Module {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  order?: number
  created: string
  updated: string
}

export interface ResourceGroup {
  id: string
  module: string
  name: string
  order: number
  created: string
  updated: string
}

export interface Resource {
  id: string
  group: string
  name: string
  description: string
  order?: number
  created: string
  updated: string
}

export const getModules = async () => {
  try {
    return await pb.collection('modules').getFullList<Module>({
      sort: 'order',
    })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return []
  }
}

export const getModuleHierarchy = async (slug: string) => {
  try {
    const moduleData = await pb.collection('modules').getFirstListItem<Module>(`slug = "${slug}"`)

    const groups = await pb.collection('resource_groups').getFullList<ResourceGroup>({
      filter: `module = "${moduleData.id}"`,
      sort: 'order',
    })

    const groupIds = groups.map((g) => g.id)

    let resources: Resource[] = []
    if (groupIds.length > 0) {
      const filter = groupIds.map((id) => `group = "${id}"`).join(' || ')
      resources = await pb.collection('resources').getFullList<Resource>({
        filter,
        sort: 'order,name',
      })
    }

    return { moduleData, groups, resources }
  } catch (error) {
    console.error(`Error fetching module hierarchy for ${slug}:`, error)
    throw error
  }
}
