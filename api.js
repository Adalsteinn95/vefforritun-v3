const express = require('express');

const {
  check,
  validationResult,
} = require('express-validator/check');
const {
  sanitize,
} = require('express-validator/filter');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const validation = [
  check('title')
    .isLength({
      min: 1,
      max: 255,
    })
    .withMessage('Title must be a string of length 1 to 255 characters'),

  check('datetime')
    .isISO8601()
    .withMessage('Datetime must be ISO 8601 date'),
  check('text').custom((value) => {
    if (typeof value !== 'string') {
      return false;
    }
    return true;
  }).withMessage('Text must be a string'),
  sanitize('title').trim(),
  sanitize('text').trim(),
];

function getErrors(errors) {
  const errorMsg = errors.array().map(i => ({ field: i.param, message: i.msg }));
  return errorMsg;
}

/* todo útfæra api */

async function fetchNotes(req, res) {
  const notes = await readAll();

  res.json(notes);
}

async function fetchSingleNote(req, res, next) {
  const dest = parseInt(req.params.data, 10);

  const result = await readOne(dest);

  if (result) {
    res.json(result[0]);
  } else {
    next();
  }
}

async function postNote(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = getErrors(errors);

    res.json(errorMsg);
  } else {
    const finished = await create(req.body);
    const result = await readOne(finished.rows[0].id);

    res.json(result[0]);
  }
}

async function updateNote(req, res, next) {
  const dest = parseInt(req.params.data, 10);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = getErrors(errors);
    res.json(errorMsg);
  } else {
    const finished = await update(dest, req.body);
    if (finished.rows.length !== 0) {
      const result = await readOne(finished.rows[0].id);
      res.json(result[0]);
    } else {
      next();
    }
  }
}

async function deleteNote(req, res, next) {
  const dest = parseInt(req.params.data, 10);

  const finished = await del(dest);

  if (finished) {
    res.json();
  } else {
    res.status(404).json({ error: 'eror' });
  }
}

router.get('/', catchErrors(fetchNotes));

router.get('/:data', catchErrors(fetchSingleNote));

router.post('/', validation, catchErrors(postNote));

router.put('/:data', validation, catchErrors(updateNote));

router.delete('/:data', catchErrors(deleteNote));

module.exports = router;
