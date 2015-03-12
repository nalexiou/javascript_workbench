#!/usr/bin/env node --harmony
'use strict';
const
  express = require('express'),
  session = require('express-session'),
  redisClient = require('redis').createClient(),
  RedisStore = require('connect-redis')(session),
  app = express();
app.use(express.cookieParser());
app.use(session({
  secret: 'unguessable',
  saveUninitialized: true,
  resave: true,
  store: new RedisStore({
    client: redisClient
  })
}));
app.get('/api/:name', function(req, res) {
  res.json(200, { "hello": req.params.name });
});
app.listen(3000, function(){
  console.log("ready captain.");
});
