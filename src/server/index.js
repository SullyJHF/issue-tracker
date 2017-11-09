import express from 'express';
import path from 'path';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config.js';

let app = express();
const port = process.env.PORT || 3000

let compiler = webpack(webpackConfig);
if (process.env.NODE_ENV === 'development') {
  app.use(webpackMiddleware(compiler, {
    stats: {colors: true},
    publicPath: webpackConfig.output.publicPath
  }));
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
  res.json({test: 'succeeded'});
});


app.listen(port, (err) => {
  console.log(`Listening on port ${port}`);
});
