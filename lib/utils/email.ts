/**
 * Email utility functions
 * Provides obfuscated email and copy-to-clipboard functionality
 */

// Obfuscated email using base64 encoding
// This prevents email from appearing in plain text in HTML source
const OBFUSCATED_EMAIL = 'aGlAbWlndWVsYW5nZWxvLnRlY2g=' // base64 of 'hi@miguelangelo.tech'

/**
 * Decodes the obfuscated email address
 * @returns The actual email address
 */
export function getEmail(): string {
  if (typeof window === 'undefined') {
    // Server-side: return from constants
    return 'hi@miguelangelo.tech'
  }
  // Client-side: decode from base64
  try {
    return atob(OBFUSCATED_EMAIL)
  } catch {
    // Fallback if decoding fails
    return 'hi@miguelangelo.tech'
  }
}

/**
 * Copies the email address to the user's clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyEmailToClipboard(): Promise<boolean> {
  const email = getEmail()
  
  try {
    // Use modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(email)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = email
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  } catch (err) {
    console.error('Failed to copy email:', err)
    return false
  }
}

