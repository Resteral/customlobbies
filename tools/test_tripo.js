const https = require('https');

const key = "tcli_6044feaf66b94d7b800b254e38adf556";

function testHeader(authValue) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ type: "text_to_model", prompt: "small pot" });
    const req = https.request({
      hostname: 'api.tripo3d.ai',
      path: '/v2/openapi/task',
      method: 'POST',
      headers: {
        'Authorization': authValue,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`[Header: ${authValue}] Code: ${res.statusCode} -> ${body}`);
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
}

async function run() {
  await testHeader(`Bearer ${key}`);
  await testHeader(key);
  await testHeader(`Bearer tsk_${key}`);
}

run();
