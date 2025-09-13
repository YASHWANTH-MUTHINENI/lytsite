const fs = require('fs');
const path = require('path');

// List of components that need to be updated
const componentsToUpdate = [
  'templates-page.tsx',
  'client-delivery.tsx',
  'photo-gallery.tsx',
  'portfolio-resume.tsx',
  'event-template.tsx',
  'product-template.tsx',
  'case-study-template.tsx',
  'pitch-template.tsx',
  'universal-file-template.tsx',
  'backend-data-test.tsx',
  'faq-page.tsx',
  'blog-page.tsx',
  'blog-photographer-galleries.tsx',
  'blog-agency-delivery.tsx',
  'blog-sales-file-sharing.tsx',
  'privacy-policy.tsx',
  'terms-of-service.tsx',
  'terms-conditions.tsx',
  'refund-cancellation.tsx'
];

// Mapping of old page names to new routes
const routeMapping = {
  'homepage': '/',
  'templates-page': '/templates',
  'client-delivery': '/client-delivery',
  'photo-gallery': '/photo-gallery',
  'portfolio-resume': '/portfolio-resume',
  'event-template': '/event-template',
  'product-template': '/product-template',
  'case-study-template': '/case-study-template',
  'pitch-template': '/pitch-template',
  'universal-file-template': '/universal-file-template',
  'hero-examples': '/hero-examples',
  'backend-data-test': '/backend-data-test',
  'faq': '/faq',
  'blog': '/blog',
  'blog-photographer-client-galleries': '/blog/photographer-client-galleries',
  'blog-agency-delivery': '/blog/agency-delivery',
  'blog-sales-file-sharing': '/blog/sales-file-sharing',
  'privacy-policy': '/privacy-policy',
  'terms-of-service': '/terms-of-service',
  'terms-conditions': '/terms-conditions',
  'refund-cancellation': '/refund-cancellation',
  'about-us': '/about-us',
  'contact': '/contact'
};

function updateComponent(componentPath) {
  try {
    let content = fs.readFileSync(componentPath, 'utf8');
    const originalContent = content;
    
    console.log(`Updating ${componentPath}...`);
    
    // Add React Router import if not present
    if (!content.includes('useNavigate')) {
      content = content.replace(
        /import React.*?from ["']react["'];/,
        `import React from "react";\nimport { useNavigate } from "react-router-dom";`
      );
    }
    
    // Remove onNavigate from interface if present
    content = content.replace(/interface\s+\w+Props\s*{\s*onNavigate:\s*\([^)]*\)\s*=>\s*void;\s*}/g, '');
    
    // Update function signature to remove onNavigate prop
    content = content.replace(
      /export default function (\w+)\(\s*{\s*onNavigate\s*}:\s*\w+Props\s*\)/g,
      'export default function $1()'
    );
    
    // Add useNavigate hook
    if (content.includes('export default function') && !content.includes('const navigate = useNavigate()')) {
      content = content.replace(
        /(export default function \w+\(\) {)/,
        '$1\n  const navigate = useNavigate();'
      );
    }
    
    // Replace all onNavigate calls with navigate calls
    Object.entries(routeMapping).forEach(([oldRoute, newRoute]) => {
      const oldCall = `onNavigate('${oldRoute}')`;
      const newCall = `navigate('${newRoute}')`;
      content = content.replace(new RegExp(oldCall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCall);
    });
    
    // Handle generic onNavigate calls that might not match the mapping
    content = content.replace(/onNavigate\(([^)]+)\)/g, (match, route) => {
      // If it's a variable or expression, convert it to navigate with a slash prefix
      if (route.includes("'") || route.includes('"')) {
        const cleanRoute = route.replace(/['"]/g, '');
        const mappedRoute = routeMapping[cleanRoute] || `/${cleanRoute}`;
        return `navigate('${mappedRoute}')`;
      } else {
        return `navigate(\`/\${${route}}\`)`;
      }
    });
    
    // Handle onBack prop for blog components
    if (componentPath.includes('blog-agency-delivery')) {
      content = content.replace(
        /interface\s+\w+Props\s*{\s*onBack:\s*\([^)]*\)\s*=>\s*void;\s*}/g,
        ''
      );
      content = content.replace(
        /export default function (\w+)\(\s*{\s*onBack\s*}:\s*\w+Props\s*\)/g,
        'export default function $1()'
      );
      content = content.replace(/onBack\(\)/g, "navigate('/blog')");
    }
    
    // Remove any remaining onNavigate or onBack props from JSX
    content = content.replace(/\s*onNavigate=\{[^}]*\}/g, '');
    content = content.replace(/\s*onBack=\{[^}]*\}/g, '');
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(componentPath, content);
      console.log(`✅ Updated ${componentPath}`);
    } else {
      console.log(`⏭️  No changes needed for ${componentPath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${componentPath}:`, error.message);
  }
}

function updateHomepageComponent() {
  const homepagePath = path.join(__dirname, 'src', 'components', 'homepage.tsx');
  
  try {
    let content = fs.readFileSync(homepagePath, 'utf8');
    const originalContent = content;
    
    console.log('Updating homepage.tsx...');
    
    // Replace remaining onNavigate calls in homepage
    Object.entries(routeMapping).forEach(([oldRoute, newRoute]) => {
      const oldCall = `onNavigate('${oldRoute}')`;
      const newCall = `navigate('${newRoute}')`;
      content = content.replace(new RegExp(oldCall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCall);
    });
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(homepagePath, content);
      console.log(`✅ Updated homepage.tsx`);
    }
    
  } catch (error) {
    console.error(`❌ Error updating homepage.tsx:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting React Router migration...\n');
  
  const srcDir = path.join(__dirname, 'src', 'components');
  
  // Update all specified components
  componentsToUpdate.forEach(componentFile => {
    const componentPath = path.join(srcDir, componentFile);
    if (fs.existsSync(componentPath)) {
      updateComponent(componentPath);
    } else {
      console.log(`⚠️  Component not found: ${componentPath}`);
    }
  });
  
  // Update homepage with remaining fixes
  updateHomepageComponent();
  
  console.log('\n✅ React Router migration completed!');
  console.log('\nNext steps:');
  console.log('1. Run the app to test routing');
  console.log('2. Check for any remaining TypeScript errors');
  console.log('3. Update any missed navigation calls manually if needed');
}

main();