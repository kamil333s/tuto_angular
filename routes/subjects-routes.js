'use strict';

module.exports = (router, models) => {
  let Subject = models.Subject;

  router.route('/subjects')
    .get((req, res) => {
      Subject.find({}, (err, list) => {
        if (err) {
          res.json({error: err});
        }// if
        res.json(list);
      }); // find
    })
    .post((req, res) => {
      Subject.count({subjects: req.params.subjects}, (err, subjects) => {
        if (err) {
          return res.send(err);
        } else {
          if (subjects == 0) {
            var newSubject = new Subject();
            newSubject.subjects= req.body.subjects;
            newSubject.save((err, subject) => {
              if (err) {
                res.json(err.toString());
              } else {
                res.json(subject);
              }// if (err)
            });// save
          } else {
            res.send('Subjects already exists!');
          }// if (tables ==0)
        }// if (err)
      });// count
    })
    .delete((req, res) => {
      Subject.remove({}, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Subjects deleted!');
        }// if
      });// remove
    });

  router.route('/subjects/:id')
    .put((req, res) => {
      Subject.findById(req.params.id, (err, subject) => {
        if (err) {
          return res.send(err);
        } // if
        req.body.subjects.forEach(function(sub) {
          subject.subjects.push(sub);
        });
        subject.save(function(err) {
          if(err) return res.send(err);
          res.json({
            message: 'Subject updated',
            data: subject
          });
        });
      });// findByIdAndUpdate
    })
    .delete((req, res) => {
      Subject.remove(req.params.id, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Subjects deleted!');
        }// if
      });// remove
    });

}
