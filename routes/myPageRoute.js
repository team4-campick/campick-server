const express = require('express');
const router = express.Router();
const myPageController = require('../controller/myPageController');

router.get('/get-user/:id', myPageController.getUser);

router.post('/inquiry', myPageController.updateInquiry);
router.delete('/delete-user/:id', myPageController.deleteUser);

router.post('/duplicateCheck', myPageController.duplicateCheck);
router.post('/passwordCheck/:id', myPageController.passwordCheck);
router.post('/editInfo/:id', myPageController.updateUser);

router.get('/bingo-area/:id', myPageController.getBingo);
router.get('/bingo-count/:id', myPageController.getBingoCount);
router.get('/bingo-pattern/:id', myPageController.getBingoPattern);
router.post('/update-mission/:id', myPageController.updateMission);
router.post('/reset-bingo/:id', myPageController.bingoStatusReset);

module.exports = router;
