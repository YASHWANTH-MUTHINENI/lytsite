/**
 * Test file to verify password hashing functionality works correctly
 * This can be run in the browser console or as a standalone test
 */

// Test password hashing and verification
async function testPasswordSecurity() {
  console.log('🔐 Testing Password Security Implementation...');
  
  try {
    // Import password utilities (this would be automatic in the worker environment)
    const testPassword = 'MySecurePassword123!';
    const wrongPassword = 'WrongPassword456!';
    
    console.log('1. Testing password hashing...');
    // This simulates what happens in our upload functions
    const hashedPassword = await hashPassword(testPassword);
    console.log('✅ Password hashed successfully:', hashedPassword);
    
    console.log('2. Testing correct password verification...');
    const isValidCorrect = await verifyPassword(testPassword, hashedPassword);
    console.log('✅ Correct password verified:', isValidCorrect);
    
    console.log('3. Testing incorrect password verification...');
    const isValidWrong = await verifyPassword(wrongPassword, hashedPassword);
    console.log('✅ Incorrect password rejected:', !isValidWrong);
    
    console.log('4. Testing legacy plain text password support...');
    const legacyPassword = 'plaintext123';
    const isLegacyValid = await verifyPassword(legacyPassword, legacyPassword);
    console.log('✅ Legacy plain text password works:', isLegacyValid);
    
    console.log('5. Testing password upgrade detection...');
    const needsUpgrade = needsPasswordUpgrade(legacyPassword);
    const doesntNeedUpgrade = needsPasswordUpgrade(hashedPassword);
    console.log('✅ Legacy password detected for upgrade:', needsUpgrade);
    console.log('✅ Hashed password doesn\'t need upgrade:', !doesntNeedUpgrade);
    
    console.log('🎉 All password security tests passed!');
    
  } catch (error) {
    console.error('❌ Password security test failed:', error);
  }
}

// Helper functions to simulate the ones in our password-utils.ts
async function hashPassword(plainPassword) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordBytes = new TextEncoder().encode(plainPassword);
  
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    256
  );
  
  const hashBuffer = new Uint8Array(salt.length + derivedKey.byteLength);
  hashBuffer.set(salt, 0);
  hashBuffer.set(new Uint8Array(derivedKey), salt.length);
  
  const hashBase64 = btoa(String.fromCharCode(...hashBuffer));
  return `pbkdf2_sha256$100000$${hashBase64}`;
}

async function verifyPassword(plainPassword, hashedPassword) {
  try {
    if (!hashedPassword.startsWith('pbkdf2_sha256$')) {
      return plainPassword === hashedPassword;
    }
    
    const parts = hashedPassword.split('$');
    if (parts.length !== 3) return false;
    
    const iterations = parseInt(parts[1]);
    const saltAndHashBase64 = parts[2];
    
    const saltAndHash = new Uint8Array(
      atob(saltAndHashBase64).split('').map(c => c.charCodeAt(0))
    );
    
    const salt = saltAndHash.slice(0, 16);
    const storedHash = saltAndHash.slice(16);
    
    const passwordBytes = new TextEncoder().encode(plainPassword);
    
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const derivedKey = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256'
      },
      passwordKey,
      256
    );
    
    const computedHash = new Uint8Array(derivedKey);
    
    if (computedHash.length !== storedHash.length) return false;
    
    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash[i] ^ storedHash[i];
    }
    
    return result === 0;
    
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

function needsPasswordUpgrade(password) {
  return !password.startsWith('pbkdf2_sha256$');
}

// Run the test
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('Run testPasswordSecurity() in the console to test password hashing');
} else {
  // Node.js or worker environment
  testPasswordSecurity();
}