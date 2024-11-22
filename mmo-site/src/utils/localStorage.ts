/**
 * Stores a value in localStorage under the specified key
 * @param key - The key under which the value will be stored
 * @param value - The value to be stored. It will be stringified
 */
export const setItemLocalStorage = (key: string, value: unknown): void => {
    try {
        const serializedValue = JSON.stringify(value)
        localStorage.setItem(key, serializedValue)
    } catch (error) {
        console.error(`Error setting item in localStorage with key ${key}: `, error)
    }
}

/**
 * Retrieves a value from localStorage
 * @param key - The key of the value to retrieve
 * @returns The parsed value or null if the key doesn't exist or parsing fails
 */
export const getItemLocalStorage = <T>(key: string): T | undefined => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return undefined
        }

        return JSON.parse(serializedValue) as T
    } catch (error) {
        console.error(`Error getting items in localStorage with key ${key}: `, error)
        return undefined
    }
}

/**
 * Removes a specific item from localStorage.
 * @param key - The key of the item to remove.
 */
export const removeItemLocalStorage = (key: string): void => {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.error(`Error removing items in localStorage with key ${key}: `, error)
    }
}

/**
 * Clears all items from localStorage
 */
export const clearAllLocalStorage = (): void => {
    try {
        localStorage.clear()
    } catch (error) {
        console.error('Error clearing localStorage: ', error)
    }
}