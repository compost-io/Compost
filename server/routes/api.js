const express = require('express');

const mainController = require('../controllers/mainController.js');
const postController = require('../controllers/postController.js');
const deleteController = require('../controllers/deleteController.js');

const router = express.Router();

//route all get requests to /api/:id here
router.get(
  '/:id',
  mainController.getPageUnique,
  mainController.getList,
  mainController.getUsers,
  (req, res) => {
    const response = {
      information: res.locals.info,
      list: res.locals.list,
      users: res.locals.users,
    };
    res.status(200).json(response);
  },
);

//route post requests to /api/items/ here
router.post(
  '/items',
  postController.getPageUnique,
  postController.postUpdate,
  postController.postNew,
  (req, res) => res.json('success'),
);

//route delete requests to /api/users/ here
router.delete('/items', deleteController.deleteItem, (req, res) =>
  res.status(200).json('success'),
);

//route post requests to /api/pages/ here
router.post('/pages', postController.postNewPage, (req, res) =>
  res.status(200).json(res.locals.locationID),
);

//route post requests to /api/users/ here
router.post('/users', postController.getPageUnique, postController.postNewUser, (req, res) =>
  res.status(200).json('success'),
);

//route delete requests to /api/users/ here
//this will actually inactivate users, not delete
router.delete('/users', deleteController.deleteUser, (req, res) =>
  res.status(200).json('success'),
);

module.exports = router;
