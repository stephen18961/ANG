// generate-hash.js
const bcrypt = require('bcryptjs');

const password = 'admin123'; // <-- Change this to your desired password

bcrypt.hash(password, 10).then(hash => {
  console.log('Password:', password);
  console.log('Hash:', hash);
});