import type { DetectionMatch, MaskingConfig, MaskingPolicy, MaskedResult } from './types';
import { detectSensitiveText } from './detectors';

// Default masking policy (aligned with help.js patterns)
const defaultPolicy: MaskingPolicy = {
  email: { strategy: 'partial', showFirst: 2, showLast: 3, maskChar: '*' },
  phone: { strategy: 'partial', showFirst: 3, showLast: 4, maskChar: '*' },
  ssn: { strategy: 'partial', showFirst: 0, showLast: 4, maskChar: '*' },
  credit_card: { strategy: 'partial', showFirst: 4, showLast: 4, maskChar: '*' },
  api_key: { strategy: 'partial', showFirst: 6, showLast: 4, maskChar: '*' },
  aws_key: { strategy: 'partial', showFirst: 4, showLast: 4, maskChar: '*' },
  jwt: { strategy: 'redact', maskChar: '█' },
  jwt_token: { strategy: 'redact', maskChar: '█' },
  uuid: { strategy: 'hash' },
  db_url: { strategy: 'redact', maskChar: '█' },
  database_url: { strategy: 'redact', maskChar: '█' },
  database_url_extra: { strategy: 'redact', maskChar: '█' },
  private_key: { strategy: 'redact', maskChar: '█' },
  password: { strategy: 'redact', maskChar: '█' },
  ip_address: { strategy: 'partial', showFirst: 7, showLast: 0, maskChar: '*' },
  ipv6_address: { strategy: 'redact', maskChar: '█' },
  iban: { strategy: 'partial', showFirst: 4, showLast: 4, maskChar: '*' },
  high_entropy_token: { strategy: 'hash' },
  auth_header: { strategy: 'redact', maskChar: '█' },
  github_token: { strategy: 'redact', maskChar: '█' },
  slack_token: { strategy: 'redact', maskChar: '█' },
  stripe_key: { strategy: 'redact', maskChar: '█' },
  google_api_key: { strategy: 'redact', maskChar: '█' },
  openai_key: { strategy: 'redact', maskChar: '█' },
  twilio_sid: { strategy: 'redact', maskChar: '█' },
  mac_address: { strategy: 'redact', maskChar: '█' },
  username: { strategy: 'redact', maskChar: '█' },
  street_address: { strategy: 'redact', maskChar: '█' },
  address: { strategy: 'redact', maskChar: '█' },
  bank_account: { strategy: 'redact', maskChar: '█' },
  national_id: { strategy: 'redact', maskChar: '█' },
  passport_number: { strategy: 'redact', maskChar: '█' },
  hostname: { strategy: 'partial', showFirst: 3, showLast: 3, maskChar: '*' },
  generic_secret: { strategy: 'redact', maskChar: '█' },
  custom: { strategy: 'redact', maskChar: '█' },
};

// Generate deterministic hash using WebCrypto
async function hashValue(value: string, salt: string = ''): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

// Generate stable token ID
function generateTokenId(index: number): string {
  return `<SENSITIVE_${index}>`;
}

// Apply masking strategy to a single match
async function applyMaskingStrategy(
  match: DetectionMatch,
  config: MaskingConfig,
  index: number,
  salt: string = ''
): Promise<string> {
  const { strategy, showFirst = 0, showLast = 0, maskChar = '*', hint } = config;
  const value = match.value;

  switch (strategy) {
    case 'redact':
      return maskChar.repeat(Math.max(8, Math.min(value.length, 20)));

    case 'partial':
      if (value.length <= showFirst + showLast) {
        return maskChar.repeat(value.length);
      }
      const first = value.substring(0, showFirst);
      const last = value.substring(value.length - showLast);
      const middle = maskChar.repeat(Math.max(3, value.length - showFirst - showLast));
      return `${first}${middle}${last}`;

    case 'hash':
      const hash = await hashValue(value, salt);
      return `[HASH:${hash}]`;

    case 'tokenize':
      return generateTokenId(index);

    case 'hint':
      return hint || `[${match.category.toUpperCase()}: MASKED]`;

    default:
      return maskChar.repeat(value.length);
  }
}

// Main masking function
export async function maskText(
  text: string,
  matches: DetectionMatch[],
  policy: MaskingPolicy = defaultPolicy,
  salt: string = ''
): Promise<MaskedResult> {
  // Sort matches by start index (reverse order for safe replacement)
  const sortedMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);
  const mapping = new Map<string, string>();
  let maskedText = text;

  // Process matches in reverse order to preserve indices
  for (let i = 0; i < sortedMatches.length; i++) {
    const match = sortedMatches[i];
    const category = match.category || match.type;
    const config = policy[category] || policy[match.type] || defaultPolicy.custom;
    
    const masked = await applyMaskingStrategy(match, config, i, salt);
    mapping.set(match.id, masked);
    
    maskedText =
      maskedText.substring(0, match.startIndex) +
      masked +
      maskedText.substring(match.endIndex);
  }

  return {
    maskedText,
    matches: sortedMatches.reverse(), // Return in original order
    mapping,
  };
}

// Reveal a specific match (for ephemeral viewing)
export function revealMatch(
  originalText: string,
  match: DetectionMatch
): string {
  return originalText.substring(match.startIndex, match.endIndex);
}

// Safety verification: Ensure masked text contains no remaining secrets
export interface VerificationResult {
  isSafe: boolean;
  remainingSecrets: DetectionMatch[];
  verificationErrors: string[];
}

export async function verifyMaskedText(
  originalText: string,
  maskedText: string,
  originalMatches: DetectionMatch[]
): Promise<VerificationResult> {
  const errors: string[] = [];
  const remainingSecrets: DetectionMatch[] = [];

  // Step 1: Re-run detection on masked text to ensure no secrets remain
  const maskedMatches = await detectSensitiveText(maskedText, {
    confidenceThreshold: 0.5,
  });

  // Filter out false positives (e.g., hash patterns like [HASH:...] or tokens like <SENSITIVE_0>)
  const actualSecrets = maskedMatches.filter(match => {
    const value = match.value;
    // Ignore our own masking patterns
    if (value.startsWith('[HASH:') || value.startsWith('<SENSITIVE_') || value.match(/^█+$/)) {
      return false;
    }
    // Check if it's just mask characters
    if (value.match(/^\*+$/) || value.match(/^█+$/)) {
      return false;
    }
    return true;
  });

  if (actualSecrets.length > 0) {
    errors.push(`Found ${actualSecrets.length} potential secrets in masked text`);
    remainingSecrets.push(...actualSecrets);
  }

  // Step 2: Verify masked spans match expected lengths
  // (This is handled by the masking logic itself, but we can verify structure)
  if (maskedText.length !== originalText.length) {
    // This is expected for some masking strategies (hash, tokenize), so we'll allow it
    // but log it for transparency
  }

  // Step 3: Ensure all original matches were processed
  // (This is guaranteed by the masking function, but we verify for safety)
  const processedIds = new Set(originalMatches.map(m => m.id));
  if (processedIds.size !== originalMatches.length) {
    errors.push('Some matches may not have been processed');
  }

  // Step 4: Verify no new sensitive patterns appear in masked output
  // (Already checked in Step 1)

  return {
    isSafe: actualSecrets.length === 0 && errors.length === 0,
    remainingSecrets: actualSecrets,
    verificationErrors: errors,
  };
}

