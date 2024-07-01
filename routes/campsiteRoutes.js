const express = require("express");
const router = express.Router();
const campsiteController = require("../controllers/campsitesController");

router.get("/get-sites", campsiteController.getSites);
