'use strict';

let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

module.exports = (mongoose, models) => {
  let userSchema = mongoose.Schema({
    name: String,
    password: String,
    admin: Boolean
  });


  userSchema.pre('save', function(next, done) {
    var self = this;
    //console.log(self);
    User.findOne({name : self.name},function(err, user) {
      if(err) {
        next('error!');
      } else if(user) {
        self.invalidate('name','username must be unique');
        next(new Error('username must be unique'));
      } else {
        self.password = bcrypt.hashSync(self.password, bcrypt.genSaltSync(10));
        next();
      }
    });
  });

  userSchema.methods.compareHash = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  userSchema.methods.generateToken = function() {
    return jwt.sign({_id: this._id}, 'CHANGE ME') ;
  };


  let User = mongoose.model('User', userSchema);
  models.User = User;
};

