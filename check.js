const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const required = ['NalamUnavu','/api/create-order','/api/verify-payment','Restaurant Login','Delivery Partner Login','Super Admin Login'];
const missing = required.filter(x => !html.includes(x));
if (missing.length) { console.error('Missing:', missing.join(', ')); process.exit(1); }
console.log('NalamUnavu deployment checks passed.');
