const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/SellBook.jsx',
  'src/pages/Profile.jsx',
  'src/pages/Home.jsx',
  'src/pages/Cart.jsx',
  'src/pages/BookDetails.jsx',
  'src/pages/admin/Inventory.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/context/AuthContext.jsx'
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace axios import with api import
  // But depending on file, the path back to src/api.js is different.
  // src/pages/ -> ../api
  // src/pages/admin/ -> ../../api
  // src/context/ -> ../api
  
  const depth = file.split('/').length - 2;
  const relativePathToApi = depth === 1 ? '../api' : (depth === 2 ? '../../api' : './api');
  
  content = content.replace(/import axios from ['"]axios['"];?/g, `import api from '${relativePathToApi}';`);
  
  // Replace references to axios.get/post/put/delete with api.get/post/put/delete
  content = content.replace(/axios\./g, 'api.');
  
  // Replace http://localhost:5000 with empty string
  content = content.replace(/http:\/\/localhost:5000/g, '');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
