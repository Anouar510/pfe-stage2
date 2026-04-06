const fs = require('fs');
const files = [
  'c:/wamp64/www/pfe-stage/pfe-stage-react1/src/pages/dashboard.jsx',
  'c:/wamp64/www/pfe-stage/pfe-stage-react1/src/pages/admin.jsx'
];

for (const fp of files) {
  try {
    let content = fs.readFileSync(fp, 'utf8');
    // If the content contains Ã, it means it's badly encoded
    if (content.includes('Ã')) {
      content = Buffer.from(content, 'latin1').toString('utf8');
      fs.writeFileSync(fp, content, 'utf8');
      console.log('Fixed', fp);
    } else {
      console.log('No corruption found in', fp);
    }
  } catch (e) {
    console.error('Error with', fp, e);
  }
}
