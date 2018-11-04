const mainRouter = require('express').Router();  // Express Router

mainRouter.get('/', async (req, res)=> {
  res.status(200).json({
    ok: true,
    message: 'Everything OK'
  })
});

module.exports = mainRouter;  // Export router - Export Class on TypeScript
