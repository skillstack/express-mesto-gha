const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/router');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const { createUser, login } = require('./controllers/users');
const { createUserValidation, loginValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(auth);
app.use(router);
app.use(errors());
app.use(handleError);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
