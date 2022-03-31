import fetch from 'node-fetch';

export default async function handler(request, res) {
  const { city } = request.query;
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.openweathermapappid}`;
	const currentWeather = await fetch(url).then(res => res.json());
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=1800');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.json(await currentWeather);
}