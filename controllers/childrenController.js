const {ChildRecord} = require('../recrods/ChildRecord.js');
const catchAsync = require('../utils/catchAsync.js');
const {MyError} = require('../utils/errors.js');

exports.getAll = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: await ChildRecord.getAll()
    });
})
exports.getOne = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: await ChildRecord.getOneById(req.params.id)
    });
})
exports.insertOne = catchAsync(async (req, res) => {
    const newRecord = new ChildRecord({
        name: req.body.name,
        address: req.body.address,
        present: req.body.present,
    });
    if (await newRecord._checkPresentAvailability() <= 0) throw new MyError('All gifts of this type have been assigned to some child. Please chose another one.');
    res.status(201).json({
        status: 'success',
        data: await newRecord.insert()
    })
})
exports.updateOne = catchAsync(async (req, res) => {
    const record = await ChildRecord.getOneById(req.params.id);
    record.name = req.body.name ?? record.name;
    record.address = req.body.address ?? record.address;
    record.present = req.body.present ?? record.present;
    if (await record._checkPresentAvailability() <= 0) throw new MyError('All gifts of this type have been assigned to some child. Please chose another one.'); // it should work like "insertOne" throwNewErr but becouse of what front doesn't chatch this err;
    res.status(200).json({
        status: 'success',
        data: await record.saveMe(),
    })
})
exports.deleteOne = catchAsync(async (req, res) => {
    const record = await ChildRecord.getOneById(req.params.id);
    await record.deleteMe();
    res.status(202).json({
        status: 'success',
    })
})