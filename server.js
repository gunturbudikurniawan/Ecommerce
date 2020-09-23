const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8001;
const routerNav = require('./src/index');
const bodyParser = require('body-parser');
app.use(express.static('public'));

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routerNav);
app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});

app.get('*', (request, response) => {
  response.sendStatus(404);
});

module.exports = app;
