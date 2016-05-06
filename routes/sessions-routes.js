'use strict';


module.exports = (router, models) => {
  let Session = models.Session;
  let Subject = models.Subject;
  let Table = models.Table;

  router.route('/sessions')
    .get((req, res) => {
      // Displays current queue
      Session.find({timeOut:null}, (err, sessions) => {

        if (err) {
          res.json({error: err});
        }// if
        res.json(sessions);
      });// find
    })
    .post((req, res) => {
      Session.count({table:req.body.table, subject:req.body.subject, timeOut:null}, (err, sessions) => {
        if (err) {
          res.json({error: err});
        }// if (err)
        if (sessions > 0) {
          res.json({message: 'You are already in the queue!', status:418});
        } else {
          var d = new Date();
          req.body.timeIn = d;
          req.body.timeOut = '';
          var newSession = new Session(req.body);
          newSession.save((err, session) => {
            if (err) {
              res.json(err.toString());
            } else {
              console.log("Saved!");
              res.json({message:'You have been added to the queue.', status:200, data: session});
              req.io.sockets.emit('UpdateQ');
            }// if (err)
          });// save
        }// if (sessions > 0)
      });// count
    });

  router.route('/sessions/:id')
    .put((req, res) => {
      var d = new Date();
      Session.findByIdAndUpdate(req.params.id, {timeOut: d}, (err, session) => {
        if (err) {
          res.json(err.toString());
        } else {

          res.json({
            message: 'Updated session',
            data: session
          });
        }
      });
    })
    .delete((req, res) => {
      // Delete a session from the queue
      Session.findById(req.params.id, (err, session) => {
        if (err) {
          res.send(err);
        }// if
        session.remove((err, session) => {
          res.json({'message': 'Session removed'});
          req.io.sockets.emit('UpdateQ');
          console.log('emit DeletedSession!');
          req.io.sockets.emit('DeletedSession');
           
        });// remove
      });// findById
    });


  router.route('/subjects')
    .get((req, res) => {
      Subject.find({}, (err, list) => {
        if (err) {
          res.json({error: err});
        }// if
        res.json(list);
      }); // find
    });// get

  router.route('/tables')
    .get((req, res) => {
      Table.find({}, (err, list) => {
        if (err) {
          res.json({error: err});
        }// if
        res.json(list);
      }); // find
    });// get
}// exports
