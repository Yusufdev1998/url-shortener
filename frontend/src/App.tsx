import React, { useState } from "react";
import { createShortUrl, getInfo, getAnalytics, deleteShortUrl } from "./api";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await createShortUrl({ originalUrl, alias, expiresAt });
      setShortUrl(res.shortUrl);
      setInfo(null);
      setAnalytics(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInfo = async () => {
    setError("");
    try {
      const res = await getInfo(alias);
      setInfo(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAnalytics = async () => {
    setError("");
    try {
      const res = await getAnalytics(alias);
      setAnalytics(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    setError("");
    try {
      await deleteShortUrl(alias);
      setShortUrl("");
      setInfo(null);
      setAnalytics(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>URL Shortener</h1>
      <form onSubmit={handleCreate}>
        <input
          type="url"
          placeholder="Original URL"
          value={originalUrl}
          onChange={e => setOriginalUrl(e.target.value)}
          required
          style={{ width: "100%" }}
        />
        <input
          type="text"
          placeholder="Alias (optional)"
          value={alias}
          onChange={e => setAlias(e.target.value)}
          maxLength={20}
          style={{ width: "100%" }}
        />
        <input
          type="datetime-local"
          placeholder="Expires At (optional)"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          style={{ width: "100%" }}
        />
        <button type="submit">Create Short URL</button>
      </form>
      {shortUrl && (
        <div>
          <p>
            Short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </p>
        </div>
      )}
      <div>
        <button onClick={handleInfo}>Get Info</button>
        <button onClick={handleAnalytics}>Get Analytics</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      {info && (
        <div>
          <h3>Info</h3>
          <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
      )}
      {analytics && (
        <div>
          <h3>Analytics</h3>
          <pre>{JSON.stringify(analytics, null, 2)}</pre>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default App;
