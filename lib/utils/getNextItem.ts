/**
 * Generic utility function to get the next item from an array in a deterministic order
 * Excludes the current item by ID and returns the next item in the array
 * 
 * @param currentId - The ID of the current item to exclude
 * @param items - Array of items with an `id` field
 * @returns The next item in the array (excluding current), wrapping to the first if at the end, or null if no other items exist
 */
export function getNextItem<T extends { id: string }>(
  currentId: string,
  items: T[]
): T | null {
  // Find the index of the current item
  const currentIndex = items.findIndex((item) => item.id === currentId)
  
  // Return null if current item not found or no other items exist
  if (currentIndex === -1 || items.length <= 1) {
    return null
  }
  
  // Get the next item, wrapping around to the first if at the end
  const nextIndex = (currentIndex + 1) % items.length
  return items[nextIndex]
}






