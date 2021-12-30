const express = require('express');
const childrenController = require('../controllers/childrenController.js');

const childrenRouter = express.Router();

childrenRouter
    .get('/', childrenController.getAll)
    .get('/:id', childrenController.getOne)
    .post('/', childrenController.insertOne)
    .patch('/:id', childrenController.updateOne)
    .delete('/:id', childrenController.deleteOne)

module.exports = {
    childrenRouter,
}