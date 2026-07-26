export interface AuthResponse {
  token: string
  id: string
  name: string
  email: string
  role: string
  joinDate: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  role: string
  joinDate: string
}

const USERS_KEY = 'brandverse-users'

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function generateToken(email: string): string {
  return btoa(`${email}:${Date.now()}:brandverse`)
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 600))

    const users = getUsers()

    if (users.find((u) => u.email === payload.email)) {
      throw new Error('An account with this email already exists.')
    }

    if (payload.password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }

    const newUser: StoredUser = {
      id:       generateId(),
      name:     payload.name,
      email:    payload.email,
      password: payload.password,
      role:     'member',
      joinDate: new Date().toLocaleString('en-IN', {
        month: 'long',
        year:  'numeric',
      }),
    }

    saveUsers([...users, newUser])

    return {
      token:    generateToken(newUser.email),
      id:       newUser.id,
      name:     newUser.name,
      email:    newUser.email,
      role:     newUser.role,
      joinDate: newUser.joinDate,
    }
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 600))

    const users = getUsers()
    const user  = users.find((u) => u.email === payload.email)

    if (!user) {
      throw new Error('No account found with this email.')
    }

    if (user.password !== payload.password) {
      throw new Error('Incorrect password. Please try again.')
    }

    return {
      token:    generateToken(user.email),
      id:       user.id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      joinDate: user.joinDate,
    }
  },
}