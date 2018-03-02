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

  res.status(200).json(notes);
}

async function fetchSingleNote(req, res) {
  const dest = parseInt(req.params.data, 10);

  const result = await readOne(dest);

  if (!result) {
    res.status(404).json({ error: 'Note not found' });
  } else {
    res.status(200).json(result[0]);
  }
}

async function postNote(req, res) {
  const finished = await create(req.body);

  if (finished.rows === undefined) {
    res.status(400).json(finished);
  } else {
    const result = await readOne(finished.rows[0].id);
    res.status(201).json(result[0]);
  }
}

async function updateNote(req, res) {
  const dest = parseInt(req.params.data, 10);


  const finished = await update(dest, req.body);

  if (finished.rowCount === 1) {
    const result = await readOne(finished.rows[0].id);
    res.status(200).json(result[0]);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
}

async function deleteNote(req, res) {
  const dest = parseInt(req.params.data, 10);

  const finished = await del(dest);

  if (finished) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
}

router.get('/', catchErrors(fetchNotes));

router.get('/:data', catchErrors(fetchSingleNote));

router.post('/', catchErrors(postNote));

router.put('/:data', catchErrors(updateNote));

router.delete('/:data', catchErrors(deleteNote));

module.exports = router;
