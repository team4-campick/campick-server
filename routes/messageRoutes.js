const { Router } = require("express");
const {
  getConversations,
  getMessages,
  sendMessage,
} = require("../controller/messageController.js");

const { checkAuth } = require("../middleware/checkAuth.js");

const router = Router();

router.get("/", checkAuth, getConversations);
router.get("/:id", checkAuth, getMessages);
router.post("/send/:id", checkAuth, sendMessage);

module.exports = router;
