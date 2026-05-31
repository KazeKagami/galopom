const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attraction.controller');

router.get('/', attractionController.getAttractions);
router.post('/filter', attractionController.getAttractions);

router.get('/city/:city', attractionController.getAttractions);
router.get('/year/:year', attractionController.getAttractions);
router.get('/kind/:kind', attractionController.getAttractions)

router.get('/:m_id', attractionController.getAttractionById);

router.post('/', attractionController.createAttraction);

/*// PUT /api/attractions/:id - обновить
router.put('/m/:m_id', attractionController.updateAttraction);

// DELETE /api/attractions/:id - удалить
router.delete('/m/:m_id', attractionController.deleteAttraction);*/

module.exports = router;