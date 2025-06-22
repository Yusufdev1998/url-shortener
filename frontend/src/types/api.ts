export interface IShortenRequest {
  originalUrl: string;
  expiresAt?: string;
  alias?: string;
}

export interface ShortenResponse {
  alias: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;

}

export interface UrlInfo {
  alias: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  expiresAt?: string;

}

export interface Analytics {
  clickCount: number;
  last5Ips: string[];
}

export interface ApiError {
  message: string;
  status: number;
}