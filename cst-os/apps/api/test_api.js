const http = require('http');
http.get('http://localhost:3000/system-settings', res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    require('fs').writeFileSync('api_response.txt', `${res.statusCode}\n${body}`);
  });
}).on('error', err => require('fs').writeFileSync('api_response.txt', err.message));
