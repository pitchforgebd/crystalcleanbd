/**
 * Production entry point for cPanel's "Setup Node.js App" (Phusion Passenger).
 *
 * Passenger boots a single file rather than running `npm start`, and it decides
 * the port itself, so this starts Next programmatically and listens on
 * process.env.PORT. Locally `npm start` (next start) still works the same.
 */
const { createServer } = require("node:http");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, () => {
      console.log(`> Crystal Clean Service ready on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start the server:", error);
    process.exit(1);
  });
