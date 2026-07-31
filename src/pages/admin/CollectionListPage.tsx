import { useParams } from 'react-router-dom'
import { AdminList } from '@/components/admin/AdminList'

export default function CollectionListPage() {
  const { collection } = useParams<{ collection: string }>()
  if (!collection) return null
  return <AdminList collectionName={collection} />
}
