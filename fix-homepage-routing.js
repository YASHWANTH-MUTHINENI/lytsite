const fs = require('fs');
const path = require('path');

// Path to the homepage component
const homepageFile = path.join(__dirname, 'src', 'components', 'homepage.tsx');

console.log('🔧 Fixing homepage routing...');
console.log(`📁 File: ${homepageFile}`);

try {
  // Read the file
  let content = fs.readFileSync(homepageFile, 'utf8');
  
  console.log('📖 Original file read successfully');
  
  // Track changes
  let changeCount = 0;
  
  // Replace all navigate() calls with window.location.href
  content = content.replace(/onClick=\{\(\) => navigate\('([^']+)'\)\}/g, (match, route) => {
    changeCount++;
    console.log(`🔄 Replacing: navigate('${route}') → window.location.href = '${route}'`);
    return `onClick={() => window.location.href = '${route}'}`;
  });
  
  // Also handle the case where navigate() might be in different formats
  content = content.replace(/navigate\('([^']+)'\)/g, (match, route) => {
    changeCount++;
    console.log(`🔄 Replacing: navigate('${route}') → window.location.href = '${route}'`);
    return `window.location.href = '${route}'`;
  });
  
  // Remove the useNavigate import if it exists
  if (content.includes('useNavigate')) {
    content = content.replace(/import \{ useNavigate \} from "react-router-dom";\n/, '');
    content = content.replace(/,\s*useNavigate/, '');
    content = content.replace(/useNavigate,\s*/, '');
    content = content.replace(/from "react-router-dom"/, 'from "react-router-dom"').replace(/import \{[^}]*useNavigate[^}]*\}/, (match) => {
      return match.replace(/,?\s*useNavigate,?/, '').replace(/\{\s*,/, '{').replace(/,\s*\}/, '}');
    });
    console.log('🗑️  Removed useNavigate import');
  }
  
  // Remove the useNavigate hook declaration
  content = content.replace(/const navigate = useNavigate\(\);\n/g, '');
  
  // Write the file back
  fs.writeFileSync(homepageFile, content, 'utf8');
  
  console.log(`✅ Successfully updated ${changeCount} navigation calls`);
  console.log('🎉 Homepage routing fixed!');
  console.log('');
  console.log('📋 Changes made:');
  console.log('   • Removed useNavigate import from react-router-dom');
  console.log('   • Removed useNavigate hook declaration');
  console.log(`   • Replaced ${changeCount} navigate() calls with window.location.href`);
  console.log('');
  console.log('🚀 You can now build and deploy the standalone version!');
  
} catch (error) {
  console.error('❌ Error fixing homepage routing:', error.message);
  process.exit(1);
}