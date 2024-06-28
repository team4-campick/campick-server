const { Router } = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controller/messageController.js");

import protectRoute from "../middleware/protectRoute.js";

const router = Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
