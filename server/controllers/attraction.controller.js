const attractionService = require('../services/attraction.service');

const getAttractions = async (req, res, next) => {
    try {
        const options = {
            sort: req.query.sort,
            order: req.query.order,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined,
            filter: {}
        };
        
        if (req.body && Object.keys(req.body).length > 0) {
            options.filter = buildFilterFromBody(req.body);
        } 
        else if (req.params.city) {
            options.filter.city = req.params.city;
        }
        else if (req.params.year) {
            options.filter.year_arise = parseInt(req.params.year);
        }
        else if (req.params.kind) {
            options.filter.kind = req.params.kind;
        }
        else {
            options.filter = buildFilterFromQuery(req.query);
        }

        const data = await attractionService.getAllAttractions(options);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// Вспомогательная функция: фильтры из body (для POST /filter)
const buildFilterFromBody = (filters) => {
    const filterQuery = {};
    
    if (filters.kinds?.length > 0) {
        filterQuery.kind = { $in: filters.kinds };
    }
    if (filters.cities?.length > 0) {
        filterQuery.city = { $in: filters.cities };
    }
    if (filters.countries?.length > 0) {
        filterQuery.country = { $in: filters.countries };
    }
    if (filters.architects?.length > 0) {
        filterQuery.architect = { $in: filters.architects };
    }
    if (filters.sculptors?.length > 0) {
        filterQuery.sculptor = { $in: filters.sculptors };
    }
    if (filters.ideaAuthors?.length > 0) {
        filterQuery.idea_author = { $in: filters.ideaAuthors };
    }
    
    return filterQuery;
};

// Вспомогательная функция: фильтры из query параметров (для GET /)
const buildFilterFromQuery = (query) => {
    const filterQuery = {};
    
    if (query.kinds) {
        filterQuery.kind = { $in: query.kinds.split(',') };
    }
    if (query.cities) {
        filterQuery.city = { $in: query.cities.split(',') };
    }
    if (query.countries) {
        filterQuery.country = { $in: query.countries.split(',') };
    }
    if (query.architects) {
        filterQuery.architect = { $in: query.architects.split(',') };
    }
    if (query.sculptors) {
        filterQuery.sculptor = { $in: query.sculptors.split(',') };
    }
    if (query.ideaAuthors) {
        filterQuery.idea_author = { $in: query.ideaAuthors.split(',') };
    }
    
    return filterQuery;
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
    getAttractions,
    getAttractionById,
    createAttraction
};