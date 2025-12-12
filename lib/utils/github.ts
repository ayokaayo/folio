/**
 * GitHub API utility functions
 * Fetches README content from GitHub repositories
 */

interface GitHubReadmeResponse {
  content: string
  encoding: string
}

/**
 * Fetches README content from a GitHub repository
 * @param owner - Repository owner (e.g., 'ayokaayo')
 * @param repo - Repository name (e.g., 'kallax')
 * @returns Promise<string> - The decoded markdown content
 */
export async function fetchGitHubReadme(
  owner: string,
  repo: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.statusText}`)
    }

    const data: GitHubReadmeResponse = await response.json()

    if (data.encoding === 'base64') {
      // Decode base64 content
      const decoded = atob(data.content)
      return decoded
    }

    return data.content
  } catch (error) {
    console.error('Error fetching GitHub README:', error)
    throw error
  }
}
