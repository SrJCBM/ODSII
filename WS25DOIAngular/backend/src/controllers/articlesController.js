const plosService = require('../services/plosService');
const CONSTANTS = require('../config/constants');

/**
 * Controller for articles endpoints
 */
class ArticlesController {
  /**
   * Search articles endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchArticles(req, res) {
    try {
      const { q, page = 1, pageSize = CONSTANTS.DEFAULT_PAGE_SIZE } = req.query;
      
      const pageNumber = parseInt(page, 10);
      const pageSizeNumber = Math.min(parseInt(pageSize, 10), CONSTANTS.MAX_PAGE_SIZE);

      if (pageNumber < 1 || pageSizeNumber < 1) {
        return res.status(400).json({
          error: 'Invalid pagination parameters. Page and pageSize must be positive numbers.'
        });
      }

      const result = await plosService.searchArticles(q, pageNumber, pageSizeNumber);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error searching articles:', error.message);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to search articles'
      });
    }
  }

  /**
   * Health check endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  healthCheck(req, res) {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'PLOS API Backend'
    });
  }
}

module.exports = new ArticlesController();
