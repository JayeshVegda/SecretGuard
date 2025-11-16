import type { DetectionMatch, SensitiveDataType, CustomPattern, DetectionOptions } from './types';

// Utility: Calculate Shannon entropy
function calculateEntropy(str: string): number {
  const freq: Record<string, number> = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

// Luhn algorithm for credit card validation
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

// Email detector
function detectEmails(text: string): DetectionMatch[] {
  const patterns = [
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, // Standard email
    /\b[a-zA-Z0-9._%+-]*[*█]{4,}[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, // Partially masked email
    /\b[*]?[a-zA-Z0-9._%+-]+[*█]{4,}[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, // Masked email
    /(?:email|e-mail|mail)\s*[=:]\s*['"]?([*█]?[a-zA-Z0-9._%+-]+[*█]{4,}[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})['"]?/gi, // Labeled masked email
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `email-${match.index}`,
        type: 'email',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.95,
        category: 'email',
      });
    }
  }
  return matches;
}

// Phone number detector (E.164 and US formats)
function detectPhones(text: string): DetectionMatch[] {
  const patterns = [
    /\b\+?[1-9]\d{1,14}\b/g, // E.164
    /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, // US formats
    /\b(?:phone|mobile|tel)\s*[=:]\s*['"]?([+*█]?\d{1,3}[-.\s]?[*█]{4,}\d{4})['"]?/gi, // Partially masked phone
    /\b([+*█]?\d{1,3}[-.\s]?[*█]{4,}\d{4})\b/g, // Standalone masked phone
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      // For masked phones, accept as-is; for regular phones, validate length
      if (value.match(/[*█]/)) {
        matches.push({
          id: `phone-${match.index}`,
          type: 'phone',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.9,
          category: 'phone',
        });
      } else {
        const digits = value.replace(/\D/g, '');
        if (digits.length >= 10 && digits.length <= 15) {
          matches.push({
            id: `phone-${match.index}`,
            type: 'phone',
            value: value,
            startIndex: match.index + (match[0].indexOf(value) || 0),
            endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
            confidence: 0.9,
            category: 'phone',
          });
        }
      }
    }
  }
  return matches;
}

// SSN detector (US format - enhanced from help.js)
function detectSSNs(text: string): DetectionMatch[] {
  const patterns = [
    /\b\d{3}-\d{2}-\d{4}\b/g, // Formatted SSN
    /\b\d{9}\b/g, // Unformatted 9-digit SSN
  ];
  const matches: DetectionMatch[] = [];
  
  // Formatted SSN
  let match;
  while ((match = patterns[0].exec(text)) !== null) {
    // Exclude obvious non-SSNs (000-xx-xxxx, xxx-00-xxxx, xxx-xx-0000)
    const parts = match[0].split('-');
    if (parts[0] !== '000' && parts[1] !== '00' && parts[2] !== '0000') {
      matches.push({
        id: `ssn-${match.index}`,
        type: 'ssn',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.9,
        category: 'ssn',
      });
    }
  }
  
  // Unformatted 9-digit SSN (only if not already matched as part of a larger number)
  while ((match = patterns[1].exec(text)) !== null) {
    // Check if it's not part of a credit card or other number
    const before = text.substring(Math.max(0, match.index - 1), match.index);
    const after = text.substring(match.index + 9, match.index + 10);
    if (!/\d/.test(before) && !/\d/.test(after)) {
      matches.push({
        id: `ssn-${match.index}`,
        type: 'ssn',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.8,
        category: 'ssn',
      });
    }
  }
  
  return matches;
}

// Credit card detector with Luhn check (enhanced from help.js - supports 13-19 digits)
function detectCreditCards(text: string): DetectionMatch[] {
  const pattern = /\b(?:\d[ -]?){13,19}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const digits = match[0].replace(/[^0-9]/g, '');
    if (digits.length >= 13 && digits.length <= 19 && luhnCheck(digits)) {
      matches.push({
        id: `cc-${match.index}`,
        type: 'credit_card',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.95,
        category: 'credit_card',
      });
    }
  }
  return matches;
}

// UUID detector
function detectUUIDs(text: string): DetectionMatch[] {
  const pattern = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `uuid-${match.index}`,
      type: 'uuid',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.98,
      category: 'uuid',
    });
  }
  return matches;
}

// AWS Access Key ID detector (enhanced from help.js)
function detectAWSKeys(text: string): DetectionMatch[] {
  const patterns = [
    /\b(AKIA|A3T|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g, // Access Key ID variants
    /\b[A-Za-z0-9\/+=]{40}\b/g, // Secret Access Key (base64 encoded, exactly 40 chars)
    /\b(?:aws\s+secret|aws_secret_access_key)\s*[=:]\s*['"]?([a-zA-Z0-9_][*█]{20,}[a-zA-Z0-9_]{4,})['"]?/gi, // Partially masked secret
  ];
  const matches: DetectionMatch[] = [];
  let match;
  
  // Access Key ID variants
  while ((match = patterns[0].exec(text)) !== null) {
    matches.push({
      id: `aws-key-${match.index}`,
      type: 'aws_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.95,
      category: 'aws_key',
    });
  }
  
  // Secret Access Key (base64 encoded, exactly 40 chars)
  while ((match = patterns[1].exec(text)) !== null) {
    matches.push({
      id: `aws-secret-${match.index}`,
      type: 'aws_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.9,
      category: 'aws_key',
    });
  }
  
  // Partially masked AWS secret
  while ((match = patterns[2].exec(text)) !== null) {
    matches.push({
      id: `aws-secret-masked-${match.index}`,
      type: 'aws_key',
      value: match[1],
      startIndex: match.index + match[0].indexOf(match[1]),
      endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
      confidence: 0.9,
      category: 'aws_key',
    });
  }
  
  return matches;
}

// Generic API key detector (enhanced from help.js)
function detectAPIKeys(text: string): DetectionMatch[] {
  const patterns = [
    /\bsk_(?:live|test)_[A-Za-z0-9]{24,}\b/g, // Stripe keys
    /\bsk-[A-Za-z0-9]{32,48}\b/g, // OpenAI keys
    /\bxox[abpse]-[A-Za-z0-9-]{10,}\b/g, // Slack tokens
    /\bAC[0-9a-fA-F]{32}\b/g, // Twilio SID
    /(?:^|[^.])\b(?=[A-Za-z0-9_-]{32,}\b)(?=.*\d)(?=.*[_-])([A-Za-z0-9_-]+)\b/g, // Generic API key pattern
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      let category = 'api_key';
      
      // Classify specific types
      if (value.startsWith('sk_live_') || value.startsWith('sk_test_')) {
        category = 'stripe_key';
      } else if (value.startsWith('sk-') && value.length >= 32 && value.length <= 48) {
        category = 'openai_key';
      } else if (value.startsWith('xox')) {
        category = 'slack_token';
      } else if (/^AC[0-9a-fA-F]{32}$/i.test(value)) {
        category = 'twilio_sid';
      }
      
      matches.push({
        id: `api-key-${match.index}`,
        type: category as any,
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.9,
        category: category,
      });
    }
  }
  return matches;
}

// JWT detector
function detectJWTs(text: string): DetectionMatch[] {
  const pattern = /\beyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const parts = match[0].split('.');
    if (parts.length >= 2) {
      try {
        // Try to decode header (basic validation)
        // Use Buffer in Node.js, atob in browser
        let decoded: string;
        if (typeof Buffer !== 'undefined') {
          decoded = Buffer.from(parts[0].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
        } else {
          decoded = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        }
        JSON.parse(decoded);
        matches.push({
          id: `jwt-${match.index}`,
          type: 'jwt',
          value: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.9,
          category: 'jwt',
        });
      } catch {
        // Invalid JWT format
      }
    }
  }
  return matches;
}

// Database URL detector (enhanced from help.js)
function detectDBUrls(text: string): DetectionMatch[] {
  const patterns = [
    /(postgres|mysql|mongodb|redis):\/\/[^\s'\"]+/gi,
    /\bjdbc:(postgresql|mysql|mariadb|sqlserver|oracle|sqlite):[^\s'\"]+/gi,
    /(mssql|oracle|cockroach|sqlite|snowflake):\/\/[^\s'\"]+/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const category = pattern.source.includes('jdbc:') ? 'database_url_extra' : 
                       pattern.source.includes('mssql|oracle') ? 'database_url_extra' : 'database_url';
      matches.push({
        id: `db-url-${match.index}`,
        type: category as any,
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.95,
        category: category,
      });
    }
  }
  return matches;
}

// Private key detector (PEM format)
function detectPrivateKeys(text: string): DetectionMatch[] {
  const pattern = /-----BEGIN\s+(RSA|EC|OPENSSH|PRIVATE)\s+KEY-----[A-Za-z0-9+\/=\s]+-----END\s+(RSA|EC|OPENSSH|PRIVATE)\s+KEY-----/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `private-key-${match.index}`,
      type: 'private_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.98,
      category: 'private_key',
    });
  }
  return matches;
}

