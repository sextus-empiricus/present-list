const express = require('express');
const {homeView, childrenView, presentsView} = require('../controllers/viewController.js');

const viewRouter = express.Router();

viewRouter
    .get('/', homeView)
    .get('/children', childrenView)
    .get('/presents', presentsView)

module.exports = {
    viewRouter,
}