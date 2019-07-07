import { AsyncStorage } from 'react-native'

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key)
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(
  key: string,
  value: string,
): Promise<string | null> {
  try {
    await AsyncStorage.setItem(key, value)
    return value
  } catch {
    return null
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load<Type>(key: string): Promise<Type | null> {
  try {
    const almostThere = await AsyncStorage.getItem(key)
    return JSON.parse(almostThere)
  } catch {
    return null
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save<Type>(
  key: string,
  value: Type,
): Promise<Type | null> {
  try {
    if (typeof value === 'object') {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } else {
      await AsyncStorage.setItem(key, value.toString())
    }
    return value
  } catch {
    return null
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): Promise<void> {
  return AsyncStorage.removeItem(key)
}

/**
 * Burn it all to the ground.
 */
export function clear(): Promise<void> {
  return AsyncStorage.clear()
}
