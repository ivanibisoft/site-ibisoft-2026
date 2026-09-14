import pb from '@/lib/pocketbase/client'

export const getList = (collection: string, sort = '-created', expand?: string) =>
  pb.collection(collection).getFullList({ sort, expand })

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

export interface TestEmailResponse {
  success: boolean
  message: string
  recipient?: string
}

export const sendTestEmail = async (): Promise<TestEmailResponse> => {
  return pb.send<TestEmailResponse>('/backend/v1/ibisoft/test-email', {
    method: 'POST',
  })
}

export interface ChangePasswordParams {
  oldPassword: string
  password: string
  passwordConfirm: string
}

export const changeAdminPassword = async ({
  oldPassword,
  password,
  passwordConfirm,
}: ChangePasswordParams) => {
  const currentRecord = pb.authStore.record
  if (!currentRecord || !currentRecord.id) {
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  // Update password in users collection using oldPassword, password and passwordConfirm
  const updatedUser = await pb.collection('users').update(currentRecord.id, {
    oldPassword,
    password,
    passwordConfirm,
  })

  // Ensure current authStore state is updated and session remains active
  try {
    await pb.collection('users').authRefresh()
  } catch {
    // If authRefresh fails, we still preserve the updated user in authStore
    if (pb.authStore.isValid && updatedUser) {
      pb.authStore.save(pb.authStore.token, updatedUser)
    }
  }

  return updatedUser
}
