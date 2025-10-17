import { WebsiteMetadata } from '../models/schema'

const BASE_URL = 'https://screenshotof.com'

interface ScreenshotOptions {
  [key: string]: string
}

/**
 * Fetches a screenshot of a website.
 * @param websiteUri - The URI of the website to screenshot.
 * @param date - Optional. The date of the screenshot (2024-01 - 2024-10).
 * @param options - Optional. Additional query parameters for the request.
 * @returns A Promise that resolves to the object URL of the screenshot blob.
 * @throws {Error} If there's an HTTP error or other issues during the fetch.
 */
export async function getScreenshot(
  websiteUri: string,
  date: string | null = null,
  options: ScreenshotOptions = {}
): Promise<string> {
  const queryParams = new URLSearchParams(options)
  let url = `${BASE_URL}/${websiteUri}`
  if (date) {
    url += `/${date}`
  }
  try {
    const response = await fetch(`${url}?${queryParams}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error getting screenshot:', error)
    throw error
  }
}

/**
 * Fetches metadata for a website screenshot.
 * @param websiteUri - The URI of the website.
 * @param date - Optional. The the metadata was captured (2024-01 - 2024-10).
 * @returns A Promise that resolves to the metadata object.
 * @throws {Error} If there's an HTTP error or other issues during the fetch.
 */
export async function getMetadata(
  websiteUri: string,
  date?: string | null
): Promise<WebsiteMetadata> {
  try {
    let url = `${BASE_URL}/${websiteUri}`
    if (date) {
      url += `/${date}`
    }
    const response = await fetch(`${url}?f=json`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw error
  }
}
