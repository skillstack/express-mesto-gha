const userSchema = require('../models/user');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  userSchema.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  userSchema.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при запросе пользователя' });
        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Пользователь по указанному id: ${userId} не найден` });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userSchema.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  userSchema.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {

      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Пользователь по указанному id: ${req.user._id} не найден` });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  userSchema.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {

      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Пользователь по указанному id: ${req.user._id} не найден` });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
