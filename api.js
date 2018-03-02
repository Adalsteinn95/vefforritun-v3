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
    res.status(404).json({
      error: 'Note not found',
    });
  } else {
    const {
      id,
      title,
      text,
      datetime,
    } = result[0];
    res.status(200).json({
      id,
      title,
      text,
      datetime,
    });
  }
}

async function postNote(req, res) {
  const {
    title,
    text,
    datetime,
  } = req.body;

  const finished = await create({
    title,
    text,
    datetime,
  });

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

  if (finished) {
    const result = await readOne(finished.rows[0].id);
    res.status(200).json(result[0]);
  } else {
    res.status(404).json({
      error: 'Note not found',
    });
  }
}

async function deleteNote(req, res) {
  const dest = parseInt(req.params.data, 10);

  const finished = await del(dest);

  if (finished) {
    res.status(204).end();
  } else {
    res.status(404).json({
      error: 'Note not found',
    });
  }
}

router.get('/', catchErrors(fetchNotes));

router.get('/:data', catchErrors(fetchSingleNote));

router.post('/', catchErrors(postNote));

router.put('/:data', catchErrors(updateNote));

router.delete('/:data', catchErrors(deleteNote));

module.exports = router;
