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
  res.send(notes);
}

async function fetchSingleNote(req, res) {
  const dest = parseInt(req.params.data);

  const result = await readOne(dest);

  res.send(result);
}

async function postNote(req, res) {

  const finished = await create(req.body);

  res.send(finished);
}

async function updateNote(req, res) {

  const dest = parseInt(req.params.data);

  const alter = await update(dest, req.body)

  res.send(alter);
}

async function deleteNote(req, res) {
  const dest = parseInt(req.params.data);

  const finished = await del(dest);

  res.send(finished);
}

router.get('/', catchErrors(fetchNotes));

router.get('/:data', catchErrors(fetchSingleNote));

router.post('/', catchErrors(postNote));

router.put('/:data', catchErrors(updateNote));

router.delete('/:data', catchErrors(deleteNote));

module.exports = router;
