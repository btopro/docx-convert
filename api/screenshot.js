import chromium from 'chrome-aws-lambda'

export async function getBrowserInstance() {
	const executablePath = await chromium.executablePath

	if (!executablePath) {
		// running locally
		const puppeteer = await import('puppeteer').then((m) => {
      return m.default;
    });
		return puppeteer.launch({
			args: chromium.args,
			headless: true,
			defaultViewport: {
				width: 1280,
				height: 720
			},
			ignoreHTTPSErrors: true
		});
	}

	return chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: {
			width: 1280,
			height: 720
		},
		executablePath,
		headless: chromium.headless,
		ignoreHTTPSErrors: true
	});
}

export default async function handler(req, res) {
  const { urlToCapture } = req.query;
  // Perform URL validation
  if (!urlToCapture || !urlToCapture.trim()) {
    res.json({
        status: 'error',
        error: 'Enter a valid URL'
    })
  }
  // capture options
  var browserGoToOptions = {
    timeout: 10000,
    waitUntil: ['load', 'domcontentloaded', 'networkidle2'],
  };
  var screenshotOptions = {
    quality: 75,
    type: 'jpeg',
    encoding: "base64"
  };
  var base64 = '';
  let browser = null
  try {
    browser = await getBrowserInstance();
    let page = await browser.newPage();
    await page.goto(urlToCapture, browserGoToOptions);
    // allow 300ms for loading of js assets
    await new Promise(resolve => setTimeout(resolve, 300));
    // special support for isolating a tweet
    if (urlToCapture.includes('twitter.com')) {
      await page.waitForSelector("article[data-testid='tweet']");
      const element = await page.$("article[data-testid='tweet']");
      base64 = await element.screenshot(screenshotOptions);
    }
    else {
      screenshotOptions.fullPage = true;
      base64 = await page.screenshot(screenshotOptions);
    }
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=1800');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    res.json({
      status: "success",
      data: {
        url: urlToCapture, 
        image: base64
      }
    });
  } catch (error) {
      console.log(error)
      res.json({
          status: 'error',
          data: error.message || 'Something went wrong'
      })
  } finally {
      if (browser !== null) {
          await browser.close()
      }
  }
}