// IP address detector
function detectIPAddresses(text: string): DetectionMatch[] {
  const pattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    // Exclude common non-sensitive IPs
    if (!match[0].startsWith('127.') && !match[0].startsWith('192.168.') && !match[0].startsWith('10.')) {
      matches.push({
        id: `ip-${match.index}`,
        type: 'ip_address',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.7,
        category: 'ip_address',
      });
    }
  }
  return matches;
}

// High entropy token detector
function detectHighEntropyTokens(text: string): DetectionMatch[] {
  const pattern = /\b[a-zA-Z0-9+/=]{24,}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const entropy = calculateEntropy(match[0]);
    if (entropy > 4.5) {
      matches.push({
        id: `entropy-${match.index}`,
        type: 'high_entropy_token',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.8,
        category: 'high_entropy_token',
      });
    }
  }
  return matches;
}

// IPv6 address detector
function detectIPv6Addresses(text: string): DetectionMatch[] {
  const pattern = /\b(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|:(?::[0-9A-Fa-f]{1,4}){1,7}|(?:[0-9A-Fa-f]{1,4}:){6}(?:\d{1,3}\.){3}\d{1,3})\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `ipv6-${match.index}`,
      type: 'ipv6_address',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.9,
      category: 'ipv6_address',
    });
  }
  return matches;
}

// Auth header detector
function detectAuthHeaders(text: string): DetectionMatch[] {
  const pattern = /Authorization:\s*(?:Bearer|Basic)\s+[A-Za-z0-9._~+\/=:-]+/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `auth-header-${match.index}`,
      type: 'auth_header',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.95,
      category: 'auth_header',
    });
  }
  return matches;
}

// GitHub token detector (enhanced)
function detectGitHubTokens(text: string): DetectionMatch[] {
  const pattern = /\bgh[pso]_[A-Za-z0-9]{36}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `github-token-${match.index}`,
      type: 'github_token',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.95,
      category: 'github_token',
    });
  }
  return matches;
}

// Google API key detector
function detectGoogleAPIKeys(text: string): DetectionMatch[] {
  const pattern = /\bAIza[0-9A-Za-z_-]{35}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `google-api-key-${match.index}`,
      type: 'google_api_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.95,
      category: 'google_api_key',
    });
  }
  return matches;
}

// MAC address detector
function detectMACAddresses(text: string): DetectionMatch[] {
  const pattern = /\b(?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `mac-${match.index}`,
      type: 'mac_address',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.9,
      category: 'mac_address',
    });
  }
  return matches;
}

// Street address detector
function detectStreetAddresses(text: string): DetectionMatch[] {
  const pattern = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `address-${match.index}`,
      type: 'street_address',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.7,
      category: 'street_address',
    });
  }
  return matches;
}

// IBAN validator (from help.js)
function validateIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();
  if (!/^([A-Z]{2}\d{2}[A-Z0-9]{11,30})$/.test(cleaned)) {
    return false;
  }
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  let numeric = '';
  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged[i];
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      numeric += String(code - 55);
    } else {
      numeric += char;
    }
  }
  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 7) {
    const segment = remainder.toString() + numeric.substring(i, i + 7);
    remainder = parseInt(segment, 10) % 97;
  }
  return remainder === 1;
}

// IBAN detector
function detectIBANs(text: string): DetectionMatch[] {
  const patterns = [
    /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g, // Standard IBAN
    /\b([A-Z]{2}\d{2}\s+[█*]{4,}\s+\d{4}\s+\d{2})\b/g, // Masked IBAN like "DE89 ██████████████ 0130 00"
    /\b(?:iban|international\s+bank\s+account)\s*[=:]\s*['"]?([A-Z]{2}\d{2}\s+[█*]{4,}\s+\d{4}\s+\d{2})['"]?/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      // For masked IBANs, accept without validation; for standard IBANs, validate
      if (value.match(/[█*]/)) {
        matches.push({
          id: `iban-${match.index}`,
          type: 'iban',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.9,
          category: 'iban',
        });
      } else if (validateIBAN(value.replace(/\s/g, ''))) {
        matches.push({
          id: `iban-${match.index}`,
          type: 'iban',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.95,
          category: 'iban',
        });
      }
    }
  }
  return matches;
}

