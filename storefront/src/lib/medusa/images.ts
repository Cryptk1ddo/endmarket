export function normalizeImageUrl(url?: string | null) {
  if (!url) return null

  const apiUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.endmarket.ru"

  if (url.startsWith("https://api.endmarket.ru")) {
    return url.replace("https://api.endmarket.ru", apiUrl)
  }

  if (url.startsWith("https://api.endmarket.ru")) {
    return url.replace("https://api.endmarket.ru", apiUrl)
  }

  if (url.startsWith("/static")) {
    return `${apiUrl}${url}`
  }

  if (url.startsWith("static/")) {
    return `${apiUrl}/${url}`
  }

  return url
}
