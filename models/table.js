'use strict';
module.exports = (mongoose, models) => {
  let tableSchema = mongoose.Schema({
    tables: Array
  });
  let Table = mongoose.model('Table', tableSchema);
  models.Table = Table;
};
