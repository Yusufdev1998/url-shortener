const API_URL = "http://localhost:3000";

export async function createShortUrl(data: {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
}) {
  const res = await fetch(`${API_URL}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getInfo(alias: string) {
  const res = await fetch(`${API_URL}/info/${alias}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAnalytics(alias: string) {
  const res = await fetch(`${API_URL}/analytics/${alias}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteShortUrl(alias: string) {
  const res = await fetch(`${API_URL}/delete/${alias}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
