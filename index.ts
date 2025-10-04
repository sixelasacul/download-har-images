import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { v7 as uuid } from "uuid";

type Response = {
  status: number;
  content: {
    mimeType: string;
    size: number;
    encoding: string;
    text: string;
  };
};

type HAR = {
  log: {
    entries: {
      response: Response;
    }[];
  };
};

const MIME_TYPE_REGEX = /(\w+)\/(\w+)/i;
const HARS_DIRECTORY = "./hars";
const IMAGES_DIR = "./images";

const fileNames = await readdir(HARS_DIRECTORY);

await Promise.all(
  fileNames.flatMap(async (fileName) => {
    const file = await readFile(resolve(HARS_DIRECTORY, fileName));
    const json = JSON.parse(file.toString()) as HAR;

    return json.log.entries.map(async (entry) => {
      if (entry.response.status !== 200) return;

      const { mimeType, text } = entry.response.content;
      const decoded = Buffer.from(text, "base64");
      const [, mimeGroup, extension] = mimeType.match(MIME_TYPE_REGEX) ?? [];

      if (mimeGroup !== "image") return;

      const filePath = `${uuid()}.${extension}`;
      await writeFile(resolve(IMAGES_DIR, filePath), decoded);
    });
  })
);
