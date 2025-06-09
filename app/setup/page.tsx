import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info, ExternalLink } from "lucide-react"

export default function Setup() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-8">GitHub OAuth Setup Guide</h1>

                <div className="space-y-6">
                    <Alert>
                        <Info className="w-4 h-4" />
                        <AlertDescription>
                            Follow these steps to set up GitHub OAuth for username fetching without affecting your existing Auth.js
                            setup.
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <CardTitle>1. Create GitHub OAuth App</CardTitle>
                            <CardDescription>Set up a new OAuth application on GitHub</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm">Go to GitHub Settings → Developer settings → OAuth Apps</p>
                                <a
                                    href="https://github.com/settings/applications/new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Create OAuth App <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                <div>
                                    <strong>Application name:</strong> Your App Name
                                </div>
                                <div>
                                    <strong>Homepage URL:</strong> <code>http://localhost:3000</code> (or your domain)
                                </div>
                                <div>
                                    <strong>Authorization callback URL:</strong> <code>http://localhost:3000/auth/github</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Environment Variables</CardTitle>
                            <CardDescription>Add these to your .env.local file</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                                <div>GITHUB_CLIENT_ID=your_client_id_here</div>
                                <div>GITHUB_CLIENT_SECRET=your_client_secret_here</div>
                                <div>NEXTAUTH_URL=http://localhost:3000</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Test the Integration</CardTitle>
                            <CardDescription>Verify everything is working</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <a
                                    href="/dashboard"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Go to Dashboard
                                </a>
                                <a
                                    href="/auth/github"
                                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                                >
                                    Test GitHub OAuth
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Common Issues</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <Badge variant="destructive" className="mb-2">
                                    Error: Server configuration error
                                </Badge>
                                <p>Missing environment variables. Check your .env.local file.</p>
                            </div>
                            <div>
                                <Badge variant="destructive" className="mb-2">
                                    Error: github_oauth_error
                                </Badge>
                                <p>Check your OAuth app settings and callback URL.</p>
                            </div>
                            <div>
                                <Badge variant="destructive" className="mb-2">
                                    Error: token_exchange_failed
                                </Badge>
                                <p>Verify your client ID and secret are correct.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
