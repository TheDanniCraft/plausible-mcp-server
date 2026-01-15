# Plausible Model Context Protocol Server

MCP Interaction Server for Plausible Analytics

A Model Context Protocol (MCP) server implementation for interacting with the Plausible Analytics API. This server allows AI models to query analytics data from Plausible via HTTP using the Streamable HTTP transport.

## Configuration

The server requires the following environment variables:

- `PLAUSIBLE_API_URL`: The Plausible API URL (default: `https://plausible.io/api/v2`)
- `PLAUSIBLE_API_KEY`: Your Plausible API key (required)
- `PORT`: The port to run the server on (default: `80`)

## Running the Server

### Using Node.js

Build and run the server:

```bash
npm install
npm run build
PLAUSIBLE_API_KEY=your_api_key PORT=3000 node dist/index.js
```

The server will be available at `http://localhost:3000/mcp` (or port 80 if not specified).

### Using Docker

Build and run with Docker:

```bash
docker build -t plausible-mcp-server .
docker run -p 80:80 \
  -e PLAUSIBLE_API_KEY=your_api_key \
  -e PLAUSIBLE_API_URL=https://plausible.io/api/v2 \
  plausible-mcp-server
```

## Endpoints

- `POST /mcp` - Main MCP endpoint for requests
- `GET /mcp` - SSE endpoint for streaming responses
- `DELETE /mcp` - Session termination endpoint
- `GET /health` - Health check endpoint

## MCP Client Integration

To connect an MCP client to this server, use the Streamable HTTP transport with the following endpoint:

```
http://localhost:80/mcp
```

Example initialization request:

```bash
curl -X POST http://localhost:80/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "your-client",
        "version": "1.0.0"
      }
    },
    "id": 1
  }'
```

## Available Tools

### plausible_query

Query analytics data from Plausible.

**Parameters:**
- `site_id` (string, required): The site ID to query
- `metrics` (array, required): Array of metrics to retrieve
- `date_range` (object, required): Date range for the query

## Development

Watch mode for development:

```bash
npm run watch
```

In another terminal:

```bash
PLAUSIBLE_API_KEY=your_api_key PORT=3000 node dist/index.js
```

## Contact 

If you have questions, feel free to contact us via [AVIMBU](https://avimbu.com).