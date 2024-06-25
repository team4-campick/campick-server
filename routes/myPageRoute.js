const express = require('express');
const router = express.Router();
const myPageController = require('../controller/myPageController');
// const bookController = require('../controllers/bookController');

router.get('/get-user/:id', myPageController.getUser);

router.post('/inquiry', myPageController.updateInquiry);
router.delete('/delete-user/:id', myPageController.deleteUser);

router.post('/duplicateCheck', myPageController.duplicateCheck);
router.post('/passwordCheck/:id', myPageController.passwordCheck);
router.post('/editInfo/:id', myPageController.updateUser);

router.get('/get-bingo/:id', myPageController.bingoStatusCheck);
router.post('/update-mission/:id', myPageController.updateMission);

// router.get('/', bookController.getAllBooks);
// router.post('/', bookController.createBook);
// router.get('/:id', bookController.getBookById);
// router.put('/:id', bookController.updateBook);
// router.delete('/:id', bookController.deleteBook);

module.exports = router;
