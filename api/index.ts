import { createServer } from 'http';
import { parse } from 'url';
import { app } from '../../server/src/server';

// Vercel serverless function handler
const server = createServer((req, res) => {
  // Parse URL
  const parsedUrl = parse(req.url!, true);
  req.url = parsedUrl.pathname || '/';

  // @ts-ignore - attach query to request
  req.query = parsedUrl.query;

  // Handle request with Express app
  app(req, res);
});

module.exports = server;
module.exports.default = server;