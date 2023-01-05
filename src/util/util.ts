import fs from "fs";
import Jimp = require("jimp");
import axios from 'axios'

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const ext = getExt(inputURL)
      const result = await axios.get(inputURL, {responseType: "arraybuffer"});
      const buffer = Buffer.from(result.data, 'binary');
      const photo = await Jimp.read(buffer)
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + `.${ext}`;
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

async function handleImgDownloadFailed(inputURL: string): Promise<string> {
  const result = await axios.get(inputURL, {responseType: "arraybuffer"});
  const buffer = Buffer.from(result.data, 'binary');
  const photo = await Jimp.read(buffer)
  return ''
}

function getExt(url: string): string {
  const tmp = url.split('.')
  return tmp[tmp.length - 1]
}