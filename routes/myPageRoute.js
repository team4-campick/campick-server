const express = require('express');
const router = express.Router();
const myPageController = require('../controller/myPageController');

router.get('/get-user/:id', myPageController.getUser);

router.post('/inquiry', myPageController.updateInquiry);
router.delete('/delete-user/:id', myPageController.deleteUser);

router.post('/duplicateCheck', myPageController.duplicateCheck);
router.post('/passwordCheck/:id', myPageController.passwordCheck);
router.post('/editInfo/:id', myPageController.updateUser);

// router.get('/get-bingo/:id', myPageController.getBingo);
router.post('/bingo-count/:id', myPageController.getBingoCount);
router.post('/update-mission/:id', myPageController.updateMission);

module.exports = router;
