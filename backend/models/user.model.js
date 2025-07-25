const db = require('../db');

module.exports.createUser = async ({ name, email, password, address, role }) => {
  const [rows] = await db.execute(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, address, role || 'user']
  );
  return rows;
};

module.exports.findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

module.exports.findUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};