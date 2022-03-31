import fetch from 'node-fetch';

export default async function handler(request, res) {
  const { op } = request.query;
  switch (op) {
    case 'GET':
      const comments = await fetch(`https://api.jsonbin.io/v3/b/${process.env.jsonbinBin}`, {
        method: 'GET',
        headers: {
          'X-Master-Key': process.env.jsonbinXMasterKey
        }
      }).then((t) => {
        if (t.ok) {
          return t.json();
        }
      }).then((data) => data.record);
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
      res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
      res.json(await comments);
    break;
  }
}