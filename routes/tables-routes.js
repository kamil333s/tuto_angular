'use strict';

module.exports = (router, models) => {
  let Table = models.Table;

  router.route('/tables')
    .get((req, res) => {
      Table.find({}, (err, list) => {
        if (err) {
          res.json({error: err});
        }// if
        res.json(list);
      }); // find
    })
    .post((req, res) => {
      // Create tables

      Table.count({tables: req.body.tables}, (err, tables) => {
        if (err) {
          return res.send(err);
        } else {
          if (tables == 0) {

            var newTable = new Table(req.body);
            newTable.save((err, table) => {
              if (err) {
                res.json(err.toString());
              } else {
                res.json(table);
              }// if (err)
            });// save
          } else {
            res.send('Tables already exists!');
          }// if (tables ==0)
        }// if (err)
      });// count
    })
    .delete((req, res) => {
      Table.remove({}, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Tables deleted!');
        } // if
      }); // remove
    });

  router.route('/tables/:id')
    .put((req, res) => {
      Table.findById(req.params.id, (err, table) => {
        if (err) {
          return res.send(err);
        } // if
        req.body.tables.forEach(function(tab) {
          table.tables.push(tab);
        });
        table.save(function(err) {
          if(err) return res.send(err);
          res.json({
            message: 'Table updated',
            data: table
          });
        });
      }); //findByIdAndUpdate
    })
    .delete((req, res) => {
      Table.remove(req.params.id, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Tables deleted!');
        } // if
      }); // remove
    });
}
