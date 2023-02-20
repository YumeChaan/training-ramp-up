import client from './client'

interface userResponse {
  email: string
  password: string
}

export const signUp = async (user: userResponse) => {
  return client.post('user/signup', user)
}

export const signIn = async (user: userResponse) => {
  const response = await client.post('user/login', user, {
    withCredentials: true,
  })

  return response
}

export const signOut = async () => {
  return client.get('user/logout', {
    withCredentials: true,
  })
}
