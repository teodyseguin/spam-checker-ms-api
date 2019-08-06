'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const app = express();
const env = process.env.NODE_ENV;
const config = require('./config.json');

// Routers.
const versionRouter = require('./routers/version');
const analyzeRouter = require('./routers/analyze');

// Local port.
const port = config[env].port;

// Initialize the app.
const server = app.listen(port, () => {
  const port = server.address().port;

  console.log(`Environment: ${env} server`);
  console.log(`Port: ${port}`);
});

app.use(bodyParser.json());

// https://stackoverflow.com/a/39407519
app.set('etag', false);
app.use((req, res, next) => {
  req.headers['if-none-match'] = '';
  req.headers['if-modified-since'] = '';
  // https://stackoverflow.com/a/40277517
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

// Expose the available routers.
app.use('/v1/api/version', versionRouter);
app.use('/v1/api/analyze', analyzeRouter);
