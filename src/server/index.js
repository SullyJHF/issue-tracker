import express from 'express';
import path from 'path';

import crypto from 'crypto';

import 'babel-polyfill';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config.js';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import routers from './routers';

import config from './config';
import { updateConfig } from './config';


if (process.env.NODE_ENV === 'production') {
  let configuration = config();
  configuration.secret = crypto.randomBytes(20).toString('hex');

  console.log(configuration);

  (async () => await updateConfig(configuration))();
}


let app = express();
const port = process.env.PORT || 3000

let compiler = webpack(webpackConfig);
if (process.env.NODE_ENV === 'development') {
  app.use(webpackMiddleware(compiler, {
    stats: {colors: true},
    publicPath: webpackConfig.output.publicPath
  }));
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));



app.use('/', routers);

app.all('*', (req, res) => {
  res.redirect('/404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.redirect('/500');
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
}).on('error', (err) => {
  console.error(err);
});
