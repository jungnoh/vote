import express from "express";
import { createProxyMiddleware as proxyMiddleware } from "http-proxy-middleware";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.APP_PORT ?? "3000");

const app = next({ dev, dir: "./src" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  if (dev) {
    server.use(
      proxyMiddleware("/api", {
        target: "http://localhost:8080",
        pathRewrite: { "^/api": "/" },
        changeOrigin: true,
      })
    );
  }
  server.all("*", (req, res) => handle(req, res));
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
