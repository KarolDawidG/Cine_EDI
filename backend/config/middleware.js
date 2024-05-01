const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const URL = require("./url");

const middleware = express.Router();

middleware.use(bodyParser.json({ limit: "200kb" }));
middleware.use(bodyParser.urlencoded({ limit: "200kb", extended: true }));

middleware.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

middleware.use(express.json());

middleware.use(express.urlencoded({ extended: true }));

middleware.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'trusted-cdn.com'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "img.example.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "fonts.example.com"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hsts: { maxAge: 5184000 },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    hidePoweredBy: true,
    permittedCrossDomainPolicies: true,
  })
);

module.exports = middleware;
