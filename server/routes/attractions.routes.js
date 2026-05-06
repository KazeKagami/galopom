const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attraction.controller');

// GET /api/attractions - все достопримечательности
router.get('/', attractionController.getAllAttractions);

// GET /api/attractions/city/:city - по городу
router.get('/city/:city', attractionController.getAttractionsByCity);

// GET /api/attractions/year/:year - по году
router.get('/year/:year', attractionController.getAttractionsByYear);

router.get('/kind/:kind', attractionController.getAttractionsByKind)

// GET /api/attractions/:id - одна по ID
router.get('/:m_id', attractionController.getAttractionById);

// POST /api/attractions - создать
router.post('/', attractionController.createAttraction);

/*// PUT /api/attractions/:id - обновить
router.put('/m/:m_id', attractionController.updateAttraction);

// DELETE /api/attractions/:id - удалить
router.delete('/m/:m_id', attractionController.deleteAttraction);*/

module.exports = router;