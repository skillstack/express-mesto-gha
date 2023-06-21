const cardSchema = require('../models/card');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardSchema.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при удалении карточки' });
        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка с указанным id: ${cardId} не найдена` });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.addCardLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при установке лайка' });
        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка с указанным id: ${req.params.cardId} не найдена` });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.deleteCardLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при удалении лайка' });
        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка с указанным id: ${req.params.cardId} не найдена` });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
