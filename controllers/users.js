const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');
const NotFoundError = require('../utils/errors/NotFoundError');
const { HTTP_STATUS_CREATED } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  userSchema.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getLoginUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при запросе пользователя'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Пользователь по указанному id: ${req.user._id} не найден`));
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  userSchema.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при запросе пользователя'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Пользователь по указанному id: ${userId} не найден`));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const userData = user.toObject({ useProjection: true });
          res.status(HTTP_STATUS_CREATED)
            .send(userData);
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с указанным e-mail уже существует'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  userSchema.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Пользователь по указанному id: ${req.user._id} не найден`));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userSchema.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Пользователь по указанному id: ${req.user._id} не найден`));
      }
      return next(err);
    });
};
