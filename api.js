const express = require('express');

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
  const finished = await create(req.body);

  if (finished.rows === undefined) {
    res.status(400).json(finished);
  } else {
    const result = await readOne(finished.rows[0].id);
    res.json(result[0]);
  }
}

async function updateNote(req, res, next) {
  const dest = parseInt(req.params.data, 10);


  const finished = await update(dest, req.body);
  if (finished.rows.length !== 0) {
    const result = await readOne(finished.rows[0].id);
    res.json(result[0]);
  } else {
    next();
  }
}

async function deleteNote(req, res, next) {
  const dest = parseInt(req.params.data, 10);

  const finished = await del(dest);

  if (finished) {
    res.json();
  } else {
    next();
  }
}

router.get('/', catchErrors(fetchNotes));

router.get('/:data', catchErrors(fetchSingleNote));

router.post('/', catchErrors(postNote));

router.put('/:data', catchErrors(updateNote));

router.delete('/:data', catchErrors(deleteNote));

module.exports = router;
