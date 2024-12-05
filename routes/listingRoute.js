const { createListing } = require("../controllers/listingsController");
const { verify, protected } = require("../services/jwt/jwtServices");
const router = require("express").Router();
const { upload } = require("../utils/multer");


router.post("/create", verify, upload.array('media'), protected, createListing);

module.exports = router;