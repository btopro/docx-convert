import asciify from 'asciify-image';
import busboy from 'busboy';

export default async function handler(req, res) {
  var img = '';
  var buffer = {
    filename: null,
    data: null,
  };
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    file.on('data', (data) => {
      // we can only convert docx files
      if (mimeType.startsWith("image/") === true) {
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
        var options = {
            fit:    'box',
            width:  50,
            height: 25
        }
        img = await asciify(buffer.data, options)
            .then(function (asciified) {
              // Print asciified image to console
              console.log(asciified);
              return asciified;
            })
            .catch(function (err) {
            // Print error to console
            console.error(err);
            });
      }
      catch(e) {
        // put in the output
        img = e;
      }
    }
    res.json({
      status: "success",
      data: {
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