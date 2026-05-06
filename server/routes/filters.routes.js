// routes/filterOp.js
const express = require('express');
const router = express.Router();
const sortingFeaturesControllers = require("../controllers/filters.controller");

router.get('/kinds', sortingFeaturesControllers.kinds);
router.get('/cities', sortingFeaturesControllers.cities);
router.get('/countries', sortingFeaturesControllers.countries);
router.get('/architects', sortingFeaturesControllers.architects);
router.get('/sculptors', sortingFeaturesControllers.sculptors);
router.get('/ideaAuthors', sortingFeaturesControllers.ideaAuthors);

module.exports = router;