const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Jsondb = require('./jsondb/main');
const FileSync = require('./jsondb/adapters/FileSync');
const _ = require('lodash');
const Constants = require('../const');
const Helper = require('../utils/helper');
const Ps = require('../ps');

class JsondbStorage {
  constructor (name, opt = {}) {
    assert(name, `db name ${name} Cannot be empty`);

    this.name = name;

    // 数据库key列表
    this.storageKey = Constants.storageKey;

    const storageDir = Ps.getStorageDir();
    if (!fs.existsSync(storageDir)) {
      Helper.mkdir(storageDir);
    }

    this.db = this.table(name);
  }

  /**
   * 创建 table
   */
  table (name) {
    assert(name, 'table name is required');

    const dbFile = this.getFilePath(name);
    const adapter = new FileSync(dbFile);
    const db = Jsondb(adapter);

    assert(fs.existsSync(dbFile), `error: storage ${dbFile} not exists`);

    return db;
  }

  /**
   * 获取db文件名
   */
  getFileName (name) {
    return name + ".json";
  }

  /**
   * 获取文件绝对路径
   */
  getFilePath (name) {
    const storageDir = Ps.getStorageDir();
    const dbFile = path.join(storageDir, this.getFileName(name));
    return dbFile;
  }

  /**
   * 为指定的 name 设置一个对应的值
   */
  setItem (key, value) {
    assert(_.isString(key), `key must be a string`);
    assert(key.length != 0, `key cannot be empty`);
    assert(!this.storageKey.hasOwnProperty(key), `${key} is not allowed`);

    let cacheKey = this.storageKey.cache;
    if (!this.db.has(cacheKey).value()) {
      this.db.set(cacheKey, {}).write();
    }

    let keyId = cacheKey + "." + key; 
    this.db
      .set(keyId, value)
      .write();
  
    return true;
  }
  
  /**
   * 根据指定的名字 name 获取对应的值
   */
  getItem (key) {
    assert(_.isString(key), `key must be a string`);
    assert(key.length != 0, `key cannot be empty`);

    let cacheKey = this.storageKey.cache;
    let keyId = cacheKey + "." + key; 
    const data = this.db
      .get(keyId)
      .value();
  
    return data;
  }

  /**
   * 设置config对象key属性的值
   */
  setConfigItem (key, value) {
    assert(_.isString(key), `key must be a string`);
    assert(key.length != 0, `key cannot be empty`);
    assert(!this.storageKey.hasOwnProperty(key), `${key} is not allowed`);

    let cacheKey = this.storageKey.cacheConfig;
    if (!this.db.has(cacheKey).value()) {
      this.db.set(cacheKey, {}).write();
    }

    let keyId = cacheKey + "." + key; 
    this.db
      .set(keyId, value)
      .write();
  
    return true;
  }
  
  /**
   * 获取config对象key属性的值
   */
  getConfigItem (key) {
    assert(_.isString(key), `key must be a string`);
    assert(key.length != 0, `key cannot be empty`);

    let cacheKey = this.storageKey.cacheConfig;
    let keyId = cacheKey + "." + key; 
    const data = this.db
      .get(keyId)
      .value();
  
    return data;
  }   
}

module.exports = JsondbStorage;