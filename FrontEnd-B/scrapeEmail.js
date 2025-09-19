import fetch from "node-fetch";
import * as cheerio from "cheerio";
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const generateUrls = (companyName) => {
  const base = companyName.toLowerCase().replace(/\s+/g, "");
  return [
    `https://${base}.com`,
    `https://${base}.com/careers`,
    `https://${base}.com/about/contact`,
    `https://${base}careers.com`,
  ];
};

export async function findCareerEmail(companyName) {
  const urls = generateUrls(companyName);

  for (const url of urls) {
    try {
      console.log(`🌐 Trying: ${url}`);
      const res = await fetch(url, { timeout: 5000 });
      const html = await res.text();
      const $ = cheerio.load(html);
      const text = $("body").text();

      const emails = text.match(EMAIL_REGEX);
      if (emails) {
        const filtered = emails.find(
          (email) =>
            email.includes("hr") ||
            email.includes("career") ||
            email.includes("recruit")
        );

        if (filtered) {
          console.log(`✅ Found email: ${filtered}`);
          return filtered;
        }
      }
    } catch (err) {
      console.warn(`⚠️ Failed to fetch ${url}:`, err.message);
    }
  }

  return "Not available";
}

// Optional test
// findCareerEmail("Pinterest").then(console.log);
