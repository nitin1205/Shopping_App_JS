const fs = require('node:fs');
const crypto = require('node:crypto');
const util = require('node:util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepo {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository require a filename');
    }
    
    this.filename = filename;
    try {
    fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
  }

  async create(attributes) {
    attributes.id = this.#randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const hashed = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll();
    const record = { ...attributes, password: `${hashed.toString('hex')}.${salt}` };
    records.push(record);
    await this.#writeAll(records);
    return record;
  }

  async validateUser(saved, entered) {
    const [hashed, salt] = saved.split('.');
    const hashedEnteredBuf = await scrypt(entered, salt, 64);

    return hashed === hashedEnteredBuf.toString('hex');
  }

  async #writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  #randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }  

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.#writeAll(filteredRecords);
  }

  async update(id, attributes) {
    const records = await getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
      throw new Error(`Record for ${id} not found`);
    }

    Object.assign(record, attributes);
    await this.#writeAll(records);
  }
	
  async getOneBy(filters) {
    const records = await this.getAll();
   
    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
	  found = false;
	}
      }
      
      if (found) {
        return record;
      }
    }
  }

}

module.exports = new UsersRepo('users.json');
