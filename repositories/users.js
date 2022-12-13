const fs = require('node:fs');
const crypto = require('node:crypto');
const util = require('node:util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepo extends Repository {


  async create(attributes) {
    attributes.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const hashedBuf = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll();
    const record = { ...attributes, password: `${hashedBuf.toString('hex')}.${salt}` };
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async validateUser(saved, entered) {
    const [hashed, salt] = saved.split('.');
    const hashedEnteredBuf = await scrypt(entered, salt, 64);

    return hashed === hashedEnteredBuf.toString('hex');
  }

}

module.exports = new UsersRepo('users.json');
