const cardsRouter = require('express').Router();
const { getCards, createCard, deleteCard, addCardLike, deleteCardLike } = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', addCardLike);
cardsRouter.delete('/:cardId/likes', deleteCardLike);

module.exports = cardsRouter;
