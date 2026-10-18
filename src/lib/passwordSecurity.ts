// src/lib/passwordSecurity.ts
// Enterprise-grade password security validator, entropy evaluator, and brute-force protector.

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  noCommonPattern: boolean;
  noPersonalInfo: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 (very weak) to 4 (hardened)
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Hardened';
  color: string;
  requirements: PasswordRequirements;
  errors: string[];
}

// Blacklist of commonly breached, default, or easily guessable passwords & cultural words
const COMMON_PASSWORDS = new Set([
  'password', 'password123', 'admin', 'admin123', 'qwerty', 'qwerty123',
  '123456', '12345678', '123456789', '1234567890', '111111', '000000',
  'welcome', 'welcome123', 'tunisia', 'tunisie', 'tunis123', 'carthage',
  'sidibousaid', 'photography', 'photographer', 'lens123', 'camera123',
  'master', 'secret', 'pass123', 'iloveyou', 'sunshine', 'football',
  'login123', 'secure123', 'creative', 'client123', 'testing123'
]);

/**
 * Validates a password against rigorous security standards.
 * Requirements:
 * - At least 10 characters long
 * - Contains at least one uppercase letter (A-Z)
 * - Contains at least one lowercase letter (a-z)
 * - Contains at least one digit (0-9)
 * - Contains at least one symbol (!@#$%^&*...)
 * - Not in common dictionary / leak blacklist
 * - Does not contain username or email prefix
 */
