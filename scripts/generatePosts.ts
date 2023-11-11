import fs from 'fs/promises';
import path from 'path';

const API_KEY = process.env.DEV_TO_API_KEY;

if (API_KEY == undefined) process.exit();

const postsDir = path.join(process.cwd(), 'src/content/posts')

const jsonResponse = fetch("https://dev.to/api/articles/me/published", {
  method: "GET",
  headers: {
    "api-key": API_KEY
  }
}).then(r => r.json())

function insertDataIntoBodyMarkdown(body_markdown: string, data: any) {
  const firstPart = body_markdown.slice(0, 5)
  let secondPart = body_markdown.slice(5)
  const dataEntries = Object.keys(data)
  .filter(k => body_markdown.indexOf(k + ":") == -1) // Only process extra data that is not present
  .map(k => k + ": " + data[k]).join("\r\n") + "\r\n" // YAML format

  secondPart = secondPart.split("\r\n").map(l => l.startsWith("tags:") ? l.replaceAll("#", "") : l).join("\r\n")

  return firstPart + dataEntries + secondPart;
}

async function deleteAllFilesInDir(dirPath: string) {
  try {
    const files = await fs.readdir(dirPath);

    const deleteFilePromises = files.map(file =>
      fs.unlink(path.join(dirPath, file)),
    );

    await Promise.all(deleteFilePromises);
  } catch (err) {
    console.log(err);
  }
}

async function main() {
  const res = await jsonResponse;

  await deleteAllFilesInDir(postsDir)

  for (const article of res) {
    const { body_markdown, comments_count, page_views_count, public_reactions_count, published_timestamp, url, slug, cover_image } = article;

    if (url == undefined || !body_markdown.startsWith("---")) continue;

    const new_markdown = insertDataIntoBodyMarkdown(body_markdown, {
      comments: comments_count,
      reactions: public_reactions_count,
      views: page_views_count,
      published_at: published_timestamp,
      devto_link: url,
      cover_image: cover_image || "none"
    })

    fs.writeFile(postsDir + "/" + slug + ".md", new_markdown)
  }
}

main()