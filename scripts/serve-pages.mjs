import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "../out");
const basePath = (process.env.PAGES_BASE_PATH || "").replace(/\/$/, "");
const port = Number(process.env.PORT || 3002);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon" };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    const path = decodeURIComponent(url.pathname);
    if (basePath && path !== basePath && !path.startsWith(`${basePath}/`)) throw new Error("Outside base path");
    const localPath = path.slice(basePath.length) || "/";
    let file = resolve(root, `.${localPath}`);
    if (file !== root && !file.startsWith(root + sep)) throw new Error("Outside export");
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(308, { Location: `${url.pathname}/${url.search}` });
        response.end();
        return;
      }
      file = resolve(file, "index.html");
    }
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(resolve(root, "404.html")).catch(() => "Not found"));
  }
}).listen(port, "127.0.0.1", () => console.log(`Static Pages: http://127.0.0.1:${port}${basePath}/`));
