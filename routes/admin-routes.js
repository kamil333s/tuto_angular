'use strict';
let fs = require('fs');
let json2csv = require('json2csv');
let sendgrid  = require('sendgrid')(process.env.U, process.env.P);

module.exports = (router, models) => {
  let Session = models.Session;
  let Table = models.Table;
  let Subject = models.Subject;
  let User = models.User;
  let Archive = models.Archive;

  router.route('/')
    .get((req, res) => {
      // displays all Subjects and Tables
      var defaults = {'subjects':[], 'tables':[]};
      Subject.find({}, (err, list) => {
        if (err) {
          res.json({error: err});
        }// if
        defaults.subjects = list;
        Table.find({}, (err, list) => {
          if (err) {
            res.json({error: err});
          }// if
          defaults.tables = list;
          res.json(defaults);
        });// Table.find
      });// Subject.find
    })
    .put((req, res) => {
      // Clears the queue
      Session.find({timeOut:null}, (err, sessions) => {
        if (err) {
          res.json({error: err});
        }// if
        res.json(sessions);
      });// find
    });


  router.route('/users')
    .get((req, res) => {
      User.find({}, (err, users) => {
        if(err) return res.send(err);
        res.json(users);
      });
    })
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


  router.route('/users/:id')
    .delete((req, res) => {
      User.findById(req.params.id, (err, user) => {
        if(err) {
          res.send(err);
        } else {
          user.remove((err, user) => {
            res.send('User deleted');            
          })
        }// if
      });// remove
    });// delete

  router.route('/downloads')
    .get((req, res) => {
      var fields = ['timeIn', 'timeOut', 'subject', 'table'];
      Session.find({}, (err, data) => {
        if(err) return res.send(err);
        json2csv({ data: data, fields: fields }, (err, csv) => {
          if (err) console.log(err);
          fs.writeFile(__dirname+'/../downloads/sessions.csv', csv, function(err) {
            if (err) throw err;
            res.send('File exported');
          });
        });
      });
    });

  router.route('/email')
    .post((req, res) => {
      console.log(req.body);
      var fields = ['timeIn', 'timeOut', 'subject', 'table'];
      Session.find({}, (err, data) => {
        if(err) return res.send(err);
        json2csv({ data: data, fields: fields }, (err, csv) => {
          if (err) console.log(err);

          sendgrid.send({
            to:       req.body.email,
            from:     'no-replay@example.com',
            subject:  'Export CSV Raw Data',
            text:     'Here is a CSV file of the sessions data.',
            files: [{filename: 'sessions.csv', content: csv}]
          }, function(err, json) {
            if (err) { return console.error(err); }
          });
        });
      });
      res.send('Email sent');
    });

  router.route('/archive')
    .get((req, res) => {
      Archive.find({}, (err, data) => {
        if(err) res.send(err);
        res.json(data);
      });
    })
    .post((req, res) => {
      Session.find({}, (err, data) => {
        if(err) {
          res.send(err);
        } else {
          var sessionArr = new Archive();
          data.forEach((session) => {
            sessionArr.archive.push(session);
          });// forEach
          sessionArr.save(function (err) {
            if (err) {
              return res.send(err);
            } else {
              Session.remove({}, (err) => {
                if(err) {
                  res.send(err);
                } else {
                  res.json('Archive complete');
                }// if
              });// remove
            }// if
          });// save
        }// if
      });// find
    })// post
    .delete((req, res) => {
      Archive.remove({}, (err) => {
        if(err) {
          res.send(err);
        } else {
          res.send('Archive emptied');
        }// if
      });// remove
    });// delete
}// exports
