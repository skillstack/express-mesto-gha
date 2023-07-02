const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  getLoginUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const {
  getUserByIdValidation,
  updateUserValidation,
  updateUserAvatarValidation,
} = require('../middlewares/validation');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getLoginUser);
usersRouter.get('/:userId', getUserByIdValidation, getUserById);
usersRouter.patch('/me', updateUserValidation, updateUser);
usersRouter.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = usersRouter;
