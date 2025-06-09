import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, ExternalLink } from "lucide-react"

export default function GitHubPATSetup() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold text-center mb-8">GitHub Personal Access Token Setup</h1>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Why use a Personal Access Token?</CardTitle>
                        <CardDescription>Benefits of adding a GitHub PAT to your environment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Adding a GitHub Personal Access Token (PAT) to your environment variables provides several benefits:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Higher API rate limits (5,000 requests/hour vs 60 requests/hour for unauthenticated requests)</li>
                            <li>Access to private repositories (if you grant those permissions)</li>
                            <li>More detailed repository information</li>
                            <li>Ability to perform actions on behalf of the user</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Creating a GitHub PAT</CardTitle>
                        <CardDescription>Step-by-step instructions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ol className="list-decimal pl-5 space-y-4">
                            <li>
                                <div className="font-medium">Go to GitHub Settings</div>
                                <p className="text-sm text-gray-600">
                                    Navigate to your GitHub account settings by clicking on your profile picture in the top right corner
                                    and selecting &#34;Settings&#34;.
                                </p>
                            </li>
                            <li>
                                <div className="font-medium">Access Developer Settings</div>
                                <p className="text-sm text-gray-600">
                                    Scroll down to the bottom of the sidebar and click on &#34;Developer settings&#34;.
                                </p>
                            </li>
                            <li>
                                <div className="font-medium">Personal Access Tokens</div>
                                <p className="text-sm text-gray-600">Click on &#34;Personal access tokens&#34; and then &#34;Tokens (classic)&#34;.</p>
                            </li>
                            <li>
                                <div className="font-medium">Generate New Token</div>
                                <p className="text-sm text-gray-600">
                                    Click on &#34;Generate new token&#34; and then &#34;Generate new token (classic)&#34;.
                                </p>
                            </li>
                            <li>
                                <div className="font-medium">Set Token Name and Expiration</div>
                                <p className="text-sm text-gray-600">
                                    Give your token a descriptive name like &#34;GitHub Profile App&#34; and set an expiration date.
                                </p>
                            </li>
                            <li>
                                <div className="font-medium">Select Scopes</div>
                                <p className="text-sm text-gray-600">
                                    For basic profile and public repository information, you only need to select the &#34;repo:status&#34; and
                                    &#34;read:user&#34; scopes.
                                </p>
                            </li>
                            <li>
                                <div className="font-medium">Generate Token</div>
                                <p className="text-sm text-gray-600">Click &#34;Generate token&#34; at the bottom of the page.</p>
                            </li>
                            <li>
                                <div className="font-medium">Copy Your Token</div>
                                <p className="text-sm text-gray-600 font-bold">
                                    IMPORTANT: Copy your token immediately! You won&#39;t be able to see it again.
                                </p>
                            </li>
                        </ol>

                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                <a
                                    href="https://github.com/settings/tokens"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    Go to GitHub Personal Access Tokens <ExternalLink className="h-3 w-3" />
                                </a>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Adding the PAT to Your Environment</CardTitle>
                        <CardDescription>Configure your application to use the token</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            Add the following to your <code>.env.local</code> file:
                        </p>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                            GITHUB_PAT=your_personal_access_token_here
                        </div>
                        <p className="text-sm text-gray-600">
                            After adding this environment variable, restart your development server for the changes to take effect.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
