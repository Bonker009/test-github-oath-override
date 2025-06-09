import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Alternative approach: Get username with a GitHub personal access token
export async function GET() {
    try {
        const cookieStore = await cookies()
        const storedUsername = cookieStore.get("github_username")?.value

        if (storedUsername) {
            return NextResponse.json({ username: storedUsername })
        }

        return NextResponse.json({ username: null })
    } catch (error) {
        console.error("Failed to get GitHub username:", error)
        return NextResponse.json({ error: "Failed to get username" }, { status: 500 })
    }
}

// Alternative: Use GitHub API with personal access token (simpler approach)
export async function POST(request: Request) {
    try {
        const { personalAccessToken } = await request.json()

        const response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${personalAccessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch GitHub user")
        }

        const userData = await response.json()

        // Store username without affecting your main auth
        const cookieStore = await cookies()
        cookieStore.set("github_username", userData.login, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        return NextResponse.json({ username: userData.login })
    } catch (error) {
        console.error("GitHub API error:", error)
        return NextResponse.json({ error: "Failed to fetch username" }, { status: 500 })
    }
}