export function validatePassword(
  password: string,
  userInfo?: { email?: string; name?: string }
): PasswordValidationResult {
  const pwd = password || '';

  const requirements: PasswordRequirements = {
    minLength: pwd.length >= 10,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`§±]/.test(pwd),
    noCommonPattern: true,
    noPersonalInfo: true,
  };

  const errors: string[] = [];
  const lowerPwd = pwd.toLowerCase().trim();

  // 1. Check length
  if (!requirements.minLength) {
    errors.push('Password must be at least 10 characters long.');
  }

  // 2. Check uppercase
  if (!requirements.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter (A-Z).');
  }

  // 3. Check lowercase
  if (!requirements.hasLowercase) {
    errors.push('Password must contain at least one lowercase letter (a-z).');
  }

  // 4. Check numbers
  if (!requirements.hasNumber) {
    errors.push('Password must contain at least one numeric digit (0-9).');
  }

  // 5. Check symbols
  if (!requirements.hasSpecialChar) {
    errors.push('Password must contain at least one special character (!@#$%^&*...).');
  }

  // 6. Check common blacklist & simple sequences
  if (COMMON_PASSWORDS.has(lowerPwd) || /(.)\1{3,}/.test(pwd) || /12345|abcdef|qwerty/.test(lowerPwd)) {
    requirements.noCommonPattern = false;
    errors.push('Password contains common or easily guessable patterns.');
  }

  // 7. Check personal info (name or email prefix)
  if (userInfo) {
    if (userInfo.email) {
      const emailPrefix = userInfo.email.split('@')[0].toLowerCase();
      if (emailPrefix.length >= 3 && lowerPwd.includes(emailPrefix)) {
        requirements.noPersonalInfo = false;
        errors.push('Password cannot contain your email username.');
      }
    }

    if (userInfo.name) {
      const nameParts = userInfo.name.toLowerCase().split(/\s+/).filter(part => part.length >= 3);
      for (const part of nameParts) {
        if (lowerPwd.includes(part)) {
          requirements.noPersonalInfo = false;
          errors.push('Password cannot contain your name.');
          break;
        }
      }
    }
  }

  // Calculate score (0 to 4)
  let score = 0;
  if (pwd.length >= 10) score += 1;
  if (pwd.length >= 14) score += 1;
  if (requirements.hasUppercase && requirements.hasLowercase) score += 1;
  if (requirements.hasNumber && requirements.hasSpecialChar) score += 1;

  if (!requirements.noCommonPattern || !requirements.noPersonalInfo) {
    score = Math.max(0, score - 2);
  }

  // Labels & Colors
  let label: PasswordValidationResult['label'] = 'Very Weak';
  let color = '#EF4444'; // Red

  switch (score) {
    case 0:
    case 1:
      label = pwd.length > 0 ? 'Weak' : 'Very Weak';
      color = '#EF4444'; // Red
      break;
    case 2:
      label = 'Fair';
      color = '#F59E0B'; // Amber
      break;
    case 3:
      label = 'Strong';
      color = '#10B981'; // Emerald
      break;
    case 4:
      label = 'Hardened';
      color = '#D99B56'; // Archival Desert Ochre
      break;
  }

  const isValid =
    requirements.minLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasNumber &&
    requirements.hasSpecialChar &&
    requirements.noCommonPattern &&
    requirements.noPersonalInfo;

  return {
    isValid,
    score,
    label,
    color,
    requirements,
    errors,
  };
}

/**
 * Generates a cryptographically secure, high-entropy hardened password (16 characters)
 * using window.crypto.getRandomValues.
 */
export function generateHardenedPassword(length = 16): string {
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude I, O for clarity
  const lowers = 'abcdefghijkmnopqrstuvwxyz'; // exclude l for clarity
  const numbers = '23456789'; // exclude 0, 1 for clarity
  const symbols = '!@#$%^&*-_=+';
  const allChars = uppers + lowers + numbers + symbols;

  // Ensure at least 2 of each class
  const pickRandom = (set: string) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return set[array[0] % set.length];
  };

  const pwdChars = [
    pickRandom(uppers),
    pickRandom(uppers),
    pickRandom(lowers),
    pickRandom(lowers),
    pickRandom(numbers),
    pickRandom(numbers),
    pickRandom(symbols),
    pickRandom(symbols),
  ];

  while (pwdChars.length < length) {
    pwdChars.push(pickRandom(allChars));
  }

  // Cryptographic shuffle (Fisher-Yates)
  for (let i = pwdChars.length - 1; i > 0; i--) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const j = array[0] % (i + 1);
    const temp = pwdChars[i];
    pwdChars[i] = pwdChars[j];
    pwdChars[j] = temp;
  }

  return pwdChars.join('');
}

// --- Brute-force & Rate Limiting Protection (Client-side & Session Storage) ---
const LOCKOUT_KEY = 'tunisian_lens_auth_lockouts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds cooling period

interface LockoutRecord {
  attempts: number;
  lockedUntil: number | null;
}

function getLockouts(): Record<string, LockoutRecord> {
  try {
    return JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLockouts(lockouts: Record<string, LockoutRecord>) {
  try {
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(lockouts));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Checks if an email is currently locked out due to multiple failed login attempts.
 */
export function checkLoginAttempts(email: string): { isLocked: boolean; remainingLockoutSeconds: number } {
  if (!email) return { isLocked: false, remainingLockoutSeconds: 0 };
  const lockouts = getLockouts();
  const record = lockouts[email.toLowerCase().trim()];

  if (!record || !record.lockedUntil) {
    return { isLocked: false, remainingLockoutSeconds: 0 };
  }

  const now = Date.now();
  if (now < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingLockoutSeconds: remaining };
  }

  // Lockout expired, reset attempts
  delete lockouts[email.toLowerCase().trim()];
  saveLockouts(lockouts);
  return { isLocked: false, remainingLockoutSeconds: 0 };
}

/**
 * Records a failed login attempt and locks account if threshold exceeded.
 */
export function recordFailedAttempt(email: string): { attempts: number; isLocked: boolean; remainingLockoutSeconds: number } {
  if (!email) return { attempts: 0, isLocked: false, remainingLockoutSeconds: 0 };
  const key = email.toLowerCase().trim();
  const lockouts = getLockouts();
  const record: LockoutRecord = lockouts[key] || { attempts: 0, lockedUntil: null };

  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    lockouts[key] = record;
    saveLockouts(lockouts);
    return { attempts: record.attempts, isLocked: true, remainingLockoutSeconds: 60 };
  }

  lockouts[key] = record;
  saveLockouts(lockouts);
  return { attempts: record.attempts, isLocked: false, remainingLockoutSeconds: 0 };
}

/**
 * Resets login attempts upon successful authentication.
 */
export function resetLoginAttempts(email: string): void {
  if (!email) return;
  const key = email.toLowerCase().trim();
  const lockouts = getLockouts();
  if (lockouts[key]) {
    delete lockouts[key];
    saveLockouts(lockouts);
  }
}
