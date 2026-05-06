// routes/filterOp.js
const express = require('express');
const router = express.Router();
const sortingFeaturesControllers = require("../controllers/filters.controller");

router.get('/types', sortingFeaturesControllers.types);
router.get('/cities', sortingFeaturesControllers.cities);
router.get('/countries', sortingFeaturesControllers.countries);
router.get('/architects', sortingFeaturesControllers.architects);
router.get('/sculptors', sortingFeaturesControllers.sculptors);
router.get('/ideaAuthors', sortingFeaturesControllers.ideaAuthors);

module.exports = router;