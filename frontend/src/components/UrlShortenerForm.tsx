import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, LinkIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { IShortenRequest, ShortenResponse } from "@/types/api";
import { createShortUrl } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface UrlShortenerFormProps {
  onUrlShortened: (response: ShortenResponse) => void;
}

export function UrlShortenerForm({ onUrlShortened }: UrlShortenerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive",
      });
      return;
    }

    if (alias && alias.length > 20) {
      toast({
        title: "Alias too long",
        description: "Alias must be 20 characters or less",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const request: IShortenRequest = {
        originalUrl: originalUrl.trim(),
        alias: alias.trim() || undefined,
        expiresAt: expiryDate?.toISOString(),
      };

      const response = await createShortUrl(request);
      onUrlShortened(response);

      // Reset form
      setOriginalUrl("");
      setAlias("");
      setExpiryDate(undefined);

      toast({
        title: "Success!",
        description: "Your URL has been shortened successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to shorten URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <LinkIcon className="h-6 w-6 text-primary" />
          Shorten Your URL
        </CardTitle>
        <CardDescription>
          Create short, memorable links with optional custom aliases and expiry
          dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">Original URL *</Label>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com/your-long-url"
              value={originalUrl}
              onChange={e => setOriginalUrl(e.target.value)}
              className="text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alias">Custom Alias (Optional)</Label>
              <Input
                id="alias"
                type="text"
                placeholder="my-custom-link"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                className="text-base"
                maxLength={20}
              />
              <p className="text-sm text-muted-foreground">
                {alias.length}/20 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={date => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
