'use strict';
module.exports = (mongoose, models) => {
  let sessionSchema = mongoose.Schema({
    timeIn: Date,
    timeOut: Date,
    subject: String,
    table: String
  });
  let Session = mongoose.model('Session', sessionSchema);
  models.Session = Session;
};
