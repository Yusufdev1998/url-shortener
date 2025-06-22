import { useState } from "react";
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
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  CalendarIcon,
} from "lucide-react";
import { ShortenResponse } from "@/types/api";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface UrlResultProps {
  result: ShortenResponse;
}

export function UrlResult({ result }: UrlResultProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.alias);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const openUrl = () => {
    window.open(result.alias, "_blank");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50/50">
      <CardHeader>
        <CardTitle className="text-green-700">
          URL Shortened Successfully!
        </CardTitle>
        <CardDescription>Your short URL is ready to use</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-green-700">
            Short URL:
          </label>
          <div className="flex gap-2">
            <Input
              value={result.alias}
              readOnly
              className="font-mono text-base bg-white border-green-200"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="icon"
              className="border-green-200 hover:bg-green-100"
            >
              {copied ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={openUrl}
              variant="outline"
              size="icon"
              className="border-green-200 hover:bg-green-100"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">
              Original URL:
            </span>
            <p
              className="break-all text-blue-600 hover:underline cursor-pointer"
              onClick={openUrl}
            >
              {result.originalUrl}
            </p>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Created:</span>
            <p>{format(new Date(result.createdAt), "PPp")}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {result.expiresAt && (
            <Badge
              variant="outline"
              className="border-orange-200 text-orange-700"
            >
              <CalendarIcon className="w-3 h-3 mr-1" />
              Expires: {format(new Date(result.expiresAt), "PP")}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
