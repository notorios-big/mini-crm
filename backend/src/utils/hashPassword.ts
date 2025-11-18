import bcrypt from 'bcryptjs';

// Utility to generate password hash
// Usage: ts-node src/utils/hashPassword.ts
async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
}

// Generate hash for "admin123"
hashPassword('admin123');
