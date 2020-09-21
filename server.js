const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./src/configs/connection');
const cors = require('cors');
const app = express();
const port = 8001;
const routerNav = require('./src/index');
app.use(express.static('public'));

app.use(cors());
app.use('/', routerNav);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});

app.get('*', (request, response) => {
  response.sendStatus(404);
});

module.exports = app;
