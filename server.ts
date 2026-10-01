import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn, ChildProcess } from 'child_process';
import http from 'http';

const app = express();
const PORT = 3000;
const UI5_PORT = 3001;

let ui5Process: ChildProcess | null = null;
let ui5Ready = false;

function startUI5Server() {
  console.log(`[Server] Starting UI5 Mock Server on internal port ${UI5_PORT}...`);
  ui5Process = spawn('npx', [
    'ui5', 'serve',
    '--config', './ui5-mock.yaml',
    '--port', String(UI5_PORT),
    '--accept-remote-connections'
  ], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  ui5Process.stdout?.on('data', (data) => {
    const msg = data.toString();
    process.stdout.write(msg);
    if (msg.includes('Server started') || msg.includes(`http://localhost:${UI5_PORT}`)) {
      ui5Ready = true;
      console.log('[Server] UI5 Mock Server is ready!');
    }
  });

  ui5Process.stderr?.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  ui5Process.on('exit', (code) => {
    console.log(`[Server] UI5 Mock Server exited with code ${code}`);
    ui5Ready = false;
  });
}

startUI5Server();

const cleanup = () => {
  if (ui5Process) {
    console.log('[Server] Shutting down UI5 server...');
    ui5Process.kill('SIGTERM');
    ui5Process = null;
  }
};

process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(0); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

// Root route: Redirect immediately to the Fiori Launchpad Sandbox tile
app.get('/', (req: Request, res: Response) => {
  res.redirect('/test/flpSandbox.html?sap-client=310&sap-ui-xx-viewCache=false#app-tile');
});

// FLP shorthand
app.get('/flp', (req: Request, res: Response) => {
  res.redirect('/test/flpSandbox.html?sap-client=310&sap-ui-xx-viewCache=false#app-tile');
});

// Standalone shorthand
app.get('/standalone', (req: Request, res: Response) => {
  res.redirect('/index.html?sap-client=310&sap-ui-xx-viewCache=false');
});

function generateSamplePdf(filename: string): Buffer {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const now = new Date().toUTCString();
  const content = [
    'BT',
    '/F1 20 Tf',
    '50 750 Td',
    '(ACPR - PURCHASE REQUISITION ATTACHMENT) Tj',
    '0 -30 Td',
    '/F1 14 Tf',
    `(Document: ${safeFilename}) Tj`,
    '0 -25 Td',
    '/F1 11 Tf',
    '(Status: Verified & Validated in System) Tj',
    '0 -20 Td',
    `(Retrieved: ${now}) Tj`,
    '0 -30 Td',
    '/F1 11 Tf',
    '(Specifications and approval documentation for Collective PR workflow.) Tj',
    '0 -20 Td',
    '(All technical and commercial line items have been recorded.) Tj',
    'ET'
  ].join('\n');

  const streamLength = Buffer.byteLength(content, 'utf-8');
  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${content}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000318 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${420 + streamLength}
%%EOF`;

  return Buffer.from(pdfString, 'utf-8');
}

// Serve real PDF / TXT binaries for attachment preview requests
app.use((req: Request, res: Response, next: any) => {
  if (req.path.startsWith('/sap/opu/odata/sap/Z_PR_APPROVAL_SRV/AttachmentSet') && (req.originalUrl.includes('$value') || req.originalUrl.includes('%24value'))) {
    const match = req.originalUrl.match(/Zfilename=['"]([^'"]+)['"]/i);
    const filename = match ? decodeURIComponent(match[1]) : 'attachment.pdf';
    console.log(`[Server] Serving mock attachment file: ${filename}`);

    if (filename.toLowerCase().endsWith('.txt')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send(`=== ACPR Attachment: ${filename} ===\n\nRequisition details and compliance certificate.\nStatus: Approved for procurement.\nDate: ${new Date().toLocaleDateString()}\n`);
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      return res.send(generateSamplePdf(filename));
    }
  }
  next();
});

// Proxy middleware to forward all requests to UI5 internal server
const proxy = createProxyMiddleware({
  target: `http://127.0.0.1:${UI5_PORT}`,
  changeOrigin: true,
  ws: true,
  on: {
    error: (err: Error, req: http.IncomingMessage, res: any) => {
      console.warn(`[Proxy] Target not ready yet: ${err.message}`);
      if (res.writeHead && !res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Starting Approve Collective Purchase Requisition...</title>
              <meta http-equiv="refresh" content="2">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f7f9fa; color: #32363a; }
                .card { text-align: center; background: #fff; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); max-width: 480px; }
                .spinner { width: 40px; height: 40px; border: 4px solid #e1e7ec; border-top-color: #0a6ed1; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 1.5rem; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                h2 { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 600; }
                p { margin: 0; color: #6a6d70; font-size: 0.9rem; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="spinner"></div>
                <h2>Starting ACPR Application</h2>
                <p>Initializing SAP Fiori UI5 server and OData mock services. Reloading shortly...</p>
              </div>
            </body>
          </html>
        `);
      }
    }
  }
});

app.use(proxy);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] ACPR Application running on http://0.0.0.0:${PORT}`);
});

server.on('upgrade', (req, socket, head) => {
  (proxy as any).upgrade?.(req, socket, head);
});
