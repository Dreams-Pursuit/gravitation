"use strict";

class dataBaseOperator
{
  static db;
  static InitializeDB(dataBaseInst)
  {
    dataBaseOperator.db = dataBaseInst;
  }
  static async read(tableName, params)
  {
    const entries = Object.entries(params);
    const whereClause = entries.length > 0 ? `WHERE ${entries.map(elem => `${elem[0]} = '${elem[1]}'`).join(' AND ')}` : ``;
    const res = await dataBaseOperator.db.query(`SELECT * FROM ${tableName} ${whereClause}`);
    return res.rows;
  }
  static update(tableName, params, newData)
  {
    const paramsEntries = Object.entries(params);
    const newDataEntries = Object.entries(newData);
    const whereClause = `WHERE ${paramsEntries.map(elem => elem.join(' = ')).join(' AND ')}`;
    const updateClause = newDataEntries.map(elem => elem.join(' = ')).join(', ');
    dataBaseOperator.db.query(`UPDATE ${tableName} SET (${updateClause}) ${whereClause}`, (err, res) => 
    {
      if(err)
      {
        console.log("Failed to update table ", err);
      }
    })
  }
  static delete(tableName, params)
  {
    const entries = Object.entries(params);
    const whereClause = `WHERE ${entries.map(elem => elem.join(' = ').join(' AND '))}`;
    dataBaseOperator.db.query(`DELETE FROM ${tableName} ${whereClause}`, (err, res) => 
    {
      if(err)
      {
        console.log("Failed to delete from the table", err);
      }
    })
  }
  static create(tableName, params)
  {
    const keys = Object.keys(params);
    console.log(keys);
    const values = Object.values(params);
    console.log(values);
    dataBaseOperator.db.query(`INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${values.map(elem => `'${elem}'`).join(', ')})`, 
    (err, res) => 
    {
      if(err)
      {
        console.log("Failed to insert to the table ", err);
      }
    });
  }
}

module.exports = dataBaseOperator;