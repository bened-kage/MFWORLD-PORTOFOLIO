import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files statically
const uploadsPath = path.join(__dirname, "../uploads");
console.log("uploadsPath =", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    // Log all requests, not just API requests
    log(logLine);
    
    // Log 500 errors with more detail
    if (res.statusCode === 500) {
      console.error(`500 Error for ${req.method} ${requestPath}`);
      console.error(`User Agent: ${req.get('User-Agent')}`);
      console.error(`Referer: ${req.get('Referer')}`);
    }
  });

  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API status endpoint at a different path
app.get("/api/status", (req, res) => {
  res.send("PortfolioTracker API is running!");
});

(async () => {
  try {
    const server = await registerRoutes(app);

    // Global error handler - must be after all routes
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      console.error("Global error handler caught:", err);
      console.error("Request URL:", req.url);
      console.error("Request method:", req.method);
      console.error("Request headers:", req.headers);
      console.error("Error stack:", err.stack);
      
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ 
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString()
      });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Use PORT from environment variable for Railway deployment
    const port = process.env.PORT || 5000;
    server.listen({
      port,
      host: "0.0.0.0", // Listen on all available network interfaces

    }, () => {
      log(`serving on port ${port}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
