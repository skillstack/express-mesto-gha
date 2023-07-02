const cardSchema = require('../models/card');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const { HTTP_STATUS_CREATED } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const user = req.user._id;

  cardSchema.findById(cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();

      if (owner !== user) {
        return next(new ForbiddenError('В удалении отказано, вы не являетесь автором карточки'));
      }
      return cardSchema.deleteOne(card)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Карточка с указанным id: ${cardId} не найдена`));
      }
      return next(err);
    });
};

module.exports.addCardLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при установке лайка'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Карточка с указанным id: ${req.params.cardId} не найдена`));
      }
      return next(err);
    });
};

module.exports.deleteCardLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении лайка'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`Карточка с указанным id: ${req.params.cardId} не найдена`));
      }
      return next(err);
    });
};
