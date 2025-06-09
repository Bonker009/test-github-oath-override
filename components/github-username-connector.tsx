"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, User, CheckCircle } from "lucide-react"

interface GitHubUsernameConnectorProps {
    currentUsername?: string
    onUsernameUpdate?: (username: string) => void
}

export default function GitHubUsernameConnector({ currentUsername, onUsernameUpdate }: GitHubUsernameConnectorProps) {
    const [isConnecting, setIsConnecting] = useState(false)
    const [username, setUsername] = useState(currentUsername)

    const connectGitHub = () => {
        setIsConnecting(true)
        // This redirects to your GitHub OAuth route that only fetches username
        window.location.href = "/auth/github"
    }

    const disconnectGitHub = async () => {
        try {
            const response = await fetch("/api/disconnect-github", {
                method: "POST",
            })

            if (response.ok) {
                setUsername(undefined)
                onUsernameUpdate?.("")
            }
        } catch (error) {
            console.error("Failed to disconnect GitHub:", error)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    GitHub Username
                </CardTitle>
                <CardDescription>Connect your GitHub account to display your username</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {username ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-800">Connected to GitHub</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="secondary" className="font-mono">
                                @{username}
                            </Badge>
                        </div>

                        <Button variant="outline" size="sm" onClick={disconnectGitHub} className="w-full">
                            Disconnect GitHub
                        </Button>
                    </div>
                ) : (
                    <Button onClick={connectGitHub} disabled={isConnecting} className="w-full">
                        <Github className="w-4 h-4 mr-2" />
                        {isConnecting ? "Connecting..." : "Connect GitHub"}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
