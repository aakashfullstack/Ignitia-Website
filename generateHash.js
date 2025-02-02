const bcrypt = require("bcrypt");

async function generateHash() {
  const saltRounds = 8;
  const password = "Ignitia@892008";
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hash);
}

generateHash();
