const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://api.github.com";

// Logging
app.use(morgan("dev"));

// Info GET endpoint
app.get("/info", (req, res, next) => {
  res.send(
    "This is a simple API server that proxies requests to the Github API.\n"
  );
});

// Authorization
app.use(" ", (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.sendStatus(403);
  }
});

// Home GET endpoint to Redirect to Info
app.get("/", (req, res, next) => {
  res.redirect("/info");
});

// Proxy endpoints for user
app.use(
  "/gh_users/:username",
  createProxyMiddleware({
    target: API_SERVICE_URL + "/users",
    changeOrigin: true,
    pathRewrite: {
      [`^/gh_users`]: "",
    },
  })
);
app.use("/gh_users", (req, res, next) => {
  res.json({
    message: "mention username as url parameter",
  });
});

// Proxy endpoints for repositories
app.use(
  "/gh_repos/:username/:repository",
  createProxyMiddleware({
    target: API_SERVICE_URL + "/repos",
    changeOrigin: true,
    pathRewrite: {
      [`^/gh_repos`]: "",
    },
  })
);
app.use("/gh_repos/:username", (req, res, next) => {
  res.json({
    message: "mention repo name as url parameter",
  });
});
app.use("/gh_repos", (req, res, next) => {
  res.json({
    message: "mention username as url parameter",
  });
});

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
