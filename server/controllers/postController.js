const db = require('../models/compostModels');
const { v4 } = require('uuid');

const postController = {};

//controller to get page location ID
postController.getPageUnique = (req, res, next) => {
  const query = `SELECT * FROM pages WHERE param = $1`;
  db.query(query, [req.body.location])
    .then(data => {
      res.locals.locationID = data.rows[0].id;
      return next();
    })
    .catch(err => {
      return next({
        log: `Express error handler caught getPageUnique from postController error ${err}`,
        status: 400,
        message: { err: `${err}` },
      });
    });
};

//controller to POST changes to the database
postController.postUpdate = async (req, res, next) => {
  if (!req.body.updatedItems) return next();
  const updatedItems = req.body.updatedItems;
  try {
    for (value of updatedItems) {
      const sendQuery = await db.query(
        `UPDATE items SET user_id = $1, name = $2 WHERE id = $3`,
        [value.user, value.name, value.id],
      );
    }
    return next();
  } catch (err) {
    return next({
      log: `Express error handler caught postUpdate error ${err}`,
      status: 400,
      message: { err: `${err}` },
    });
  }
};

//controller to POST new items to the database
postController.postNew = async (req, res, next) => {
  if (!req.body.newItems) return next();
  const newItems = req.body.newItems;
  try {
    for (value of newItems) {
      const sendQuery = await db.query(
        `INSERT INTO items (page_id, user_id, name, complete) VALUES ($1, $2, $3, false)`,
        [res.locals.locationID, value.user, value.name],
      );
    }
    return next();
  } catch (err) {
    return next({
      log: `Express error handler caught postNew error ${err}`,
      status: 400,
      message: { err: `${err}` },
    });
  }
};

//controller to POST new page to the database
postController.postNewPage = (req, res, next) => {
  const query = `INSERT INTO pages (param, active, location, brief, title, date, location_title) 
                VALUES ($1, true, $2, $3, $4, $5, $6)`;
  res.locals.locationID = v4().slice(0, 6);
  db.query(query, [
    res.locals.locationID,
    req.body.location,
    req.body.brief,
    req.body.title,
    req.body.date,
    req.body.location_title,
  ])
    .then(() => {
      return next();
    })
    .catch(err => {
      return next({
        log: `Express error handler caught postNewPage error ${err}`,
        status: 400,
        message: { err: `${err}` },
      });
    });
};

//controller to POST new user to the database
postController.postNewUser = (req, res, next) => {
  const query = `INSERT INTO users (page_id, name, color, active, phone, email) 
                VALUES ($1, $2, $3, true, $4, $5)`;
  db.query(query, [
    res.locals.locationID,
    req.body.name,
    req.body.color,
    req.body.phone,
    req.body.email,
  ])
    .then(() => {
      return next();
    })
    .catch(err => {
      return next({
        log: `Express error handler caught postNewUser error ${err}`,
        status: 400,
        message: { err: `${err}` },
      });
    });
};

module.exports = postController;
