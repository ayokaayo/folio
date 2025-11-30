/**
 * Generic utility function to get a random next item from an array
 * Excludes the current item by ID
 * 
 * @param currentId - The ID of the current item to exclude
 * @param items - Array of items with an `id` field
 * @returns A random item from the array (excluding current), or null if no other items exist
 */
export function getNextItem<T extends { id: string }>(
  currentId: string,
  items: T[]
): T | null {
  // Filter out the current item
  const otherItems = items.filter((item) => item.id !== currentId)
  
  // Return null if no other items exist
  if (otherItems.length === 0) {
    return null
  }
  
  // Randomly select from remaining items
  const randomIndex = Math.floor(Math.random() * otherItems.length)
  return otherItems[randomIndex]
}



