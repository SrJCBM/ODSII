const express = require('express');
const articlesController = require('../controllers/articlesController');

const router = express.Router();

/**
 * GET /api/articles/search
 * Search articles with pagination
 * Query params: q (query), page (page number), pageSize (results per page)
 */
router.get('/search', (req, res) => articlesController.searchArticles(req, res));

module.exports = router;
