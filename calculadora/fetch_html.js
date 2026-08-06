const https = require('https');
const fs = require('fs');

https.get('https://www.calcproobra.com.br/calculadora-reforma-tributaria', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('page.html', data);
    console.log('Saved page.html. Length:', data.length);
  });
});
