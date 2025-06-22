import { useState } from 'react';
import { UrlShortenerForm } from '@/components/UrlShortenerForm';
import { UrlResult } from '@/components/UrlResult';
import { UrlManagement } from '@/components/UrlManagement';
import { Toaster } from '@/components/ui/toaster';
import { ShortenResponse } from '@/types/api';
import { LinkIcon, Github, Zap } from 'lucide-react';
import './App.css';

function App() {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlShortened = (response: ShortenResponse) => {
    setShortenedUrl(response);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  URL Shortener
                </h1>
                <p className="text-sm text-muted-foreground">Professional link management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Powered by Passion & Hard work</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Shorten, Share, Track
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create short, memorable links with powerful analytics and management features. 
            Perfect for social media, marketing campaigns, and professional use.
          </p>
        </div>

        {/* URL Shortener Form */}
        <UrlShortenerForm onUrlShortened={handleUrlShortened} />

        {/* URL Result */}
        {shortenedUrl && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <UrlResult result={shortenedUrl} />
          </div>
        )}

        {/* URL Management */}
        <div className="space-y-2">
          <UrlManagement refreshTrigger={refreshTrigger} />
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our URL Shortener?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional-grade features for individuals and businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-white border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Custom Aliases</h4>
              <p className="text-sm text-muted-foreground">
                Create memorable, branded short links with custom aliases up to 20 characters.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Advanced Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Track click counts, IP addresses, and detailed analytics for all your links.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-100 flex items-center justify-center">
                <Github className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Expiry Control</h4>
              <p className="text-sm text-muted-foreground">
                Set expiration dates for temporary campaigns and time-sensitive content.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
export default App;