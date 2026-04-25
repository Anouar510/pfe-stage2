const fs=require('fs');
let fp = 'src/pages/admin.jsx';
let t = fs.readFileSync(fp, 'utf8');
t = t.replace(/window\.confirm\(".*tes-vous sûr de vouloir supprimer cet utilisateur \?"\)/g, 'window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")');
t = t.replace(/<th>R.*LE<\/th>/g, '<th>RÔLE</th>');
fs.writeFileSync(fp, t, 'utf8');
console.log('done');
