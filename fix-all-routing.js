const fs = require('fs');

// Fix Navbar component
const navbarFile = 'src/components/Navbar.tsx';
console.log('🔧 Fixing Navbar routing...');

try {
  let content = fs.readFileSync(navbarFile, 'utf8');
  let changeCount = 0;
  
  // Replace navigate calls
  content = content.replace(/onClick=\{\(\) => navigate\('([^']+)'\)\}/g, (match, route) => {
    changeCount++;
    console.log(`🔄 Replacing: navigate('${route}') in onClick`);
    return `onClick={() => window.location.href = '${route}'}`;
  });
  
  content = content.replace(/navigate\('([^']+)'\)/g, (match, route) => {
    changeCount++;
    console.log(`🔄 Replacing: navigate('${route}')`);
    return `window.location.href = '${route}'`;
  });
  
  // Remove useNavigate import and hook
  content = content.replace(/import \{ useNavigate \} from "react-router-dom";\n/, '');
  content = content.replace(/const navigate = useNavigate\(\);\n/g, '');
  
  fs.writeFileSync(navbarFile, content, 'utf8');
  console.log(`✅ Fixed ${changeCount} navigation calls in Navbar`);
} catch (error) {
  console.error('❌ Error fixing Navbar:', error.message);
}

// Fix about-us component  
const aboutFile = 'src/components/about-us.tsx';
console.log('🔧 Fixing About Us routing...');

try {
  let content = fs.readFileSync(aboutFile, 'utf8');
  let changeCount = 0;
  
  content = content.replace(/onClick=\{\(\) => navigate\('([^']+)'\)\}/g, (match, route) => {
    changeCount++;
    console.log(`🔄 Replacing: navigate('${route}') in About Us`);
    return `onClick={() => window.location.href = '${route}'}`;
  });
  
  content = content.replace(/navigate\('([^']+)'\)/g, (match, route) => {
    changeCount++;
    return `window.location.href = '${route}'`;
  });
  
  content = content.replace(/import \{ useNavigate \} from "react-router-dom";\n/, '');
  content = content.replace(/const navigate = useNavigate\(\);\n/g, '');
  
  fs.writeFileSync(aboutFile, content, 'utf8');
  console.log(`✅ Fixed ${changeCount} navigation calls in About Us`);
} catch (error) {
  console.error('❌ Error fixing About Us:', error.message);
}

// Fix contact component
const contactFile = 'src/components/contact.tsx';
console.log('🔧 Fixing Contact routing...');

try {
  let content = fs.readFileSync(contactFile, 'utf8');
  let changeCount = 0;
  
  content = content.replace(/onClick=\{\(\) => navigate\('([^']+)'\)\}/g, (match, route) => {
    changeCount++;
    console.log(`🔄 Replacing: navigate('${route}') in Contact`);
    return `onClick={() => window.location.href = '${route}'}`;
  });
  
  content = content.replace(/navigate\('([^']+)'\)/g, (match, route) => {
    changeCount++;
    return `window.location.href = '${route}'`;
  });
  
  content = content.replace(/import \{ useNavigate \} from "react-router-dom";\n/, '');
  content = content.replace(/const navigate = useNavigate\(\);\n/g, '');
  
  fs.writeFileSync(contactFile, content, 'utf8');
  console.log(`✅ Fixed ${changeCount} navigation calls in Contact`);
} catch (error) {
  console.error('❌ Error fixing Contact:', error.message);
}

console.log('🎉 All components fixed!');