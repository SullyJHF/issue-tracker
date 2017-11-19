import express from 'express';
import path from 'path';

import 'babel-polyfill';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config.js';

import bodyParser from 'body-parser';

import routers from './routers';

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
