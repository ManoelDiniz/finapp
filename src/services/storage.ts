export const Storage = {
  get<T>(key: string): T | null {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  set<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data))
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
}
