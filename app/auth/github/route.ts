import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        // Check for GitHub OAuth errors
        if (error) {
            console.error("GitHub OAuth error:", error)
            return NextResponse.redirect(`${getBaseUrl(request)}/dashboard?error=github_oauth_error&details=${error}`)
        }

        // Check required environment variables
        if (!process.env.GITHUB_CLIENT_ID) {
            console.error("Missing GITHUB_CLIENT_ID environment variable")
            return NextResponse.json({ error: "Server configuration error: Missing GITHUB_CLIENT_ID" }, { status: 500 })
        }

        if (!process.env.GITHUB_CLIENT_SECRET) {
            console.error("Missing GITHUB_CLIENT_SECRET environment variable")
            return NextResponse.json({ error: "Server configuration error: Missing GITHUB_CLIENT_SECRET" }, { status: 500 })
        }

        if (!code) {
            // Redirect to GitHub OAuth for username only
            const baseUrl = getBaseUrl(request)
            const githubAuthUrl = new URL("https://github.com/login/oauth/authorize")

            githubAuthUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID)
            githubAuthUrl.searchParams.set("redirect_uri", `${baseUrl}/auth/github`)
            githubAuthUrl.searchParams.set("scope", "read:user")
            githubAuthUrl.searchParams.set("state", "username-only")

            console.log("Redirecting to GitHub OAuth:", githubAuthUrl.toString())
            return NextResponse.redirect(githubAuthUrl.toString())
        }

        console.log("Processing GitHub OAuth callback with code:", code.substring(0, 10) + "...")

        // Exchange code for access token
        const baseUrl = getBaseUrl(request)
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "User-Agent": "GitHub-Username-App",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: `${baseUrl}/auth/github`,
            }),
        })

        if (!tokenResponse.ok) {
            console.error("Token exchange failed:", tokenResponse.status, tokenResponse.statusText)
            const errorText = await tokenResponse.text()
            console.error("Token exchange error details:", errorText)
            return NextResponse.redirect(`${baseUrl}/dashboard?error=token_exchange_failed`)
        }

        const tokenData = await tokenResponse.json()
        console.log("Token exchange response:", {
            ...tokenData,
            access_token: tokenData.access_token ? "[REDACTED]" : "missing",
        })

        if (tokenData.error) {
            console.error("GitHub token error:", tokenData.error, tokenData.error_description)
            return NextResponse.redirect(`${baseUrl}/dashboard?error=github_token_error&details=${tokenData.error}`)
        }

        if (!tokenData.access_token) {
            console.error("No access token received from GitHub")
            return NextResponse.redirect(`${baseUrl}/dashboard?error=no_access_token`)
        }

        // Get user data from GitHub
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "GitHub-Username-App",
            },
        })

        if (!userResponse.ok) {
            console.error("GitHub user API failed:", userResponse.status, userResponse.statusText)
            const errorText = await userResponse.text()
            console.error("GitHub user API error details:", errorText)
            return NextResponse.redirect(`${baseUrl}/dashboard?error=github_api_failed`)
        }

        const userData = await userResponse.json()
        console.log("GitHub user data received:", { login: userData.login, id: userData.id })

        if (!userData.login) {
            console.error("No username in GitHub response:", userData)
            return NextResponse.redirect(`${baseUrl}/dashboard?error=no_username`)
        }

        // Store username and redirect with success
        const response = NextResponse.redirect(`${baseUrl}/dashboard?github_username=${userData.login}&success=true`)

        // Store in cookie for later use
        response.cookies.set("github_username", userData.login, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: "lax",
        })

        console.log("Successfully stored GitHub username:", userData.login)
        return response
    } catch (error) {
        console.error("Unexpected error in GitHub OAuth handler:", error)

        // Log the full error details
        if (error instanceof Error) {
            console.error("Error name:", error.name)
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
        }

        const baseUrl = getBaseUrl(request)
        return NextResponse.redirect(
            `${baseUrl}/dashboard?error=unexpected_error&details=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
        )
    }
}

// Helper function to get the correct base URL
function getBaseUrl(request: NextRequest): string {
    // Check for Vercel environment variables
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    // Check for custom NEXTAUTH_URL
    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL
    }

    // Extract from request headers
    const host = request.headers.get("host")
    const protocol = request.headers.get("x-forwarded-proto") || "http"

    if (host) {
        return `${protocol}://${host}`
    }

    // Fallback to localhost
    return "http://localhost:3000"
}
