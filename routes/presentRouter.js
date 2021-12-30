const express = require('express');
const presentController = require('../controllers/presentController.js');

const presentRouter = express.Router();

presentRouter
    .get('/', presentController.getAll)
    .get('/:id', presentController.getOne)
    .post('/', presentController.insertOne)
    .patch('/:id', presentController.updateOne)
    .delete('/:id', presentController.deleteOne)

module.exports = {
    presentRouter,
}