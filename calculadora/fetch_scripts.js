const https = require('https');

https.get('https://www.calcproobra.com.br/calculadora-reforma-tributaria', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("HTML length:", data.length);
    // Find all script tags
    const scripts = data.match(/<script.*?src="(.*?)".*?>/g);
    if (scripts) {
      scripts.forEach(s => {
        const match = s.match(/src="(.*?)"/);
        if (match) console.log(match[1]);
      });
    }
  });
});
