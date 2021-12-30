const {MyError} = require('../utils/errors.js');
const {pool} = require("../db/db.js");
const {v4: uuid} = require('uuid');

class PresentRecord {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.amount = obj.amount;
        this._validate();
    }

    _validate() {
        if (!this.name || !this.amount) throw new MyError('All information about a present are required.');
        if (this.name.length < 3 || this.name.length > 30) throw new MyError('The character range for the "name" field is: 3-30.');
        if (this.amount < 0 || this.amount > 99) throw new MyError('The amount range is between 0 and 99.');
    }

    async insert() {
        this.id = this.id ?? uuid();
        await pool.execute('INSERT INTO `presents` VALUES(:id, :name, :amount)', {
            id: this.id,
            name: this.name,
            amount: this.amount,
        })
        return this.id;
    }

    async saveMe() {
        const [{affectedRows}] = await pool.execute('UPDATE `presents` SET `presents`.`name` = :name, `presents`.`amount` = :amount WHERE `presents`.`id` = :id', {
            id: this.id,
            name: this.name,
            amount: this.amount,
        })
        return affectedRows;
    }

    async deleteMe() {
        await pool.execute('DELETE FROM `presents` WHERE `presents`.`id` = :id', {
            id: this.id
        })
    }

    async getAvailable() {
        const [response] = await pool.execute('SELECT COUNT(*) FROM `children` WHERE `children`.`present` = :id ORDER BY `children`.`name` ASC', {
            id: this.id
        });
        const unavailable = (Object.values(response[0]))[0];
        return this.amount - unavailable;
    }

    //  static methods:
    static async getAll() {
        return (await pool.execute('SELECT * FROM `presents` WHERE 1'))[0].map(el => new PresentRecord(el));
    }

    static async getOneById(id) {
        const [result] = await pool.execute('SELECT * FROM `presents` WHERE `presents`.`id` = :id', {
            id
        })
        return new PresentRecord(result[0]);
    }

    static async deleteOneById(id) {
        await pool.execute('DELETE FROM `presents` WHERE `presents`.`id` = :id', {
            id
        })
    }
}

module.exports = {
    PresentRecord
}