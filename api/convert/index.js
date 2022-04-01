import df from 'mammoth';
const { convertToHtml } = df;
import busboy from 'busboy';
import concat from "concat-stream";
import { getBrowserInstance } from "../screenshot.js";

export default async function handler(req, res) {
  var html = '';
  var img = '';
  var buffer = {
    filename: null,
    data: null,
  };
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    if(filename.length > 0 && mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      console.log(`Docx File [${name}] called ${filename}`);
      file.pipe(concat((fileBuffer) => {
        buffer.filename = filename;
        buffer.data = fileBuffer;
      }));
    }
  });
  // file closed / finished
  bb.on('close', async () => {
    if (buffer.data) {
      try {
        html = await convertToHtml({buffer: buffer.data})
        .then((result) => {
          return result.value; // The generated HTML
        });
        // generate a screenshot of the HTML blob
        // capture options
        var screenshotOptions = {
          quality: 75,
          type: 'jpeg',
          encoding: "base64"
        };
        let browser = null
        try {
          browser = await getBrowserInstance();
          let page = await browser.newPage();
          await page.setContent(html)
          img = await page.screenshot(screenshotOptions)
        } catch (error) {
            console.log(error)
        } finally {
            if (browser !== null) {
                await browser.close()
            }
        }
      }
      catch(e) {
        // put in the output
        html = e;
      }
    }
    res.json({
      status: "success",
      data: {
        contents: html,
        filename: buffer.filename,
        image: img
      }
    });
  });
  req.pipe(bb);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
}