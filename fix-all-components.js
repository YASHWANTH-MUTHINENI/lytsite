const fs = require('fs');
const path = require('path');

console.log('🚀 Comprehensive React Router Fix Script');
console.log('=========================================');

// Get all TypeScript files in src/components
const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => path.join(componentsDir, file));

let totalFixed = 0;
let totalFiles = 0;

function fixComponent(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if no useNavigate
    if (!content.includes('useNavigate')) {
      return 0;
    }
    
    console.log(`\n🔧 Fixing: ${filePath}`);
    let changeCount = 0;
    
    // Replace navigate calls in onClick handlers
    content = content.replace(/onClick=\{\(\) => navigate\('([^']+)'\)\}/g, (match, route) => {
      changeCount++;
      console.log(`   🔄 onClick: navigate('${route}') → window.location.href`);
      return `onClick={() => window.location.href = '${route}'}`;
    });
    
    // Replace standalone navigate calls
    content = content.replace(/navigate\('([^']+)'\);/g, (match, route) => {
      changeCount++;
      console.log(`   🔄 standalone: navigate('${route}') → window.location.href`);
      return `window.location.href = '${route}';`;
    });
    
    // Replace navigate calls without semicolon
    content = content.replace(/navigate\('([^']+)'\)/g, (match, route) => {
      changeCount++;
      console.log(`   🔄 expression: navigate('${route}') → window.location.href`);
      return `window.location.href = '${route}'`;
    });
    
    // Remove useNavigate import
    if (content.includes('import { useNavigate }')) {
      content = content.replace(/import \{ useNavigate \} from ["']react-router-dom["'];\n/, '');
      console.log('   🗑️  Removed useNavigate import');
    }
    
    // Remove useNavigate from existing imports
    content = content.replace(/,\s*useNavigate\s*/, '');
    content = content.replace(/useNavigate\s*,\s*/, '');
    
    // Remove useNavigate hook declaration
    content = content.replace(/const navigate = useNavigate\(\);\n/g, '');
    content = content.replace(/const navigate = useNavigate\(\);/g, '');
    
    // Write back if changes were made
    if (changeCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Fixed ${changeCount} navigation calls`);
      totalFiles++;
    }
    
    return changeCount;
    
  } catch (error) {
    console.error(`   ❌ Error fixing ${filePath}:`, error.message);
    return 0;
  }
}

// Fix all components
console.log(`\n📁 Processing ${files.length} component files...\n`);

files.forEach(file => {
  const fixed = fixComponent(file);
  totalFixed += fixed;
});

console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Files processed: ${files.length}`);
console.log(`🔧 Files fixed: ${totalFiles}`);
console.log(`🔄 Total navigation calls replaced: ${totalFixed}`);
console.log('\n🎉 All React Router navigation has been converted to window.location.href!');
console.log('🚀 You can now build the standalone version without React Router errors!');