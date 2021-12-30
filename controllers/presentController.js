const {PresentRecord} = require('../recrods/PresentRecord');
const {ChildRecord} = require('../recrods/ChildRecord');
const catchAsync = require('../utils/catchAsync.js');

exports.getAll = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: await PresentRecord.getAll()
    });
})

exports.getOne = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: await PresentRecord.getOneById(req.params.id)
    });
})
exports.insertOne = catchAsync(async (req, res) => {
    const newRecord = new PresentRecord({
        name: req.body.name,
        amount: req.body.amount,
    });
    res.status(201).json({
        status: 'success',
        data: await newRecord.insert()
    })
})

exports.updateOne = catchAsync(async (req, res) => {
    const record = await PresentRecord.getOneById(req.params.id);
    record.name = req.body.name ?? record.name;
    record.amount = req.body.address ?? record.amount;
    const updated = await record.saveMe();
    res.status(200).json({
        status: 'success',
        data: updated,
    })
})

exports.deleteOne = catchAsync(async (req, res) => {
    const presentChildList = await ChildRecord.presentChildList(req.params.id);
    for await(const el of presentChildList) {
        el.present = '';
        await el.saveMe();
    }
    const record = await PresentRecord.getOneById(req.params.id);
    await record.deleteMe();
    res.status(202).json({
        status: 'success',
    })
})