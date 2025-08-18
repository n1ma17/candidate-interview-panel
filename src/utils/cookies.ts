interface TokenData {
  token: string
  expiresAt: number
}

interface RefreshTokenData {
  token: string
  expiresAt: number
}

class CookieManager {
  // Set access token cookie
  setAccessToken(token: string, expiresInMinutes: number = 15): void {
    const expiresAt = Date.now() + (expiresInMinutes * 60 * 1000)
    const expiresDate = new Date(expiresAt)

    document.cookie = `access_token=${token}; expires=${expiresDate.toUTCString()}; path=/; secure; samesite=strict`

    // Also store expiration time for client-side checks
    localStorage.setItem('access_token_expires', expiresAt.toString())
  }

  // Set refresh token cookie
  setRefreshToken(token: string, expiresInDays: number = 7): void {
    const expiresAt = Date.now() + (expiresInDays * 24 * 60 * 60 * 1000)
    const expiresDate = new Date(expiresAt)

    document.cookie = `refresh_token=${token}; expires=${expiresDate.toUTCString()}; path=/; secure; samesite=strict`

    // Also store expiration time for client-side checks
    localStorage.setItem('refresh_token_expires', expiresAt.toString())
  }

  // Get access token from cookie
  getAccessToken(): string | null {
    const cookies = document.cookie.split(';')
    const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='))

    if (accessTokenCookie) {
      const token = accessTokenCookie.split('=')[1]
      const expiresAt = localStorage.getItem('access_token_expires')

      if (expiresAt && Date.now() > parseInt(expiresAt)) {
        // Token expired, remove it
        this.removeAccessToken()
        return null
      }

      return token
    }

    return null
  }

  // Get refresh token from cookie
  getRefreshToken(): string | null {
    const cookies = document.cookie.split(';')
    const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refresh_token='))

    if (refreshTokenCookie) {
      const token = refreshTokenCookie.split('=')[1]
      const expiresAt = localStorage.getItem('refresh_token_expires')

      if (expiresAt && Date.now() > parseInt(expiresAt)) {
        // Token expired, remove it
        this.removeRefreshToken()
        return null
      }

      return token
    }

    return null
  }

  // Check if access token is expired
  isAccessTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('access_token_expires')
    if (!expiresAt) return true

    return Date.now() > parseInt(expiresAt)
  }

  // Check if refresh token is expired
  isRefreshTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('refresh_token_expires')
    if (!expiresAt) return true

    return Date.now() > parseInt(expiresAt)
  }

  // Remove access token
  removeAccessToken(): void {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('access_token_expires')
  }

  // Remove refresh token
  removeRefreshToken(): void {
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('refresh_token_expires')
  }

  // Remove all tokens
  removeAllTokens(): void {
    this.removeAccessToken()
    this.removeRefreshToken()
  }

  // Get token expiration time
  getAccessTokenExpiration(): Date | null {
    const expiresAt = localStorage.getItem('access_token_expires')
    if (!expiresAt) return null

    return new Date(parseInt(expiresAt))
  }

  // Get refresh token expiration time
  getRefreshTokenExpiration(): Date | null {
    const expiresAt = localStorage.getItem('refresh_token_expires')
    if (!expiresAt) return null

    return new Date(parseInt(expiresAt))
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !this.isAccessTokenExpired() && !!this.getAccessToken()
  }
}

export default new CookieManager()
