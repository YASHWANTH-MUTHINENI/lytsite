const fs = require('fs');
const path = require('path');

console.log('🧹 AGGRESSIVE React Router Cleanup Script');
console.log('==========================================');

// Get all TypeScript files in src/components
const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => path.join(componentsDir, file));

let totalFixed = 0;
let totalFiles = 0;

function aggressiveCleanup(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if no useNavigate
    if (!content.includes('useNavigate')) {
      return 0;
    }
    
    console.log(`\n🧹 Cleaning: ${filePath}`);
    let changeCount = 0;
    
    // Remove ALL forms of useNavigate imports
    const originalContent = content;
    
    // Remove standalone useNavigate import
    content = content.replace(/import \{ useNavigate \} from ["']react-router-dom["'];\n?/g, '');
    content = content.replace(/import \{ useNavigate \} from ['"]react-router-dom['"];\n?/g, '');
    
    // Remove useNavigate from multi-imports (with commas)
    content = content.replace(/import \{([^}]*),\s*useNavigate\s*([^}]*)\} from ["']react-router-dom["'];/g, 'import {$1$2} from "react-router-dom";');
    content = content.replace(/import \{\s*useNavigate\s*,([^}]*)\} from ["']react-router-dom["'];/g, 'import {$1} from "react-router-dom";');
    content = content.replace(/import \{([^}]*)\s*useNavigate\s*([^}]*)\} from ["']react-router-dom["'];/g, 'import {$1$2} from "react-router-dom";');
    
    // Remove empty imports
    content = content.replace(/import \{\s*\} from ["']react-router-dom["'];\n?/g, '');
    
    // Remove useNavigate hook declarations
    content = content.replace(/const navigate = useNavigate\(\);\n?/g, '');
    content = content.replace(/const navigate = useNavigate\(\);/g, '');
    content = content.replace(/let navigate = useNavigate\(\);\n?/g, '');
    content = content.replace(/let navigate = useNavigate\(\);/g, '');
    
    // Count changes
    if (content !== originalContent) {
      changeCount = 1;
      console.log('   🗑️  Removed all useNavigate references');
      
      fs.writeFileSync(filePath, content, 'utf8');
      totalFiles++;
    }
    
    return changeCount;
    
  } catch (error) {
    console.error(`   ❌ Error cleaning ${filePath}:`, error.message);
    return 0;
  }
}

// Clean all components
console.log(`\n📁 Processing ${files.length} component files...\n`);

files.forEach(file => {
  const fixed = aggressiveCleanup(file);
  totalFixed += fixed;
});

console.log('\n' + '='.repeat(50));
console.log('📊 CLEANUP SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Files processed: ${files.length}`);
console.log(`🧹 Files cleaned: ${totalFiles}`);
console.log('\n🎉 All useNavigate imports and declarations removed!');

// Now check if any files still have useNavigate
console.log('\n🔍 Checking for remaining useNavigate references...');
let remainingFiles = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('useNavigate')) {
      remainingFiles.push(file);
    }
  } catch (error) {
    console.error(`Error checking ${file}:`, error.message);
  }
});

if (remainingFiles.length > 0) {
  console.log('⚠️  WARNING: The following files still contain useNavigate:');
  remainingFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('✅ No remaining useNavigate references found!');
  console.log('🚀 Ready to build standalone version!');
}