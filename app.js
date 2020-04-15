/* eslint-disable linebreak-style */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const defaultRoute = require('./routes/default_route');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());
/*
app.use(bodyParser.urlencoded({
  extended: true
}));
*/
const writeStream = fs.createWriteStream(path.join(__dirname, './logs/requests.log'),
  { flags: 'a', encoding: 'utf8' });
const logFormat = ':method\t:url\t:status\t:response-time';
app.use(morgan(logFormat, {
  stream: {
    write(msg) {
      const finalIndex = msg.length - 1;
      const lstTabIndex = msg.lastIndexOf('\t');
      const str = msg.substring(lstTabIndex + 1, finalIndex);
      const timeInt = Math.ceil(parseFloat(str));
      const timeStr = timeInt < 10 ? `0${timeInt.toString()}` : timeInt.toString();
      const outMsg = `${msg.substring(0, lstTabIndex + 1)}${timeStr}ms\n`;
      writeStream.write(outMsg);
    },
  },
}));

// app.use(morgan(':method :url :status :response-time ms'));
/* app.use(morgan('common', {
   stream: fs.createWriteStream(path.join(__dirname, './logs/requests.log'),
   {flags: 'a', encoding: 'utf8'}),
})); */
app.use('/api/v1/on-covid-19', defaultRoute);

module.exports = app;
