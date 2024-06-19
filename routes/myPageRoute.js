const express = require('express');
const router = express.Router();
const myPageController = require('../controller/myPageController');
// const bookController = require('../controllers/bookController');

router.post('/inquiry', myPageController.updateInquiry);
router.post('/delete-user', myPageController.deleteUser);

// router.get('/', bookController.getAllBooks);
// router.post('/', bookController.createBook);
// router.get('/:id', bookController.getBookById);
// router.put('/:id', bookController.updateBook);
// router.delete('/:id', bookController.deleteBook);

module.exports = router;
