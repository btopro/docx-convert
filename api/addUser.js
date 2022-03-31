// addUser.js
import { PSDB } from 'planetscale-node';

export default async function handler(req, res) {
  // this is making wide sweeping assumptions of the data accuracy
  const { name, email, password } = req.query;
  var user = {
    name: name,
    email: email,
    password: password,
  };
  // this option helps establish a more secure connection object
  const conn = new PSDB('main', {namedPlaceholders: true});
  // INSERT the values that came across into the users table
  const [dbResult] = await conn.execute(
    `INSERT INTO users(name, email, password) VALUES( :name, :email, :password)`,
    user
  );
  // take the id that comes back and then apply to the user object
  user.id = dbResult.insertId
  res.json(user);
}