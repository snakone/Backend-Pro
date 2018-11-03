const express = require('express');
const app = express();
const morgan = require('morgan');  // Console Logger
const { moongose } = require('./db/database');  // Only need the Connection

// Settings
app.set('port', process.env.PORT || 3000);  // S.O Port or Port 3000

// Middlewares
app.use(morgan('dev'));  // Use Morgan with DEV command prompt

// Routes
app.get('/', (req, res)=> {
  res.status(200).json({
    ok: true,
    message: 'Everything OK'
  })
})

// Listen
app.listen(app.get('port'), ()=>{
  console.log('Node/Express: \x1b[36m%s\x1b[0m', 'ONLINE');
})
