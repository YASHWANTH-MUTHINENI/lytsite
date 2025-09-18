/**
 * Password utility functions for secure password hashing and verification
 * Used for file/project password protection feature
 */

/**
 * Hash a password using Web Crypto API (bcrypt-compatible in Cloudflare Workers)
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  // Generate a random salt (16 bytes)
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Convert password to bytes
  const passwordBytes = new TextEncoder().encode(plainPassword);
  
  // Import the password as a key for PBKDF2
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive a key using PBKDF2 with 100,000 iterations (recommended for security)
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    256 // 32 bytes = 256 bits
  );
  
  // Combine salt and derived key
  const hashBuffer = new Uint8Array(salt.length + derivedKey.byteLength);
  hashBuffer.set(salt, 0);
  hashBuffer.set(new Uint8Array(derivedKey), salt.length);
  
  // Convert to base64 for storage
  const hashBase64 = btoa(String.fromCharCode(...hashBuffer));
  
  // Return with algorithm prefix for identification
  return `pbkdf2_sha256$100000$${hashBase64}`;
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    // Check if password is already hashed
    if (!hashedPassword.startsWith('pbkdf2_sha256$')) {
      // Legacy plain text password - compare directly but mark for upgrade
      console.warn('Plain text password detected - should be upgraded to hashed password');
      return plainPassword === hashedPassword;
    }
    
    // Parse the hash format: pbkdf2_sha256$iterations$salt_and_hash_base64
    const parts = hashedPassword.split('$');
    if (parts.length !== 3) {
      console.error('Invalid password hash format');
      return false;
    }
    
    const iterations = parseInt(parts[1]);
    const saltAndHashBase64 = parts[2];
    
    // Decode from base64
    const saltAndHash = new Uint8Array(
      atob(saltAndHashBase64).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract salt (first 16 bytes) and hash (remaining bytes)
    const salt = saltAndHash.slice(0, 16);
    const storedHash = saltAndHash.slice(16);
    
    // Hash the provided password with the same salt and iterations
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
    
    // Compare the derived key with the stored hash
    const computedHash = new Uint8Array(derivedKey);
    
    // Constant-time comparison to prevent timing attacks
    if (computedHash.length !== storedHash.length) {
      return false;
    }
    
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

/**
 * Check if a password needs to be upgraded from plain text to hashed
 */
export function needsPasswordUpgrade(password: string): boolean {
  return !password.startsWith('pbkdf2_sha256$');
}

/**
 * Generate a secure random password for auto-generated passwords
 */
export function generateSecurePassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const array = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}