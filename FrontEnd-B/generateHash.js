// generateHash.js
import bcrypt from "bcrypt";

const password = "maibu123";

bcrypt.hash(password, 10).then((hash) => {
  console.log("🔑 Bcrypt hash:", hash);
});
