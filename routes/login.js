'use strict';


module.exports = (router, models) => {
  let User = models.User;

  router.route('/users')
  .post((req, res) => {
    var newUser = new User(req.body);
    newUser.save((err, user) => {
      if (err) {
        res.json(err.toString());
      } else {
        res.json({message:'New user created'});
      }// if
    }); // save
  });

  router.post('/login', (req, res) => {

    let authorizationArray = req.headers.authorization.split(' ');
    let base64ed = authorizationArray[1];
    let authArray = new Buffer(base64ed, 'base64').toString().split(':');
    let name = authArray[0];
    let password = authArray[1];
    // parse based on basic or whatever method
    User.find({name: name}, (err, user) => {
      if (user.length == 0) {
        return res.status(500).send('Invalid username!');
        // return res.json({status: 'failure', message: 'Invalid username!'});
      }
      let valid = user[0].compareHash(password);
      if (!valid) {
        return res.status(500).send('Invalid password!');
        // return res.json({status: 'failure', message: 'Invalid password!'});
      }
      // generate and return the token
      var myToken = user[0].generateToken();
      res.json({message: 'Welcome, ' + name, token: myToken});
    }) ;
  });
};
