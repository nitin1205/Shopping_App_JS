const fs = require('node:fs');
const crypto = require('node:crypto');


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
    const records = await this.getAll();
    records.push(attributes);
    await this.#writeAll(records);
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

}

const test = async () => {
  const repo = new UsersRepo('users.json');
 // await repo.create({ email:'test@gmail.com', password:'password'});

  const users = await repo.getAll();
  console.log(users);
  await repo.delete('a8424055');
  const newUsers = await repo.getAll();
  console.log(newUsers);
};

test();
