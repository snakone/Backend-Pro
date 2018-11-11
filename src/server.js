const express = require('express');
const app = express();
const cors = require('cors'); //  Bind Server and Angular
const morgan = require('morgan');  // Console Logger
const { moongose } = require('./db/database');  // Only need the Connection

const mainRouter = require('./routes/main');  // Require Main Routes
const searchRouter = require('./routes/search');  // Require User Routes
const loginRouter = require('./routes/login');  // Require Login Routes
const userRouter = require('./routes/user');  // Require User Routes
const hospitalRouter = require('./routes/hospital');  // Require HOSPITAL Routes
const doctorRouter = require('./routes/doctor');  // Require Doctor Routes
const uploadRouter = require('./routes/upload');  // Require Upload Routes
const imageRouter = require('./routes/images');  // Require Images Routes

const fileUpload = require ('express-fileupload');

app.use(fileUpload());  // Use FileUpload

// Settings
app.set('port', process.env.PORT || 3000);  // S.O Port or Port 3000

// Middlewares
app.use(morgan('dev'));  // Use Morgan with DEV command prompt
app.use(express.urlencoded({extended: false}));  // Body Parse
app.use(express.json());  // Body Parse to JSON
app.use(cors({origin: "http://localhost:4200"}));  // Use Cors to connect Angular

// Routes
app.use('/', loginRouter);  // Login Route
app.use('/', searchRouter);  // Search Route
app.use('/', userRouter);  // User Route
app.use('/', hospitalRouter);  // Hospital Route
app.use('/', doctorRouter);  // Doctor Route
app.use('/', uploadRouter);  // Upload Files Route
app.use('/', imageRouter);  // Images Route

app.use('/', mainRouter);  // Main Route -> Last Route

// Listen
app.listen(app.get('port'), ()=>{
  console.log('Node/Express: \x1b[36m%s\x1b[0m', 'ONLINE');
})
