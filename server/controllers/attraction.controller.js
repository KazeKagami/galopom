const attractionService = require('../services/attraction.service');

// Получить все
const getAllAttractions = async (req, res, next) => {
    try {
        const options = {
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined
        };

        const data = await attractionService.getAllAttractions(options);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getAttractionsByCity = async (req, res, next) => {
    try {
        const city = req.params.city;

        // Извлекаем параметры сортировки
        const options = {
            filter: { city: city },  // Фильтр по городу
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined
        };

        const data = await attractionService.getAllAttractions(options);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getAttractionsByYear = async (req, res, next) => {
    try {
        const year = parseInt(req.params.year);

        const options = {
            filter: { year: year },  // Фильтр по году
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined
        };

        const data = await attractionService.getAllAttractions(options);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getAttractionsByKind = async (req, res, next) => {
    try {
        const kind = req.params.kind;

        // Экранируем спецсимволы в kind (на случай если в названии есть . * + и т.д.)
        const escapedKind = kind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const options = {
            filter: {
                kind: { $regex: new RegExp(`(^|;)${escapedKind}(;|$)`, 'i') }
            },
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined
        };

        const data = await attractionService.getAllAttractions(options);

        // Если ничего не найдено - возвращаем пустой массив, а не ошибку
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
    getAttractionsByCity,
    getAttractionsByYear,
    getAttractionsByKind,
    createAttraction
};