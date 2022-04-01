import captureWebsite from 'capture-website';

export default async function handler(req, res) {
  const { urlToCapture } = req.query;
  if (urlToCapture) {
    const img = await captureWebsite.base64(urlToCapture, {
        timeout: 20,
        fullPage: true,
        scaleFactor: 1,
        quality: .75,
        type: 'jpeg',
    });
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=1800');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    res.json({
        url: urlToCapture, 
        image: img
    });
  }
}