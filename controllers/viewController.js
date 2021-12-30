const {ChildRecord} = require('../recrods/ChildRecord.js');
const {PresentRecord} = require('../recrods/PresentRecord.js');
const {MyError} = require("../utils/errors");
const catchAsync = require('../utils/catchAsync.js');

exports.homeView = (req, res) => {
    res.render('home.hbs');
};

exports.presentsView = catchAsync(async (req, res) => {
    const presents = await PresentRecord.getAll();
    let available = [];
    for await (const el of presents) {
        const result = await el.getAvailable();
        available.push(result);
    }
    res.render('present_list.hbs', {presents, available});
});

exports.childrenView = catchAsync(async (req, res) => {
    const children = await ChildRecord.getAll();

    for await (const el of children) {
        await el._checkPresentAvailability()
    }

    const presents = await PresentRecord.getAll();
    let available = [];
    for await (const el of presents) {
        const result = await el.getAvailable();
        available.push(result);
    }
    res.render('children_list.hbs', {children, presents, available})
});