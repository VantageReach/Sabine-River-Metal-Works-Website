import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  let filePath = join(root, decodeURIComponent(url.pathname));

  if (url.pathname.endsWith("/")) filePath = join(filePath, "index.html");
  if (!existsSync(filePath) && !extname(filePath)) filePath = `${filePath}.html`;
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) filePath = join(root, "404.html");

  res.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
    "Content-Type": types[extname(filePath)] || "application/octet-stream"
  });
  createReadStream(filePath).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Sabine River Metal Works preview: http://localhost:${port}`);
});
