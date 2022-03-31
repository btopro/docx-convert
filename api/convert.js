import df from 'mammoth';
const { convertToHtml } = df;
import busboy from 'busboy';

export default async function handler(req, res) {
  var html = '';
  var buffer = {
    filename: null,
    data: null,
  };
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    file.on('data', (data) => {
      // we can only convert docx files
      if (mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        console.log(`Docx File [${name}] called ${filename} was ${data.length} bytes`);
        buffer.filename = filename;
        buffer.data = data;
      }
    });
  });
  // file closed / finished
  bb.on('close', async () => {
    if (buffer.data) {
      try {
        html = await convertToHtml({buffer: buffer.data})
        .then((result) => {
          return result.value; // The generated HTML
        });
      }
      catch(e) {
        // put in the output
        html = e;
      }
    }
    res.json({
      contents: html,
      filename: buffer.filename,
    });
  });
  req.pipe(bb);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
}