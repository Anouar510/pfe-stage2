const fs=require('fs');
let fp='src/pages/dashboard.jsx';
let c=fs.readFileSync(fp,'utf8');
c=c.replace(/ï¿½ï¿½/g, '.');
fs.writeFileSync(fp,c,'utf8');
console.log('done dash');
