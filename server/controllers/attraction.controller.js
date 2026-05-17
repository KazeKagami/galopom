const attractionService = require('../services/attraction.service');

// Получить все
const getAllAttractions = async (req, res, next) => {
    try {
        const options = {
            sort: req.query.sort,
            order: req.query.order,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined
        };

        const data = await attractionService.getAllAttractions(options);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// НОВЫЙ МЕТОД: фильтрация по множеству параметров
const filterAttractions = async (req, res, next) => {
    try {
        const filters = req.body; // Получаем фильтры из тела запроса
        const options = {
            sort: req.query.sort,
            order: req.query.order,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined
        };

        // Строим объект фильтрации для MongoDB
        const filterQuery = {};

        // Фильтр по типам (kinds) - множественный выбор
        if (filters.kinds && filters.kinds.length > 0) {
            // Ищем документы, у которых kind совпадает с любым из выбранных
            filterQuery.kind = { $in: filters.kinds };
        }

        // Фильтр по городам - множественный выбор
        if (filters.cities && filters.cities.length > 0) {
            filterQuery.city = { $in: filters.cities };
        }

        // Фильтр по странам - множественный выбор
        if (filters.countries && filters.countries.length > 0) {
            filterQuery.country = { $in: filters.countries };
        }

        // Фильтр по архитекторам - множественный выбор
        if (filters.architects && filters.architects.length > 0) {
            filterQuery.architect = { $in: filters.architects };
        }

        // Фильтр по скульпторам - множественный выбор
        if (filters.sculptors && filters.sculptors.length > 0) {
            filterQuery.sculptor = { $in: filters.sculptors };
        }

        // Фильтр по авторам идей - множественный выбор
        if (filters.ideaAuthors && filters.ideaAuthors.length > 0) {
            filterQuery.idea_author = { $in: filters.ideaAuthors };
        }

        console.log('Filter query:', filterQuery);

        options.filter = filterQuery;
        const data = await attractionService.getAllAttractions(options);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getAttractionsByCity = async (req, res, next) => {
    try {
        const city = req.params.city;

        const options = {
            filter: { city: city },
            sort: req.query.sort,
            order: req.query.order,
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
            filter: { year_arise: year },
            sort: req.query.sort,
            order: req.query.order,
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

        const options = {
            filter: { kind: kind },
            sort: req.query.sort,
            order: req.query.order,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined
        };

        const data = await attractionService.getAllAttractions(options);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getAttractionById = async (req, res, next) => {
    try {
        const m_id = parseInt(req.params.m_id);
        const data = await attractionService.getAttractionById(m_id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

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
    filterAttractions, // НОВЫЙ ЭКСПОРТ
    getAttractionById,
    getAttractionsByCity,
    getAttractionsByYear,
    getAttractionsByKind,
    createAttraction
};