import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import { profileSchema, type Profile } from '@/types/profile'

let cachedProfile: Profile | null = null
let cachedTodos: string[] = []
let cacheTimestamp: number = 0

export function getProfile(): { profile: Profile; todos: string[] } {
  const filePath = join(process.cwd(), 'content', 'profile.json')
  
  // In development, check if file was modified to invalidate cache
  if (process.env.NODE_ENV === 'development' && cachedProfile) {
    try {
      const stats = statSync(filePath)
      if (stats.mtimeMs > cacheTimestamp) {
        // File was modified, clear cache
        cachedProfile = null
        cachedTodos = []
      }
    } catch (error) {
      // If we can't read stats, proceed to reload
      cachedProfile = null
      cachedTodos = []
    }
  }
  
  if (cachedProfile) {
    return { profile: cachedProfile, todos: cachedTodos }
  }

  try {
    const fileContents = readFileSync(filePath, 'utf-8')
    const rawData = JSON.parse(fileContents)
    
    // Update cache timestamp
    try {
      const stats = statSync(filePath)
      cacheTimestamp = stats.mtimeMs
    } catch (error) {
      cacheTimestamp = Date.now()
    }

    // Extract TODOs from the JSON
    const todos: string[] = []
    const extractTodos = (obj: any, path: string = ''): void => {
      if (typeof obj === 'string' && obj.startsWith('TODO:')) {
        todos.push(`${path}: ${obj}`)
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          extractTodos(item, `${path}[${index}]`)
        })
      } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
          extractTodos(obj[key], path ? `${path}.${key}` : key)
        })
      }
    }
    extractTodos(rawData)

    // Validate and parse
    const profile = profileSchema.parse(rawData)
    cachedProfile = profile
    cachedTodos = todos

    return { profile, todos }
  } catch (error) {
    console.error('Error loading profile:', error)
    throw new Error('Failed to load profile data')
  }
}

