const searchRouter = require('express').Router();  // Express Router
const SEARCH = require('../controllers/search');  // User Controller

searchRouter.get('/search/all/:value', SEARCH.searchValue);
searchRouter.get('/search/data/:collection/:value', SEARCH.searchData);

module.exports = searchRouter;  // Export router - Export Class on TypeScript
