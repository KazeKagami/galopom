const attractionService = require('../services/attraction.service');

// Получить все
const getAllAttractions = async (req, res, next) => {
    try {
        const data = await attractionService.getAllAttractions();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// Получить по id
const getAttractionById = async (req, res, next) => {
    try {
        const m_id = parseInt(req.params.m_id);
        const data = await attractionService.getAttractionById(m_id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// Создать
const createAttraction = async (req, res, next) => {
    try {
        const data = await attractionService.createAttraction(req.body);

        res.status(201).json({
            success: true,
            message: `Создано с m_id: ${data.m_id}`,
            data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAttractions,
    getAttractionById,
    createAttraction
};