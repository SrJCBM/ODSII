const axios = require('axios');
const CONSTANTS = require('../config/constants');

/**
 * Service to interact with PLOS API
 */
class PlosService {
  /**
   * Search articles in PLOS API
   * @param {string} query - Search query
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Number of results per page
   * @returns {Promise<Object>} Search results with articles and pagination info
   */
  async searchArticles(query = CONSTANTS.DEFAULT_QUERY, page = 1, pageSize = CONSTANTS.DEFAULT_PAGE_SIZE) {
    try {
      const start = (page - 1) * pageSize;
      const sanitizedQuery = this._sanitizeQuery(query);
      
      const response = await axios.get(CONSTANTS.PLOS_API_BASE_URL, {
        params: {
          q: sanitizedQuery,
          start: start,
          rows: pageSize,
          fl: 'id,title,journal,publication_date,author',
          wt: 'json'
        }
      });

      const responseData = response.data.response;
      const articles = this._mapArticles(responseData.docs);
      const totalResults = responseData.numFound;

      return {
        articles,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalResults: totalResults,
          totalPages: Math.ceil(totalResults / pageSize)
        }
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Sanitize and validate search query
   * @param {string} query - Raw query string
   * @returns {string} Sanitized query
   */
  _sanitizeQuery(query) {
    if (!query || query.trim() === '') {
      return CONSTANTS.DEFAULT_QUERY;
    }
    
    // If query doesn't contain field operators, search in title
    if (!query.includes(':')) {
      return `title:${query.trim()}`;
    }
    
    return query.trim();
  }

  /**
   * Map PLOS API articles to application format
   * @param {Array} docs - Raw documents from PLOS API
   * @returns {Array} Mapped articles
   */
  _mapArticles(docs) {
    return docs.map(doc => ({
      doi: doc.id || 'N/A',
      title: doc.title || 'Untitled',
      journal: doc.journal || 'Unknown Journal',
      publicationDate: this._formatDate(doc.publication_date),
      authors: doc.author || []
    }));
  }

  /**
   * Format publication date
   * @param {string} dateString - Date string from API
   * @returns {string} Formatted date
   */
  _formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  _handleError(error) {
    if (error.response) {
      return new Error(`PLOS API Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      return new Error('No response from PLOS API. Please check your connection.');
    } else {
      return new Error(`Request Error: ${error.message}`);
    }
  }
}

module.exports = new PlosService();
