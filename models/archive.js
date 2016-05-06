'use strict';
module.exports = (mongoose, models) => {
  let archiveSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    archive: Array
  });
  let Archive = mongoose.model('Archive', archiveSchema);
  models.Archive = Archive;
};
