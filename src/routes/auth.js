/* eslint-disable no-param-reassign */
const express = require('express');
const userController = require('../controllers/usersController');

function routes(User) {
  const userRouter = express.Router();
  const controller = userController(User);

  userRouter.route('/users/register')
    .post(controller.saveUser);

  return userRouter;
}

module.exports = routes;