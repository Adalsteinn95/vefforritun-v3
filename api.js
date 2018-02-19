const express = require('express');

const {
  check,
  validationResult,
} = require('express-validator/check');
const {
  sanitize
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
  
  check('text'),
  sanitize('title').trim(),
];

/* todo útfæra api */

async function fetchNotes(req, res) {
  const notes = await readAll();
  res.send(notes);
}

async function fetchSingleNote(req, res) {
  const dest = parseInt(req.params.data, 10);

  const result = await readOne(dest);

  res.send(result);
}

async function postNote(req, res) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((i) => {
      return {
        field: i.param,
        message: i.msg,
      };
    });

    res.send(errorMsg);
  }

  const finished = await create(req.body);
  res.send(finished);
}

async function updateNote(req, res) {

  const dest = parseInt(req.params.data, 10);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((i) => {
      return {
        field: i.param,
        message: i.msg,
      };
    });

    res.send(errorMsg);
  }

  const alter = await update(dest, req.body);
  res.send(alter);
}

async function deleteNote(req, res) {
  const dest = parseInt(req.params.data, 10);

  const finished = await del(dest);

  res.send(finished);
}

router.get('/', catchErrors(fetchNotes));

router.get('/:data', catchErrors(fetchSingleNote));

router.post('/', validation, catchErrors(postNote));

router.put('/:data', validation, catchErrors(updateNote));

router.delete('/:data', catchErrors(deleteNote));

module.exports = router;