// Username detector (from config files, SSH, etc.)
function detectUsernames(text: string): DetectionMatch[] {
  const patterns = [
    /(username|user_name|user-name|user\.name|login|login_name|login-name|loginid|login_id|login-id)\s*[=:]\s*['"]?([^'"\s#;]+)['"]?/gi,
    /((?:db(?:_|\.|-)?user(?:name)?|user(?:name)?|user(?:_|-)?id|account(?:_|-)?name|account))\s*[=:]\s*['"]?([^'"\s#;]+)['"]?/gi,
    /(^|\s)([a-z_][\w.-]{0,31})@([a-z0-9][\w.-]{1,253})(?=:[^\n\r]*[$#>]|\s)/gim,
    /\[sudo\]\s+password\s+for\s+([^:\s]+):/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[2] || match[1];
      if (value && value.length > 0) {
        matches.push({
          id: `username-${match.index}`,
          type: 'username',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.8,
          category: 'username',
        });
      }
    }
  }
  return matches;
}

// Password detector (from config files)
function detectPasswords(text: string): DetectionMatch[] {
  const pattern = /(password|passwd|pwd)\s*[=:]\s*['"]?([^\s'"#;]+)['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[2];
    if (value && value.length > 0) {
      matches.push({
        id: `password-${match.index}`,
        type: 'password',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.9,
        category: 'password',
      });
    }
  }
  return matches;
}

// Bank account detector
function detectBankAccounts(text: string): DetectionMatch[] {
  const pattern = /((?:bank(?:_|-)?account|account(?:_|-)?number|acct(?:_|-)?no|accountNo|iban(?:_|-)?account))\s*[=:]\s*['"]?([A-Za-z0-9 \-]{6,34})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[2];
    if (value) {
      const cleaned = value.replace(/[^A-Za-z0-9]/g, '');
      const digitCount = (cleaned.match(/\d/g) || []).length;
      if (cleaned.length >= 8 && cleaned.length <= 34 && digitCount >= 6) {
        matches.push({
          id: `bank-account-${match.index}`,
          type: 'bank_account',
          value: value,
          startIndex: match.index + match[0].indexOf(value),
          endIndex: match.index + match[0].indexOf(value) + value.length,
          confidence: 0.8,
          category: 'bank_account',
        });
      }
    }
  }
  return matches;
}

// National ID detector
function detectNationalIDs(text: string): DetectionMatch[] {
  const patterns = [
    /((?:bd|bangladesh)(?:_|-)?(?:nid|national(?:_|-)?id))\s*[=:]\s*['"]?([0-9\s-]{10,17})['"]?/gi,
    /((?:aadhaar|aadhar|india(?:_|-)?aadhaar))\s*[=:]\s*['"]?([0-9\s-]{12,})['"]?/gi,
    /((?:national(?:_|-)?id(?:entifier)?|citizen(?:_|-)?id|nid|nin|natid))\s*[=:]\s*['"]?([A-Za-z0-9\-]{6,20})['"]?/gi,
    // Standalone National ID patterns (without label)
    /\b(?:national\s+id|nid)\s*[=:]\s*['"]?(\d{4}\s+\d{4}\s+\d{4})['"]?/gi,
    /\b(?:national\s+id|nid)\s*[=:]\s*['"]?(\d{10,17})['"]?/gi,
    // Standalone spaced format: "1234 5678 9012"
    /\b(\d{4}\s+\d{4}\s+\d{4})\b/g,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[2] || match[1];
      if (value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 6 && cleaned.length <= 20) {
          // For standalone patterns, check context to avoid false positives
          if (pattern.source.includes('\\b(\\d{4}\\s+\\d{4}\\s+\\d{4})\\b')) {
            // Check if it's in a sensitive context (near "National ID", "Fake", etc.)
            const before = text.substring(Math.max(0, match.index - 50), match.index).toLowerCase();
            const after = text.substring(match.index + match[0].length, Math.min(text.length, match.index + match[0].length + 50)).toLowerCase();
            const context = before + ' ' + after;
            if (!context.match(/(?:national|id|fake|test|demo|sample)/i)) {
              continue; // Skip if not in sensitive context
            }
          }
          matches.push({
            id: `national-id-${match.index}`,
            type: 'national_id',
            value: value,
            startIndex: match.index + match[0].indexOf(value),
            endIndex: match.index + match[0].indexOf(value) + value.length,
            confidence: 0.8,
            category: 'national_id',
          });
        }
      }
    }
  }
  return matches;
}

// Passport number detector
function detectPassportNumbers(text: string): DetectionMatch[] {
  const patterns = [
    /((?:bd|bangladesh)(?:_|-)?passport(?:_|-)?(?:no|number)?)\s*[=:]\s*['"]?([A-Za-z][0-9]{8})['"]?/gi,
    /((?:in|india)(?:_|-)?passport(?:_|-)?(?:no|number)?)\s*[=:]\s*['"]?([A-Za-z][0-9]{7})['"]?/gi,
    /((?:us|usa|united(?:_|-)?states)(?:_|-)?passport(?:_|-)?(?:no|number)?)\s*[=:]\s*['"]?([0-9]{9})['"]?/gi,
    /((?:uk|united(?:_|-)?kingdom|great(?:_|-)?britain)(?:_|-)?passport(?:_|-)?(?:no|number)?)\s*[=:]\s*['"]?([A-Za-z0-9]{9})['"]?/gi,
    /((?:eu|europe|european(?:_|-)?union)(?:_|-)?passport(?:_|-)?(?:no|number)?)\s*[=:]\s*['"]?([A-Za-z0-9]{8,9})['"]?/gi,
    /((?:passport(?:_|-)?no|passport(?:_|-)?number|pp(?:_|-)?no))\s*[=:]\s*['"]?([A-Za-z0-9]{6,15})['"]?/gi,
    // Standalone passport numbers (with context check)
    /\b([A-Z][0-9]{7,8})\b/g, // Format like N1234567
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[2] || match[1];
      if (value) {
        // For standalone patterns, check context
        if (pattern.source.includes('\\b([A-Z][0-9]{7,8})\\b')) {
          const before = text.substring(Math.max(0, match.index - 50), match.index).toLowerCase();
          const after = text.substring(match.index + match[0].length, Math.min(text.length, match.index + match[0].length + 50)).toLowerCase();
          const context = before + ' ' + after;
          if (!context.match(/(?:passport|fake|test|demo|sample)/i)) {
            continue;
          }
        }
        matches.push({
          id: `passport-${match.index}`,
          type: 'passport_number',
          value: value,
          startIndex: match.index + match[0].indexOf(value),
          endIndex: match.index + match[0].indexOf(value) + value.length,
          confidence: 0.8,
          category: 'passport_number',
        });
      }
    }
  }
  return matches;
}

// Hostname detector
function detectHostnames(text: string): DetectionMatch[] {
  const patterns = [
    /(?:\bhost(?:name)?|machine|server|node)\s*[=:]\s*['"]?([A-Za-z0-9](?:[A-Za-z0-9.-]{0,251}[A-Za-z0-9])?)['"]?/gi,
    /(^|\s)([a-z_][\w.-]{0,31})@([a-z0-9][\w.-]{1,253})(?=:[^\n\r]*[$#>]|\s)/gim,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[3];
      if (value) {
        matches.push({
          id: `hostname-${match.index}`,
          type: 'hostname',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.7,
          category: 'hostname',
        });
      }
    }
  }
  return matches;
}

// Generic secret detector (from config files)
function detectGenericSecrets(text: string): DetectionMatch[] {
  const pattern = /((?:secret|token|api(?:_|-)?key|apikey|api_key|client(?:_|-)?secret|access(?:_|-)?key|secret(?:_|-)?key))\s*[=:]\s*['"]?([^'"\s#;]+)['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[2];
    if (value && value.length > 0) {
      matches.push({
        id: `generic-secret-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.8,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// PAN (Indian Permanent Account Number) detector
function detectPANs(text: string): DetectionMatch[] {
  const pattern = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `pan-${match.index}`,
      type: 'national_id',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.9,
      category: 'national_id',
    });
  }
  return matches;
}

// 2FA Backup Codes detector
function detect2FABackupCodes(text: string): DetectionMatch[] {
  const pattern = /\b\d{4}-\d{4}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `2fa-code-${match.index}`,
      type: 'generic_secret',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.85,
      category: 'generic_secret',
    });
  }
  return matches;
}

// Firebase Server Key detector
function detectFirebaseKeys(text: string): DetectionMatch[] {
  const pattern = /\bAAAA[A-Za-z0-9_-]{35,}:[A-Za-z0-9_-]{100,}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `firebase-key-${match.index}`,
      type: 'api_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.95,
      category: 'api_key',
    });
  }
  return matches;
}

// Stripe Publishable Key detector (pk_test_ or pk_live_)
function detectStripePublishableKeys(text: string): DetectionMatch[] {
  const pattern = /\bpk_(?:test|live)_[A-Za-z0-9]{24,}\b/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `stripe-pk-${match.index}`,
      type: 'stripe_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.95,
      category: 'stripe_key',
    });
  }
  return matches;
}

// OAuth Token detector (Google, etc.)
function detectOAuthTokens(text: string): DetectionMatch[] {
  const patterns = [
    /(?:oauth|access_token|refresh_token)\s*[=:]\s*['"]?([A-Za-z0-9._~+\/=-]{20,})['"]?/gi,
    /(?:google|github|slack|microsoft|facebook)\s+(?:oauth|access|token)\s*[=:]\s*['"]?([A-Za-z0-9._~+\/=-]{20,})['"]?/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `oauth-token-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.85,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Session Token detector
function detectSessionTokens(text: string): DetectionMatch[] {
  const patterns = [
    /(?:session|session_token|session_id|sessid)\s*[=:]\s*['"]?([A-Za-z0-9._~+\/=-]{16,})['"]?/gi,
    /\[HASH:[A-Za-z0-9]{16,}\]/g,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `session-token-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.8,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Date of Birth detector (YYYY-MM-DD format)
function detectDateOfBirth(text: string): DetectionMatch[] {
  const pattern = /\b(?:date\s+of\s+birth|dob|birthdate|birth\s+date)\s*[=:]\s*['"]?(\d{4}-\d{2}-\d{2})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    const year = parseInt(value.split('-')[0], 10);
    // Only match reasonable birth years (1900-2010)
    if (year >= 1900 && year <= 2010) {
      matches.push({
        id: `dob-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.7,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Enhanced phone number detector (Indian format)
function detectPhonesEnhanced(text: string): DetectionMatch[] {
  const patterns = [
    /\b\+?91[-.\s]?\d{5}[-.\s]?\d{5}\b/g, // Indian format: +91-98765-43210
    /\b\d{5}[-.\s]?\d{5}\b/g, // Indian format without country code: 98765-43210
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const digits = match[0].replace(/\D/g, '');
      if (digits.length >= 10 && digits.length <= 12) {
        matches.push({
          id: `phone-enhanced-${match.index}`,
          type: 'phone',
          value: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.9,
          category: 'phone',
        });
      }
    }
  }
  return matches;
}

// Enhanced address detector (full addresses with postal codes)
function detectAddressesEnhanced(text: string): DetectionMatch[] {
  const patterns = [
    // Full address with all components
    /\d+[,\s]+[A-Za-z\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir|Sector|Society)[,\s]+[A-Za-z\s,]+(?:City|State|Country)[,\s]+[A-Za-z\s,]+(?:City|State|Country)[,\s]+\d{5,6}[,\s]*(?:India|USA|UK|United\s+States|United\s+Kingdom)?/gi,
    // Address with Sector/Society pattern (Indian format)
    /\d+[,\s]+[A-Za-z\s]+(?:Sector|Society)[,\s]+[A-Za-z\s]+(?:City|State)[,\s]+[A-Za-z\s]+(?:City|State)[,\s]+\d{5,6}[,\s]*(?:India)?/gi,
    // Address label pattern
    /(?:address|full\s+address|street\s+address)\s*[=:]\s*['"]?([^'"\n]{20,100})['"]?/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      if (value.length >= 20) {
        matches.push({
          id: `address-enhanced-${match.index}`,
          type: 'street_address',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.8,
          category: 'street_address',
        });
      }
    }
  }
  return matches;
}

// Postal code detector (when in sensitive context)
function detectPostalCodes(text: string): DetectionMatch[] {
  const pattern = /(?:postal\s+code|zip\s+code|pincode|pin\s+code)\s*[=:]\s*['"]?(\d{5,6})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `postal-code-${match.index}`,
      type: 'generic_secret',
      value: match[1],
      startIndex: match.index + match[0].indexOf(match[1]),
      endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
      confidence: 0.7,
      category: 'generic_secret',
    });
  }
  return matches;
}

// Enhanced MongoDB URI detector (with credentials)
function detectMongoDBURIs(text: string): DetectionMatch[] {
  const pattern = /mongodb(?:\+srv)?:\/\/[^\s'\"]+/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `mongodb-uri-${match.index}`,
      type: 'database_url',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.95,
      category: 'database_url',
    });
  }
  return matches;
}

// MySQL connection details detector
function detectMySQLConnections(text: string): DetectionMatch[] {
  const patterns = [
    /(?:mysql|mariadb)\s+(?:host|hostname|server|ip)\s*[=:]\s*['"]?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})['"]?/gi,
    /(?:mysql|mariadb)\s+(?:host|hostname|server|ip)\s*[=:]\s*['"]?(\d{1,3}\.\*+\d{1,3})['"]?/gi,
    /Host:\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\d{1,3}\.\*+\d{1,3})/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        id: `mysql-host-${match.index}`,
        type: 'ip_address',
        value: match[1],
        startIndex: match.index + match[0].indexOf(match[1]),
        endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
        confidence: 0.8,
        category: 'ip_address',
      });
    }
  }
  return matches;
}

// Enhanced private key detector (OPENSSH format)
function detectPrivateKeysEnhanced(text: string): DetectionMatch[] {
  const pattern = /-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+OPENSSH\s+PRIVATE\s+KEY-----/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `private-key-enhanced-${match.index}`,
      type: 'private_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.98,
      category: 'private_key',
    });
  }
  return matches;
}

// Partially masked credit card detector
function detectMaskedCreditCards(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:card\s+number|card\s+no|cardno)\s*[=:]\s*['"]?(\d{4}[*]{4,}\d{4})['"]?/gi,
    /\b(\d{4}[*]{4,}\d{4})\b/g, // Standalone masked cards
    /\b(?:visa|mastercard|amex|card)\s+(?:test|number)?\s*[=:]\s*['"]?(\d{4}[*]{4,}\d{4})['"]?/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `masked-cc-${match.index}`,
        type: 'credit_card',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.9,
        category: 'credit_card',
      });
    }
  }
  return matches;
}

// CVV detector
function detectCVV(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:cvv|cvc|cvn|security\s+code)\s*[=:]\s*['"]?(\d{3,4})['"]?/gi,
    /(?:cvv|cvc|cvn):\s*(\d{3,4})/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1];
      if (value.length >= 3 && value.length <= 4) {
        matches.push({
          id: `cvv-${match.index}`,
          type: 'credit_card',
          value: value,
          startIndex: match.index + match[0].indexOf(value),
          endIndex: match.index + match[0].indexOf(value) + value.length,
          confidence: 0.85,
          category: 'credit_card',
        });
      }
    }
  }
  return matches;
}

// Card expiry date detector
function detectCardExpiry(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:expiry|exp|expiration|expires)\s*[=:]\s*['"]?(\d{2}\/\d{2})['"]?/gi,
    /\b(?:expiry|exp|expiration|expires):\s*(\d{2}\/\d{2})/gi,
    /\b(\d{2}\/\d{2})\b/g, // Standalone MM/YY format
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      // Check if it's in a card context
      const before = text.substring(Math.max(0, match.index - 50), match.index).toLowerCase();
      const after = text.substring(match.index + match[0].length, Math.min(text.length, match.index + match[0].length + 50)).toLowerCase();
      const context = before + ' ' + after;
      if (pattern.source.includes('\\b(\\d{2}\\/\\d{2})\\b') && !context.match(/(?:card|expiry|exp|cvv|payment|bank)/i)) {
        continue;
      }
      matches.push({
        id: `card-expiry-${match.index}`,
        type: 'credit_card',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.8,
        category: 'credit_card',
      });
    }
  }
  return matches;
}

