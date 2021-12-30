//  modules:
const {join} = require('path');
const express = require('express');
const {engine} = require('express-handlebars');
const {viewRouter} = require('./routes/viewsRouter');
const {hbsHelpers} = require('./utils/hbsHelpers');
const {globalErrorHandler} = require('./utils/errors.js');
const {childrenRouter} = require('./routes/childrenRouter');
const {presentRouter} = require('./routes/presentRouter.js');

//  constants:
const port = process.env.PORT || 3000;

//  configuration:
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: hbsHelpers
}));
app.set('view engine', '.hbs');
app.set('views', './public/views');

//  api:
app.use('/api/v1/children', childrenRouter);
app.use('/api/v1/presents', presentRouter);

//  routes:
app.use('/', viewRouter);

//  global error handler:
app.use(globalErrorHandler);

//  server:
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on ${port}...`)
})