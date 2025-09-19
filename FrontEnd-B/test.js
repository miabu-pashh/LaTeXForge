// import fetch from "node-fetch";

// const test = async () => {
//   const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
//   const data = await res.json();
//   console.log("✅ Response:", data);
// };

// test();

import { findCareerEmail } from "./scrapeEmail.js";

const companyName = "Pinterest"; // Change this to test different companies

findCareerEmail(companyName).then((email) => {
  console.log(`📬 Final HR Email: ${email}`);
});