// UPI ID detector
function detectUPIIDs(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:upi\s+id|upi_id|upiid)\s*[=:]\s*['"]?([*]?[a-z0-9._-]+@[a-z]+)['"]?/gi,
    /\b([*]?[a-z0-9._-]+@(?:okicici|okaxis|okhdfc|oksbi|okbob|paytm|phonepe|gpay|ybl|ibl|axl|fbl|payzapp|airtel|jio|mobikwik))/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `upi-id-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.9,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// IFSC code detector (Indian Financial System Code)
function detectIFSC(text: string): DetectionMatch[] {
  const pattern = /\b(?:ifsc|ifsc\s+code)\s*[=:]\s*['"]?([A-Z]{4}0[A-Z0-9]{6})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `ifsc-${match.index}`,
      type: 'bank_account',
      value: match[1],
      startIndex: match.index + match[0].indexOf(match[1]),
      endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
      confidence: 0.9,
      category: 'bank_account',
    });
  }
  return matches;
}

// Account number detector (with masking)
function detectAccountNumbers(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:account\s+number|account\s+no|acct\s+no|acc\s+no)\s*[=:]\s*['"]?(\d{3}[*]{4,}\d{4})['"]?/gi,
    /\b(?:account\s+number|account\s+no|acct\s+no|acc\s+no)\s*[=:]\s*['"]?(\d{8,20})['"]?/gi,
    /\b(\d{3}[*]{4,}\d{4})\b/g, // Standalone masked account
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `account-number-${match.index}`,
        type: 'bank_account',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.85,
        category: 'bank_account',
      });
    }
  }
  return matches;
}

// Analytics ID detector (Google Analytics, etc.)
function detectAnalyticsIDs(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:analytics\s+id|ga\s+id|google\s+analytics)\s*[=:]\s*['"]?(G-[A-Z0-9]{10})['"]?/gi,
    /\b(G-[A-Z0-9]{10})\b/g, // Standalone GA ID
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `analytics-id-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.7,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// S3 bucket name detector
function detectS3Buckets(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:s3\s+bucket|bucket\s+name|aws\s+bucket)\s*[=:]\s*['"]?([a-z0-9.\-]{3,63})['"]?/gi,
    /\b(s3:\/\/[a-z0-9.\-]{3,63})/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      // Check if it looks like a bucket name
      if (value.match(/^[a-z0-9][a-z0-9.\-]*[a-z0-9]$/i) || value.startsWith('s3://')) {
        matches.push({
          id: `s3-bucket-${match.index}`,
          type: 'generic_secret',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.7,
          category: 'generic_secret',
        });
      }
    }
  }
  return matches;
}

