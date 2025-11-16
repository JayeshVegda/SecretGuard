export type SensitiveDataType =
  | 'email'
  | 'phone'
  | 'ssn'
  | 'credit_card'
  | 'api_key'
  | 'aws_key'
  | 'jwt'
  | 'jwt_token'
  | 'uuid'
  | 'db_url'
  | 'database_url'
  | 'database_url_extra'
  | 'private_key'
  | 'password'
  | 'ip_address'
  | 'ipv6_address'
  | 'iban'
  | 'high_entropy_token'
  | 'auth_header'
  | 'github_token'
  | 'slack_token'
  | 'stripe_key'
  | 'google_api_key'
  | 'openai_key'
  | 'twilio_sid'
  | 'mac_address'
  | 'username'
  | 'street_address'
  | 'address'
  | 'bank_account'
  | 'national_id'
  | 'passport_number'
  | 'hostname'
  | 'generic_secret'
  | 'custom';

export interface DetectionMatch {
  id: string;
  type: SensitiveDataType;
  value: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  category: string;
}

export type MaskingStrategy = 'redact' | 'partial' | 'hash' | 'tokenize' | 'hint';

export interface MaskingConfig {
  strategy: MaskingStrategy;
  showFirst?: number;
  showLast?: number;
  maskChar?: string;
  hint?: string;
}

export interface MaskingPolicy {
  [category: string]: MaskingConfig;
}

export interface DetectionOptions {
  confidenceThreshold?: number;
  enableNER?: boolean;
  customPatterns?: CustomPattern[];
  allowlist?: string[];
}

export interface CustomPattern {
  name: string;
  pattern: string;
  flags?: string;
  category?: string;
}

export interface MaskedResult {
  maskedText: string;
  matches: DetectionMatch[];
  mapping: Map<string, string>;
}

export interface WorkerMessage {
  type: 'detect' | 'mask';
  payload: any;
}

export interface WorkerResponse {
  type: 'detect' | 'mask';
  result: any;
}

