/* todo sækja pakka sem vantar  */

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:12345@localhost/vefforritun2';
const { Client } = require('pg');
const xss = require('xss');

const validator = require('validator');


async function errorCatcher(datetime, title, text) {
  const errors = [];

  if (!validator.isLength(title, { min: 1, max: 255 })) {
    errors.push({ field: 'title', error: 'Title must be a string of length 1 to 255 characters' });
  }

  if (typeof text !== 'string') {
    errors.push({ field: 'text', error: 'Text must be a string' });
  }

  if (!validator.isISO8601(datetime)) {
    errors.push({ field: 'datetime', error: 'Datetime must be a ISO 8601 date' });
  }
  return errors;
}

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  const query = 'INSERT INTO notes(datetime, title, text) VALUES($1, $2, $3) RETURNING id';
  const values = [xss(datetime), xss(title), xss(text)];

  const errors = await errorCatcher(datetime, title, text);

  if (errors.length > 0) {
    return errors;
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    const note = await client.query(query, values);
    return note;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  const client = new Client({ connectionString });

  const query = 'SELECT * from notes';

  await client.connect();

  try {
    const result = await client.query(query);

    const { rows } = result;
    return rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  const notes = await readAll();

  const filtered = await notes.filter(item => id === item.id);
  return filtered.length ? filtered : null;
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  const client = new Client({ connectionString });

  const query = 'UPDATE notes SET datetime = $1,title = $2, text = $3 WHERE id = $4 RETURNING id';
  const values = [xss(datetime), xss(title), xss(text), xss(id)];

  const errors = await errorCatcher(datetime, title, text);
  if (errors.length > 0) {
    return errors;
  }

  await client.connect();

  try {
    const result = await client.query(query, values);
    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  const query = 'DELETE FROM notes WHERE id = $1 RETURNING *';
  const values = [id];

  await client.connect();

  try {
    const result = await client.query(query, values);
    if (result.rowCount === 1) {
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