// S3 region detector
function detectS3Regions(text: string): DetectionMatch[] {
  const pattern = /\b(?:s3\s+region|aws\s+region|region)\s*[=:]\s*['"]?(ap|us|eu|sa|ca|cn)-(?:north|south|east|west|central)-\d+[█*]{0,}['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `s3-region-${match.index}`,
      type: 'generic_secret',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.7,
      category: 'generic_secret',
    });
  }
  return matches;
}

// Environment variable detector
function detectEnvVars(text: string): DetectionMatch[] {
  const patterns = [
    /(?:NEXT_PUBLIC_|REACT_APP_|VITE_|NUXT_|NODE_)?(?:API_KEY|SECRET|TOKEN|PASSWORD|PASS|PWD|DB_PASS|DATABASE_URL|REDIS_URL|DATABASE|REDIS|API_URL)\s*=\s*['"]?([^'"\n]+)['"]?/gi,
    /(?:API_KEY|SECRET|TOKEN|PASSWORD|PASS|PWD|DB_PASS|DATABASE_URL|REDIS_URL)\s*=\s*['"]?([█*]{4,}|[A-Za-z0-9._~+\/=-]{16,})['"]?/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1];
      if (value && (value.length >= 4 || value.match(/[█*]{4,}/))) {
        matches.push({
          id: `env-var-${match.index}`,
          type: 'generic_secret',
          value: value,
          startIndex: match.index + match[0].indexOf(value),
          endIndex: match.index + match[0].indexOf(value) + value.length,
          confidence: 0.85,
          category: 'generic_secret',
        });
      }
    }
  }
  return matches;
}

