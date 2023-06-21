const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = { _id: '64901844bacac5d5b75a1407' };
  next();
});

app.use(express.json());
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
