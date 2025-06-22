import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  SearchIcon,
  TrashIcon,
  BarChart3Icon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { Analytics, UrlInfo } from "@/types/api";
import { deleteShortUrl, getAllUrls, getAnalytics } from "@/services/api";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { BASE_URL } from "@/lib/constants";

interface UrlManagementProps {
  refreshTrigger: number;
}

export function UrlManagement({ refreshTrigger }: UrlManagementProps) {
  const [urls, setUrls] = useState<UrlInfo[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<UrlInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
  }, [refreshTrigger]);

  useEffect(() => {
    const filtered = urls.filter(
      url =>
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (url.alias &&
          url.alias.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUrls(filtered);
  }, [urls, searchTerm]);

  const loadUrls = async () => {
    try {
      setIsLoading(true);
      const urlList = await getAllUrls();
      setUrls(urlList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load URLs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUrl = async (alias: string) => {
    try {
      setDeletingId(alias);
      await deleteShortUrl(alias);
      setUrls(urls.filter(url => url.alias !== alias));
      toast({
        title: "Success",
        description: "URL deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete URL",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = async (alias: string) => {
    const shortUrl = `${BASE_URL}/${alias}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(alias);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const isExpired = (expiresAt?: string) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5" />
              URL Management
            </CardTitle>
            <CardDescription>
              Manage your shortened URLs, view statistics, and delete old links
            </CardDescription>
          </div>
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search URLs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUrls.length === 0 ? (
          <Alert>
            <AlertDescription>
              {urls.length === 0
                ? "No URLs found. Create your first short URL above!"
                : "No URLs match your search criteria."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short URL</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Original URL
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Stats
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUrls.map(url => (
                    <TableRow key={url.alias}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {`${BASE_URL}/${url.alias}`}
                            </code>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(url.alias)}
                            >
                              {copiedId === url.alias ? (
                                <CheckIcon className="h-3 w-3 text-green-600" />
                              ) : (
                                <CopyIcon className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {isExpired(url.expiresAt) && (
                              <Badge
                                variant={
                                  isExpired(url.expiresAt)
                                    ? "destructive"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                <CalendarIcon className="w-2 h-2 mr-1" />
                                Expired
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {url.originalUrl}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm">
                          <div className="font-medium">
                            {url.clickCount} clicks
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(url.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              window.open(`${BASE_URL}/${url.alias}`, "_blank")
                            }
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setSelectedUrl(
                                selectedUrl === url.alias ? null : url.alias
                              )
                            }
                          >
                            <BarChart3Icon className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                disabled={deletingId === url.alias}
                              >
                                {deletingId === url.alias ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <TrashIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Short URL
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this short
                                  URL? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUrl(url.alias)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {selectedUrl && (
              <UrlAnalytics
                shortUrl={selectedUrl}
                onClose={() => setSelectedUrl(null)}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface UrlAnalyticsProps {
  shortUrl: string;
  onClose: () => void;
}

function UrlAnalytics({ shortUrl, onClose }: UrlAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [shortUrl]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await getAnalytics(shortUrl);
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">
            No analytics found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-700">
            Analytics for /{shortUrl}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-700">Click Statistics</h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.clickCount}
              </div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-blue-700">Recent IP Addresses</h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200 space-y-2">
              {analytics.last5Ips.length > 0 ? (
                analytics.last5Ips.map((ip: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {ip}
                    </code>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No clicks yet
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