// API URL detector (when in sensitive context)
function detectAPIUrls(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:api\s+url|api_url|api\s+base\s+url|endpoint)\s*[=:]\s*['"]?(https?:\/\/[^\s'"\n]+)['"]?/gi,
    /\b(?:api\s+url|api_url|api\s+base\s+url)\s*=\s*['"]?(https?:\/\/[^\s'"\n]+)['"]?/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1];
      matches.push({
        id: `api-url-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.7,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Bearer token in logs detector
function detectBearerTokens(text: string): DetectionMatch[] {
  const patterns = [
    /Bearer\s+token[:\s]+([█*]{4,}|[A-Za-z0-9]{16,})/gi,
    /Bearer\s+([█*]{4,}|[A-Za-z0-9]{16,})/gi,
    /token[:\s]+([█*]{4,}\s+[A-Za-z0-9]{16,})/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1];
      matches.push({
        id: `bearer-token-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.85,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// IP address in logs detector
function detectIPInLogs(text: string): DetectionMatch[] {
  const pattern = /\b(?:ip|ip_address|ip_addr)\s*[=:]\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\*{1,3}|\d{1,3}\.\d{1,3}\.\*{1,3}\.\d{1,3})/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `ip-log-${match.index}`,
      type: 'ip_address',
      value: match[1],
      startIndex: match.index + match[0].indexOf(match[1]),
      endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
      confidence: 0.8,
      category: 'ip_address',
    });
  }
  return matches;
}

// JWT payload/header detector (separate from full JWT)
function detectJWTParts(text: string): DetectionMatch[] {
  const patterns = [
    /(?:jwt\s+)?(?:header|payload)\s*[=:]\s*['"]?(\{[^}]+\})['"]?/gi,
    /(?:Header|Payload):\s*(\{[^}]+\})/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1];
      // Check if it contains sensitive fields
      if (value.match(/(?:user_id|email|role|token|secret|password|api_key)/i)) {
        matches.push({
          id: `jwt-part-${match.index}`,
          type: 'jwt',
          value: value,
          startIndex: match.index + match[0].indexOf(value),
          endIndex: match.index + match[0].indexOf(value) + value.length,
          confidence: 0.8,
          category: 'jwt',
        });
      }
    }
  }
  return matches;
}

// Webhook payload detector (JSON with sensitive data)
function detectWebhookPayloads(text: string): DetectionMatch[] {
  const pattern = /(?:webhook|payload|request|response)[\s\S]{0,200}?(\{[^}]*?(?:email|card|token|secret|password|api_key|user_id)[^}]*?\})/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    if (value.match(/(?:email|card|token|secret|password|api_key|user_id)/i)) {
      matches.push({
        id: `webhook-payload-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.7,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Masked value detector (█ characters)
function detectMaskedValues(text: string): DetectionMatch[] {
  const patterns = [
    /(?:[=:]\s*['"]?)([█*]{8,})(?:['"]?)/g,
    /\b([█*]{8,})\b/g,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1];
      // Check context to see if it's a sensitive field
      const before = text.substring(Math.max(0, match.index - 100), match.index).toLowerCase();
      const after = text.substring(match.index + match[0].length, Math.min(text.length, match.index + match[0].length + 100)).toLowerCase();
      const context = before + ' ' + after;
      if (context.match(/(?:password|token|key|secret|email|phone|ssn|card|account|api|auth|credential|id|number)/i)) {
        matches.push({
          id: `masked-value-${match.index}`,
          type: 'generic_secret',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.7,
          category: 'generic_secret',
        });
      }
    }
  }
  return matches;
}

// Cardholder name detector
function detectCardholderNames(text: string): DetectionMatch[] {
  const pattern = /\b(?:cardholder\s+name|name\s+on\s+card)\s*[=:]\s*['"]?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `cardholder-name-${match.index}`,
      type: 'generic_secret',
      value: match[1],
      startIndex: match.index + match[0].indexOf(match[1]),
      endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
      confidence: 0.7,
      category: 'generic_secret',
    });
  }
  return matches;
}

// Driving License detector
function detectDrivingLicenses(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:driving\s+license|dl|license\s+no)\s*[=:]\s*['"]?([A-Z]{2}\d{2}\s+\d{4}[*█]{4,}\d{4})['"]?/gi,
    /\b([A-Z]{2}\d{2}\s+\d{4}[*█]{4,}\d{4})\b/g, // Standalone format like "GJ05 202****2345"
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `driving-license-${match.index}`,
        type: 'national_id',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.85,
        category: 'national_id',
      });
    }
  }
  return matches;
}

// 6-digit 2FA code detector
function detect2FACodes6Digit(text: string): DetectionMatch[] {
  const pattern = /\b(?:2fa|two\s+factor|verification\s+code)\s*[=:]\s*['"]?(\d{6})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `2fa-6digit-${match.index}`,
      type: 'generic_secret',
      value: match[1],
      startIndex: match.index + match[0].indexOf(match[1]),
      endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
      confidence: 0.85,
      category: 'generic_secret',
    });
  }
  return matches;
}

// GPG/PGP Private Key detector
function detectGPGKeys(text: string): DetectionMatch[] {
  const pattern = /-----BEGIN\s+PGP\s+PRIVATE\s+KEY\s+BLOCK-----[\s\S]*?-----END\s+PGP\s+PRIVATE\s+KEY\s+BLOCK-----/g;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      id: `gpg-key-${match.index}`,
      type: 'private_key',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      confidence: 0.98,
      category: 'private_key',
    });
  }
  return matches;
}

// Discord Bot Token detector
function detectDiscordTokens(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:discord\s+bot\s+token|discord\s+token)\s*[=:]\s*['"]?([A-Za-z0-9._~+\/=-]{50,})['"]?/gi,
    /\b([MN][A-Za-z0-9]{23}\.[A-Za-z0-9-_]{6}\.[A-Za-z0-9-_]{27})/g, // Discord token format
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `discord-token-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.9,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Anthropic API Key detector
function detectAnthropicKeys(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:anthropic|claude)\s+(?:api\s+)?key\s*[=:]\s*['"]?(sk-ant-[A-Za-z0-9-]{95})['"]?/gi,
    /\b(sk-ant-[A-Za-z0-9-]{95})\b/g,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `anthropic-key-${match.index}`,
        type: 'api_key',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.95,
        category: 'api_key',
      });
    }
  }
  return matches;
}

// Gemini API Key detector
function detectGeminiKeys(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:gemini\s+api\s+key|gemini\s+key)\s*[=:]\s*['"]?(g-[a-z]+-[a-z0-9-]+)['"]?/gi,
    /\b(g-[a-z]+-[a-z0-9-]{20,})/g, // Format like "g-test-121212-fake-gemini-key"
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `gemini-key-${match.index}`,
        type: 'api_key',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.9,
        category: 'api_key',
      });
    }
  }
  return matches;
}

