import { customAlphabet } from 'nanoid';
import { checkCodeExists } from './airtable';

// Characters that are easy to distinguish (no 0/O, 1/I)
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Create nanoid generator with custom alphabet and 8-character length
const generateCode = customAlphabet(CODE_ALPHABET, 8);

export function generateSecureCode(): string {
  return generateCode();
}

export async function generateUniqueCode(maxAttempts: number = 10): Promise<string> {
  console.log(`[generateUniqueCode] Starting code generation (max attempts: ${maxAttempts})`);
  
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateSecureCode();
    console.log(`[generateUniqueCode] Attempt ${i + 1}/${maxAttempts}: Generated code: ${code}`);
    
    const exists = await checkCodeExists(code);
    console.log(`[generateUniqueCode] Code ${code} exists: ${exists}`);
    
    if (!exists) {
      console.log(`[generateUniqueCode] Unique code found: ${code}`);
      return code;
    }
    
    console.log(`[generateUniqueCode] Code ${code} already exists, trying again...`);
  }
  
  console.error(`[generateUniqueCode] Failed to generate unique code after ${maxAttempts} attempts`);
  throw new Error(`Failed to generate unique code after ${maxAttempts} attempts`);
}


