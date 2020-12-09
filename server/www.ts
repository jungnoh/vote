import createApp from "./src";
import http from "http";

const port = parseInt(process.env.SERVER_PORT ?? "8080");

createApp().then((app) => {
  const httpServer = http.createServer(app);
  httpServer.listen(port);
  console.log(`Listening at port ${port}`);
});
