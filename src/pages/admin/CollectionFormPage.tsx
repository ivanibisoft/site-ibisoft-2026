import { useParams } from 'react-router-dom'
import { AdminForm } from '@/components/admin/AdminForm'

export default function CollectionFormPage() {
  const { collection, id } = useParams<{ collection: string; id?: string }>()
  if (!collection) return null
  return <AdminForm collectionName={collection} recordId={id} />
}
