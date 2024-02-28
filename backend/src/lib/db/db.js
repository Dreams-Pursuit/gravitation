"use strict";

function buildContraint(option) {
  if (!option?.data) return "";
  const conds = [];
  for (const [key, value] of [...Object.entries(option.data)]) {
    conds.push(`${key}='${value}'`);
  }
  if (!option?.logic) return "WHERE " + conds[0];
  return "WHERE " + conds.join(` ${option.logic} `);
}

const crud = (db) => (table) => {
  console.log("Logging db");
  console.log(db);
  return ({
    async query(sql, args) {
      const result = await db.query(sql, args);
      return result.rows;
    },
    async read(options, fields = ["*"]) {
      const names = fields.join(", ");
      const sql = `SELECT ${names} FROM ${table}`;
      if (!options) return db.query(sql);
      return db.query(`${sql} ${buildContraint(options)}`);
    },

    async create({ ...record }) {
      const keys = Object.keys(record);
      const nums = new Array(keys.length);
      const data = new Array(keys.length);
      let i = 0;
      for (const key of keys) {
        data[i] = record[key];
        nums[i] = `$${++i}`;
      }
      const fields = "\"" + keys.join("\", \"") + "\"";
      const params = nums.join(", ");
      const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params})`;
      return db.query(sql, data);
    },

    async update(id, { ...record }) {
      const keys = Object.keys(record);
      const updates = new Array(keys.length);
      const data = new Array(keys.length);
      let i = 0;
      for (const key of keys) {
        data[i] = record[key];
        updates[i] = `${key} = $${++i}`;
      }
      const delta = updates.join(", ");
      const sql = `UPDATE ${table} SET ${delta} WHERE id = $${++i}`;
      data.push(id);
      return db.query(sql, data);
    },

    async delete(id) {
      const sql = "DELETE FROM ${table} WHERE id = $1";
      return db.query(sql, [id]);
    },
  });
};

module.exports = (db) => crud(db);
