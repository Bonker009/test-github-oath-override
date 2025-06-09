"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Eye, EyeOff, Info } from "lucide-react"

export default function PersonalTokenGitHub() {
    const [token, setToken] = useState("")
    const [username, setUsername] = useState("")
    const [showToken, setShowToken] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchUsername = async () => {
        if (!token.trim()) {
            setError("Please enter a GitHub personal access token")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/github-username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ personalAccessToken: token }),
            })

            const data = await response.json()

            if (response.ok) {
                setUsername(data.username)
                setToken("") // Clear token for security
            } else {
                setError(data.error || "Failed to fetch username")
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Network error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    GitHub Username (Token Method)
                </CardTitle>
                <CardDescription>Use a personal access token to get your GitHub username</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription className="text-xs">
                        Create a token at GitHub → Settings → Developer settings → Personal access tokens. No special scopes needed
                        for username.
                    </AlertDescription>
                </Alert>

                {!username ? (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="token">Personal Access Token</Label>
                            <div className="relative">
                                <Input
                                    id="token"
                                    type={showToken ? "text" : "password"}
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="ghp_xxxxxxxxxxxx"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowToken(!showToken)}
                                >
                                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription className="text-xs">{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button onClick={fetchUsername} disabled={isLoading || !token.trim()} className="w-full">
                            {isLoading ? "Fetching..." : "Get Username"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                                Username: <span className="font-mono font-semibold">@{username}</span>
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setUsername("")
                                setError("")
                            }}
                            className="w-full"
                        >
                            Clear Username
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
