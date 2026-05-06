const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attraction.controller');

// GET /api/attractions - все достопримечательности
router.get('/', attractionController.getAllAttractions);

// GET /api/attractions/:id - одна по ID
router.get('/:m_id', attractionController.getAttractionById);

/*// GET /api/attractions/year/:year - по году
router.get('/year/:year', attractionController.getAttractionsByYear);

// GET /api/attractions/city/:city - по городу
router.get('/city/:city', attractionController.getAttractionsByCity);*/

// POST /api/attractions - создать
router.post('/', attractionController.createAttraction);

/*// PUT /api/attractions/:id - обновить
router.put('/m/:m_id', attractionController.updateAttraction);

// DELETE /api/attractions/:id - удалить
router.delete('/m/:m_id', attractionController.deleteAttraction);*/

module.exports = router;