import pb from '@/lib/pocketbase/client'

export const getList = (collection: string, sort = '-created') =>
  pb.collection(collection).getFullList({ sort })

export const getOne = (collection: string, id: string) => pb.collection(collection).getOne(id)

export const createRecord = (collection: string, data: Record<string, any> | FormData) =>
  pb.collection(collection).create(data)

export const updateRecord = (
  collection: string,
  id: string,
  data: Record<string, any> | FormData,
) => pb.collection(collection).update(id, data)

export const deleteRecord = (collection: string, id: string) => pb.collection(collection).delete(id)

export const getFileUrl = (collection: string, recordId: string, filename: string) =>
  `${pb.baseURL}/api/files/${collection}/${recordId}/${filename}`
