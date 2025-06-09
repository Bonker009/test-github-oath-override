import { Suspense } from "react"
import { getGitHubProfile } from "../actions/github"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Calendar, Code, ExternalLink, GitFork, History, Star, Users } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
            <Skeleton className="h-[400px] w-full" />
        </div>
    )
}

async function GitHubProfileContent() {
    const { user, repos, todayRepos, error } = await getGitHubProfile()

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!user) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No GitHub Profile</AlertTitle>
                <AlertDescription>
                    No GitHub profile found. Please connect your GitHub account first.
                    <div className="mt-4">
                        <a
                            href="/auth/github"
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Connect GitHub
                        </a>
                    </div>
                </AlertDescription>
            </Alert>
        )
    }

    // Sort repos by most recently updated
    const sortedRepos = [...repos].sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <img
                            src={user.avatar_url || "/placeholder.svg?height=96&width=96"}
                            alt={`${user.login}'s avatar`}
                            className="rounded-full w-24 h-24 border-2 border-gray-200"
                        />
                        <div className="space-y-2">
                            <div>
                                <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
                                <a
                                    href={user.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                >
                                    @{user.login} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                            {user.bio && <p className="text-gray-700">{user.bio}</p>}
                            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                                {user.location && <span className="flex items-center gap-1">📍 {user.location}</span>}
                                {user.company && <span className="flex items-center gap-1">🏢 {user.company}</span>}
                                {user.blog && (
                                    <a
                                        href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    >
                                        🔗 {user.blog}
                                    </a>
                                )}
                                {user.twitter_username && (
                                    <a
                                        href={`https://twitter.com/${user.twitter_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    >
                                        𝕏 @{user.twitter_username}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                        <Code className="h-5 w-5 text-blue-600 mb-1" />
                        <div className="text-2xl font-bold">{user.public_repos}</div>
                        <p className="text-sm text-gray-500">Repositories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                        <Users className="h-5 w-5 text-green-600 mb-1" />
                        <div className="text-2xl font-bold">{user.followers}</div>
                        <p className="text-sm text-gray-500">Followers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                        <Users className="h-5 w-5 text-purple-600 mb-1" />
                        <div className="text-2xl font-bold">{user.following}</div>
                        <p className="text-sm text-gray-500">Following</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                        <Calendar className="h-5 w-5 text-orange-600 mb-1" />
                        <div className="text-sm font-medium">Joined</div>
                        <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Repositories */}
            <Tabs defaultValue={todayRepos.length > 0 ? "today" : "all"}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Repositories</h2>
                    <TabsList>
                        {todayRepos.length > 0 && <TabsTrigger value="today">Today ({todayRepos.length})</TabsTrigger>}
                        <TabsTrigger value="all">All ({repos.length})</TabsTrigger>
                    </TabsList>
                </div>

                {todayRepos.length > 0 && (
                    <TabsContent value="today">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                {todayRepos.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No repositories updated today.</p>
                                ) : (
                                    todayRepos.map((repo, index) => (
                                        <div key={repo.id}>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-start">
                                                    <a
                                                        href={repo.html_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        {repo.name} <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" /> {repo.stargazers_count}
                            </span>
                                                        <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" /> {repo.forks_count}
                            </span>
                                                    </div>
                                                </div>
                                                {repo.description && <p className="text-sm text-gray-600">{repo.description}</p>}
                                                <div className="flex flex-wrap gap-2">
                                                    {repo.language && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {repo.language}
                                                        </Badge>
                                                    )}
                                                    {repo.topics?.slice(0, 3).map((topic) => (
                                                        <Badge key={topic} variant="secondary" className="text-xs">
                                                            {topic}
                                                        </Badge>
                                                    ))}
                                                    {repo.visibility && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {repo.visibility}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <History className="h-3 w-3" /> Updated {formatDate(repo.pushed_at)}
                                                </div>
                                            </div>
                                            {index < todayRepos.length - 1 && <Separator className="my-4" />}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                <TabsContent value="all">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            {sortedRepos.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No repositories found.</p>
                            ) : (
                                sortedRepos.slice(0, 10).map((repo, index) => (
                                    <div key={repo.id}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <a
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    {repo.name} <ExternalLink className="h-3 w-3" />
                                                </a>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" /> {repo.stargazers_count}
                          </span>
                                                    <span className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" /> {repo.forks_count}
                          </span>
                                                </div>
                                            </div>
                                            {repo.description && <p className="text-sm text-gray-600">{repo.description}</p>}
                                            <div className="flex flex-wrap gap-2">
                                                {repo.language && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {repo.language}
                                                    </Badge>
                                                )}
                                                {repo.topics?.slice(0, 3).map((topic) => (
                                                    <Badge key={topic} variant="secondary" className="text-xs">
                                                        {topic}
                                                    </Badge>
                                                ))}
                                                {repo.visibility && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {repo.visibility}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <History className="h-3 w-3" /> Updated {formatDate(repo.pushed_at)}
                                            </div>
                                        </div>
                                        {index < sortedRepos.length - 1 && index < 9 && <Separator className="my-4" />}
                                    </div>
                                ))
                            )}
                            {repos.length > 10 && (
                                <CardFooter className="pt-4 px-0">
                                    <a
                                        href={`https://github.com/${user.login}?tab=repositories`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        View all {repos.length} repositories <ExternalLink className="h-3 w-3" />
                                    </a>
                                </CardFooter>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Metadata */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Metadata</CardTitle>
                    <CardDescription>Additional information about your GitHub account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Username</p>
                            <p className="text-sm text-gray-500">{user.login}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Profile URL</p>
                            <a
                                href={user.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                {user.html_url} <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Account Created</p>
                            <p className="text-sm text-gray-500">{formatDate(user.created_at)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Last Updated</p>
                            <p className="text-sm text-gray-500">{formatDate(user.updated_at)}</p>
                        </div>
                        {user.company && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Company</p>
                                <p className="text-sm text-gray-500">{user.company}</p>
                            </div>
                        )}
                        {user.location && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-sm text-gray-500">{user.location}</p>
                            </div>
                        )}
                        {user.blog && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Website</p>
                                <a
                                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    {user.blog} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                        {user.twitter_username && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Twitter</p>
                                <a
                                    href={`https://twitter.com/${user.twitter_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    @{user.twitter_username} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function GitHubProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">GitHub Profile</h1>
                    <div className="flex gap-2">
                        <a
                            href="/dashboard"
                            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/auth/github"
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Reconnect GitHub
                        </a>
                    </div>
                </div>

                <Suspense fallback={<ProfileSkeleton />}>
                    <GitHubProfileContent />
                </Suspense>
            </div>
        </div>
    )
}
