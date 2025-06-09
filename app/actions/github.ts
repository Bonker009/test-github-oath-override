"use server"

import { cookies } from "next/headers"

interface GitHubUser {
    login: string
    name: string
    avatar_url: string
    html_url: string
    bio: string
    public_repos: number
    followers: number
    following: number
    created_at: string
    updated_at: string
    location: string
    company: string
    blog: string
    twitter_username: string
}

interface GitHubRepo {
    id: number
    name: string
    full_name: string
    html_url: string
    description: string
    fork: boolean
    created_at: string
    updated_at: string
    pushed_at: string
    stargazers_count: number
    watchers_count: number
    language: string
    forks_count: number
    open_issues_count: number
    visibility: string
    topics: string[]
    default_branch: string
}

export async function getGitHubProfile(): Promise<{
    user: GitHubUser | null
    repos: GitHubRepo[]
    todayRepos: GitHubRepo[]
    error?: string
}> {
    try {
        const cookieStore = await cookies()
        const username = cookieStore.get("github_username")?.value

        if (!username) {
            return {
                user: null,
                repos: [],
                todayRepos: [],
                error: "No GitHub username found. Please connect your GitHub account.",
            }
        }

        console.log("Fetching GitHub data for username:", username)

        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "GitHub-Profile-App",
                ...(process.env.GITHUB_PAT ? { Authorization: `token ${process.env.GITHUB_PAT}` } : {}),
            },
            cache: "no-store", // Don't cache for dynamic content
        })

        if (!userResponse.ok) {
            console.error("GitHub API error:", userResponse.status, userResponse.statusText)
            const errorText = await userResponse.text()
            console.error("GitHub API error details:", errorText)
            return {
                user: null,
                repos: [],
                todayRepos: [],
                error: `Failed to fetch GitHub profile: ${userResponse.statusText}`,
            }
        }

        const user = await userResponse.json()
        console.log("Successfully fetched user data for:", user.login)

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "GitHub-Profile-App",
                ...(process.env.GITHUB_PAT ? { Authorization: `token ${process.env.GITHUB_PAT}` } : {}),
            },
            cache: "no-store", // Don't cache for dynamic content
        })

        if (!reposResponse.ok) {
            console.error("GitHub repos API error:", reposResponse.status, reposResponse.statusText)
            const errorText = await reposResponse.text()
            console.error("GitHub repos API error details:", errorText)
            return {
                user,
                repos: [],
                todayRepos: [],
                error: `Failed to fetch repositories: ${reposResponse.statusText}`,
            }
        }

        const repos = await reposResponse.json()
        console.log(`Successfully fetched ${repos.length} repositories`)

        // Filter for repos updated today
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const todayRepos = repos.filter((repo: GitHubRepo) => {
            const updatedDate = new Date(repo.pushed_at)
            return updatedDate >= today
        })

        console.log(`Found ${todayRepos.length} repositories updated today`)

        return { user, repos, todayRepos }
    } catch (error) {
        console.error("Error fetching GitHub data:", error)
        return {
            user: null,
            repos: [],
            todayRepos: [],
            error: error instanceof Error ? error.message : "Unknown error fetching GitHub data",
        }
    }
}