// Supabase Key detector
function detectSupabaseKeys(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:supabase|supabase_anon_key|supabase_private_key)\s*[=:]\s*['"]?(eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*|ey[A-Za-z0-9_-]{50,})['"]?/gi,
    /\b(SUPABASE_[A-Z_]+)\s*=\s*['"]?(ey[A-Za-z0-9_-]{50,})['"]?/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[2] || match[1] || match[0];
      matches.push({
        id: `supabase-key-${match.index}`,
        type: 'api_key',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.9,
        category: 'api_key',
      });
    }
  }
  return matches;
}

// Landline detector
function detectLandlines(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:landline|phone|tel)\s*[=:]\s*['"]?(\d{2,4}[-.\s]?[█*]{4,}\d{3,4})['"]?/gi,
    /\b(\d{2,4}[-.\s]?[█*]{4,}\d{3,4})\b/g, // Format like "022-█████████"
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `landline-${match.index}`,
        type: 'phone',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.8,
        category: 'phone',
      });
    }
  }
  return matches;
}

// Date of Birth with slashes detector
function detectDOBWithSlashes(text: string): DetectionMatch[] {
  const pattern = /\b(?:dob|date\s+of\s+birth|birthdate)\s*[=:]\s*['"]?(\d{4}\/\d{2}\/\d{2})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    const year = parseInt(value.split('/')[0], 10);
    if (year >= 1900 && year <= 2010) {
      matches.push({
        id: `dob-slash-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.7,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Geo coordinates detector
function detectGeoCoordinates(text: string): DetectionMatch[] {
  const pattern = /\b(?:geo\s+coordinates?|coordinates?|lat\s*[,:]\s*lon|location)\s*[=:]\s*['"]?(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = `${match[1]}, ${match[2]}`;
    matches.push({
      id: `geo-coords-${match.index}`,
      type: 'generic_secret',
      value: value,
      startIndex: match.index + match[0].indexOf(match[1]),
      endIndex: match.index + match[0].indexOf(match[2]) + match[2].length,
      confidence: 0.7,
      category: 'generic_secret',
    });
  }
  return matches;
}

// AMQP/RabbitMQ URL detector
function detectAMQPUrls(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:amqp|rabbitmq)\s*[=:]\s*['"]?(amqp:\/\/[^\s'"\n]+)['"]?/gi,
    /\b(amqp:\/\/[a-zA-Z0-9._-]+:[█*]{4,}[a-zA-Z0-9._-]*@[^\s'"\n]+)/gi,
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      matches.push({
        id: `amqp-url-${match.index}`,
        type: 'database_url',
        value: value,
        startIndex: match.index + (match[0].indexOf(value) || 0),
        endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
        confidence: 0.9,
        category: 'database_url',
      });
    }
  }
  return matches;
}

// Kubernetes Secret detector (base64 values)
function detectKubernetesSecrets(text: string): DetectionMatch[] {
  const pattern = /(?:kind:\s*Secret|apiVersion:\s*v1)[\s\S]{0,500}?(?:data|stringData):[\s\S]{0,500}?([a-zA-Z0-9_-]+):\s*([A-Za-z0-9+\/]{20,}={0,2}|[█*]{8,})/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const key = match[1];
    const value = match[2];
    if (key.match(/(?:key|secret|token|password|pass|pwd|api|auth|credential)/i)) {
      matches.push({
        id: `k8s-secret-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.85,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// INI Config detector
function detectINIConfig(text: string): DetectionMatch[] {
  const pattern = /\[(?:credentials|auth|database|api|secret|config)\][\s\S]{0,200}?(?:username|password|pass|pwd|key|secret|token|api_key)\s*=\s*([█*]{8,}|[^\n\r]{4,})/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    matches.push({
      id: `ini-config-${match.index}`,
      type: 'generic_secret',
      value: value.trim(),
      startIndex: match.index + match[0].indexOf(value),
      endIndex: match.index + match[0].indexOf(value) + value.trim().length,
      confidence: 0.8,
      category: 'generic_secret',
    });
  }
  return matches;
}

// YAML Config detector
function detectYAMLConfig(text: string): DetectionMatch[] {
  const pattern = /(?:key|secret|token|password|pass|pwd|api_key|auth_token):\s*['"]?([█*]{8,}|[A-Za-z0-9._~+\/=-]{16,})['"]?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    matches.push({
      id: `yaml-config-${match.index}`,
      type: 'generic_secret',
      value: value,
      startIndex: match.index + match[0].indexOf(value),
      endIndex: match.index + match[0].indexOf(value) + value.length,
      confidence: 0.8,
      category: 'generic_secret',
    });
  }
  return matches;
}

// XML Config detector
function detectXMLConfig(text: string): DetectionMatch[] {
  const pattern = /<(?:apikey|password|pass|pwd|key|secret|token|api_key|auth_token)>(.*?)<\/(?:apikey|password|pass|pwd|key|secret|token|api_key|auth_token)>/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    if (value.length >= 4) {
      matches.push({
        id: `xml-config-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index + match[0].indexOf(value),
        endIndex: match.index + match[0].indexOf(value) + value.length,
        confidence: 0.8,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// JSON Config detector
function detectJSONConfig(text: string): DetectionMatch[] {
  const pattern = /"(?:db_user|db_pass|db_password|db_pwd|service_token|api_key|secret|token|password|pass|pwd|auth_token)"\s*:\s*["']?([█*]{8,}|[A-Za-z0-9._~+\/=-]{8,})["']?/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    matches.push({
      id: `json-config-${match.index}`,
      type: 'generic_secret',
      value: value,
      startIndex: match.index + match[0].indexOf(value),
      endIndex: match.index + match[0].indexOf(value) + value.length,
      confidence: 0.85,
      category: 'generic_secret',
    });
  }
  return matches;
}

// Routing Number detector
function detectRoutingNumbers(text: string): DetectionMatch[] {
  const patterns = [
    /\b(?:routing\s+number|routing\s+no|rtn)\s*[=:]\s*['"]?([*█]{4,}\d{4})['"]?/gi,
    /\b([*█]{4,}\d{4})\b/g, // Standalone masked routing number
  ];
  const matches: DetectionMatch[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1] || match[0];
      const before = text.substring(Math.max(0, match.index - 50), match.index).toLowerCase();
      if (before.match(/(?:routing|bank|account)/i) || pattern.source.includes('routing')) {
        matches.push({
          id: `routing-number-${match.index}`,
          type: 'bank_account',
          value: value,
          startIndex: match.index + (match[0].indexOf(value) || 0),
          endIndex: match.index + (match[0].indexOf(value) || 0) + value.length,
          confidence: 0.8,
          category: 'bank_account',
        });
      }
    }
  }
  return matches;
}

// Connection string in logs detector
function detectConnectionStringsInLogs(text: string): DetectionMatch[] {
  const pattern = /(?:connection_string|conn_string|dsn|connection|db_url)\s*[=:]\s*["']([█*]{8,}|[^\s"']{20,})["']/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    matches.push({
      id: `conn-string-log-${match.index}`,
      type: 'database_url',
      value: value,
      startIndex: match.index + match[0].indexOf(value),
      endIndex: match.index + match[0].indexOf(value) + value.length,
      confidence: 0.85,
      category: 'database_url',
    });
  }
  return matches;
}

// Enhanced UPI ID detector (with different masking patterns)
function detectUPIIDsEnhanced(text: string): DetectionMatch[] {
  const pattern = /\b([*█]{4,}[@][a-z]+|[*█]{4,}[*█]{4,})/gi;
  const matches: DetectionMatch[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[1];
    const before = text.substring(Math.max(0, match.index - 50), match.index).toLowerCase();
    if (before.match(/(?:upi|payment|bank)/i)) {
      matches.push({
        id: `upi-enhanced-${match.index}`,
        type: 'generic_secret',
        value: value,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.8,
        category: 'generic_secret',
      });
    }
  }
  return matches;
}

// Custom pattern detector
function detectCustomPatterns(text: string, customPatterns: CustomPattern[]): DetectionMatch[] {
  const matches: DetectionMatch[] = [];
  for (const custom of customPatterns) {
    try {
      const regex = new RegExp(custom.pattern, custom.flags || 'g');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          id: `custom-${custom.name}-${match.index}`,
          type: 'custom',
          value: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.7,
          category: custom.category || custom.name,
        });
      }
    } catch (e) {
      console.warn(`Invalid custom pattern: ${custom.pattern}`, e);
    }
  }
  return matches;
}

// Main detection function
export async function detectSensitiveText(
  text: string,
  options: DetectionOptions = {}
): Promise<DetectionMatch[]> {
  const {
    confidenceThreshold = 0.5,
    customPatterns = [],
    allowlist = [],
  } = options;

  const allMatches: DetectionMatch[] = [];

  // Run all detectors
  allMatches.push(...detectEmails(text));
  allMatches.push(...detectPhones(text));
  allMatches.push(...detectPhonesEnhanced(text));
  allMatches.push(...detectSSNs(text));
  allMatches.push(...detectCreditCards(text));
  allMatches.push(...detectMaskedCreditCards(text));
  allMatches.push(...detectCVV(text));
  allMatches.push(...detectCardExpiry(text));
  allMatches.push(...detectCardholderNames(text));
  allMatches.push(...detectUUIDs(text));
  allMatches.push(...detectAWSKeys(text));
  allMatches.push(...detectAPIKeys(text));
  allMatches.push(...detectJWTs(text));
  allMatches.push(...detectJWTParts(text));
  allMatches.push(...detectDBUrls(text));
  allMatches.push(...detectPrivateKeys(text));
  allMatches.push(...detectPrivateKeysEnhanced(text));
  allMatches.push(...detectIPAddresses(text));
  allMatches.push(...detectIPInLogs(text));
  allMatches.push(...detectIPv6Addresses(text));
  allMatches.push(...detectHighEntropyTokens(text));
  allMatches.push(...detectAuthHeaders(text));
  allMatches.push(...detectBearerTokens(text));
  allMatches.push(...detectGitHubTokens(text));
  allMatches.push(...detectGoogleAPIKeys(text));
  allMatches.push(...detectMACAddresses(text));
  allMatches.push(...detectStreetAddresses(text));
  allMatches.push(...detectAddressesEnhanced(text));
  allMatches.push(...detectIBANs(text));
  allMatches.push(...detectUPIIDs(text));
  allMatches.push(...detectIFSC(text));
  allMatches.push(...detectAccountNumbers(text));
  allMatches.push(...detectUsernames(text));
  allMatches.push(...detectPasswords(text));
  allMatches.push(...detectBankAccounts(text));
  allMatches.push(...detectNationalIDs(text));
  allMatches.push(...detectPANs(text));
  allMatches.push(...detectPassportNumbers(text));
  allMatches.push(...detectHostnames(text));
  allMatches.push(...detectGenericSecrets(text));
  allMatches.push(...detect2FABackupCodes(text));
  allMatches.push(...detectFirebaseKeys(text));
  allMatches.push(...detectStripePublishableKeys(text));
  allMatches.push(...detectOAuthTokens(text));
  allMatches.push(...detectSessionTokens(text));
  allMatches.push(...detectDateOfBirth(text));
  allMatches.push(...detectPostalCodes(text));
  allMatches.push(...detectMongoDBURIs(text));
  allMatches.push(...detectMySQLConnections(text));
  allMatches.push(...detectAnalyticsIDs(text));
  allMatches.push(...detectS3Buckets(text));
  allMatches.push(...detectS3Regions(text));
  allMatches.push(...detectEnvVars(text));
  allMatches.push(...detectAPIUrls(text));
  allMatches.push(...detectWebhookPayloads(text));
  allMatches.push(...detectMaskedValues(text));
  allMatches.push(...detectDrivingLicenses(text));
  allMatches.push(...detect2FACodes6Digit(text));
  allMatches.push(...detectGPGKeys(text));
  allMatches.push(...detectDiscordTokens(text));
  allMatches.push(...detectAnthropicKeys(text));
  allMatches.push(...detectGeminiKeys(text));
  allMatches.push(...detectSupabaseKeys(text));
  allMatches.push(...detectLandlines(text));
  allMatches.push(...detectDOBWithSlashes(text));
  allMatches.push(...detectGeoCoordinates(text));
  allMatches.push(...detectAMQPUrls(text));
  allMatches.push(...detectKubernetesSecrets(text));
  allMatches.push(...detectINIConfig(text));
  allMatches.push(...detectYAMLConfig(text));
  allMatches.push(...detectXMLConfig(text));
  allMatches.push(...detectJSONConfig(text));
  allMatches.push(...detectRoutingNumbers(text));
  allMatches.push(...detectConnectionStringsInLogs(text));
  allMatches.push(...detectUPIIDsEnhanced(text));
  
  if (customPatterns.length > 0) {
    allMatches.push(...detectCustomPatterns(text, customPatterns));
  }

  // Filter by confidence threshold
  let filtered = allMatches.filter(m => m.confidence >= confidenceThreshold);

  // Remove allowlisted values
  if (allowlist.length > 0) {
    filtered = filtered.filter(m => !allowlist.includes(m.value));
  }

  // Remove overlapping matches (keep higher confidence)
  filtered.sort((a, b) => {
    if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex;
    return b.confidence - a.confidence;
  });

  const nonOverlapping: DetectionMatch[] = [];
  for (const match of filtered) {
    const overlaps = nonOverlapping.some(
      existing =>
        (match.startIndex >= existing.startIndex && match.startIndex < existing.endIndex) ||
        (match.endIndex > existing.startIndex && match.endIndex <= existing.endIndex) ||
        (match.startIndex <= existing.startIndex && match.endIndex >= existing.endIndex)
    );
    if (!overlaps) {
      nonOverlapping.push(match);
    }
  }

  return nonOverlapping;
}

