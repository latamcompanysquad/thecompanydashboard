const fs = require('fs');

const htmlPath = 'C:\\Users\\noege\\Documents\\LatamCompanyWeb\\files\\index.html';
const outputPath = 'C:\\Users\\noege\\Documents\\LatamCompanyWeb\\Gihub\\latamcompany-admin\\public\\logo.png';

const content = fs.readFileSync(htmlPath, 'utf8');
const match = content.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);

if (match && match[1]) {
  const buffer = Buffer.from(match[1], 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log('✅ Logo LATAM COMPANY guardado exitosamente en:', outputPath);
} else {
  console.error('❌ No se encontró el logo base64 en index.html');
}
