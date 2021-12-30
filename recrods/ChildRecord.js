const {MyError} = require('../utils/errors.js');
const {pool} = require('../db/db.js');
const {v4: uuid} = require('uuid');
const {PresentRecord} = require('./PresentRecord');

class ChildRecord {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.address = obj.address;
        this.present = obj.present;
        this._validate();
    }

    _validate() {
        if (!this.name || !this.address) throw new MyError('All information about a child are required.');
        if (this.name.length < 3 || this.name.length > 20) throw new MyError('The character range for the "name" field is: 3-20.');
        if (this.address.length < 3 || this.address.length > 60) throw new MyError('The character range for the "address" field is: 3-20.');
    }

    async _checkPresentAvailability() {
        try {
            if (this.present) {
                const present = await PresentRecord.getOneById(this.present);
                const availability = await present.getAvailable();
                if (availability < 0) throw new MyError('All gifts of this nature have been assigned to some child. Please chose another one.');
                return availability;
            }
        } catch (err) {
            throw err
        }
    }

    async insert() {
        this._validate();
        this.id = this.id ?? uuid();
        await pool.execute('INSERT INTO `children` VALUES(:id, :name, :address, :present)', {
            id: this.id,
            name: this.name,
            address: this.address,
            present: this.present ?? null
        })
        return this.id;
    }

    async saveMe() {
        const [{affectedRows}] = await pool.execute('UPDATE `children` SET `children`.`name` = :name, `children`.`address` = :address, `children`.`present` = :present WHERE `children`.`id` = :id', {
            id: this.id,
            name: this.name,
            address: this.address,
            present: this.present,
        })
        return affectedRows;
    }

    async deleteMe() {
        await pool.execute('DELETE FROM `children` WHERE `children`.`id` = :id', {
            id: this.id
        });
    }

    //  static methods:
    static async getAll() {
        return (await pool.execute('SELECT * FROM `children` ORDER BY `children`.`name` ASC'))[0].map(el => new ChildRecord(el));
    }

    static async getOneById(id) {
        const [result] = await pool.execute('SELECT * FROM `children` WHERE `children`.`id` = :id', {
            id
        });
        return new ChildRecord(result[0]);
    }

    static async deleteOneById(id) {
        await pool.execute('DELETE FROM `children` WHERE `children`.`id` = :id', {
            id
        });
    }

    static async presentChildList(id) {
        return (await pool.execute('SELECT * FROM `children` WHERE `children`.`present` = :id ORDER BY `children`.`name` ASC', {
            id
        }))[0].map(el => new ChildRecord(el));
    }
}

module.exports = {
    ChildRecord
}