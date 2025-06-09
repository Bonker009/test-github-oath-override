import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Github } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default async function Dashboard({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const cookieStore = await cookies()
    const storedUsername = cookieStore.get("github_username")?.value

    // Await searchParams first, then access properties
    const params = await searchParams
    const error = params.error as string
    const success = params.success as string
    const githubUsername = params.github_username as string
    const errorDetails = params.details as string

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

                {/* Error Display */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <XCircle className="w-4 h-4" />
                        <AlertDescription>
                            <strong>Error:</strong> {error}
                            {errorDetails && (
                                <div className="mt-2 text-sm opacity-80">Details: {decodeURIComponent(errorDetails)}</div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success Display */}
                {success && githubUsername && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Successfully connected GitHub account: <Badge variant="secondary">@{githubUsername}</Badge>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Current Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>GitHub Integration Status</CardTitle>
                        <CardDescription>Current state of your GitHub username connection</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {storedUsername ? (
                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-800">
                  Connected:{" "}
                                    <Badge variant="secondary" className="ml-2">
                    @{storedUsername}
                  </Badge>
                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <span className="text-yellow-800">No GitHub username connected</span>
                            </div>
                        )}

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <a
                                href="/auth/github"
                                className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                {storedUsername ? "Reconnect" : "Connect"} GitHub
                            </a>

                            {storedUsername && (
                                <Link
                                    href="/github-profile"
                                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    View GitHub Profile
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Debug Information */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-sm">Debug Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2 font-mono">
                        <div>Environment: {process.env.NODE_ENV}</div>
                        <div>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || "not set"}</div>
                        <div>GITHUB_CLIENT_ID: {process.env.GITHUB_CLIENT_ID ? "set" : "not set"}</div>
                        <div>GITHUB_CLIENT_SECRET: {process.env.GITHUB_CLIENT_SECRET ? "set" : "not set"}</div>
                        <div>GITHUB_PAT: {process.env.GITHUB_PAT ? "set" : "not set"}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
