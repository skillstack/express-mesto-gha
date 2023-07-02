const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

const {
  cardIdValidation,
  createCardValidation,
} = require('../middlewares/validation');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCardValidation, createCard);
cardsRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardsRouter.put('/:cardId/likes', cardIdValidation, addCardLike);
cardsRouter.delete('/:cardId/likes', cardIdValidation, deleteCardLike);

module.exports = cardsRouter;
