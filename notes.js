/* todo sækja pakka sem vantar  */

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:12345@localhost/vefforritun2';
const { Client } = require('pg');

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


  const client = new Client({ connectionString });

  const query = 'INSERT INTO notes(datetime, title, text) VALUES($1, $2, $3)';
  const values = [datetime, title, text];

  client.connect();

  try {
    await client.query(query, values);
    const note = await { title, text, datetime };
    return note;
  } catch (err) {
    console.error('Error inserting data');
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

  client.connect();

  try {
    const result = await client.query(query);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error Selecting data');
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
  /* todo útfæra */

  const client = new Client({ connectionString });

  const query = 'UPDATE notes SET datetime = $1,title = $2, text = $3 WHERE id = $4';
  const values = [datetime, title, text, id];

  client.connect();

  try {
    await client.query(query, values);
    const note = {
      id,
      title,
      text,
      datetime,
    };
    return note;
  } catch (err) {
    console.error('Error inserting data');
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

  const query = 'DELETE FROM notes WHERE id = $1';
  const values = [id];

  client.connect();

  try {
    await client.query(query, values);
    return '';
  } catch (err) {
    console.error('Error inserting data');
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
