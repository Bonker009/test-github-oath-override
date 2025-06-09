import GitHubUsernameConnector from "@/components/github-username-connector"
import PersonalTokenGitHub from "@/components/personal-token-github"

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GitHub Username Integration</h1>
            <p className="text-gray-600">Get GitHub username without affecting your existing authentication</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-semibold mb-4">OAuth Method</h2>
              <GitHubUsernameConnector />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Token Method</h2>
              <PersonalTokenGitHub />
            </div>
          </div>
        </div>
      </div>
  )
}
