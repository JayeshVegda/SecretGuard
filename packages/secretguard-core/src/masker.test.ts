import { describe, it, expect } from 'vitest';
import { maskText } from './masker';
import type { DetectionMatch } from './types';

describe('maskText', () => {
  it('should mask email with partial strategy', async () => {
    const text = 'Contact: john.doe@example.com';
    const matches: DetectionMatch[] = [
      {
        id: '1',
        type: 'email',
        value: 'john.doe@example.com',
        startIndex: 9,
        endIndex: 31,
        confidence: 0.95,
        category: 'email',
      },
    ];
    const result = await maskText(text, matches);
    expect(result.maskedText).not.toContain('john.doe@example.com');
    expect(result.maskedText.length).toBeGreaterThan(0);
  });

  it('should mask with redact strategy', async () => {
    const text = 'JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const matches: DetectionMatch[] = [
      {
        id: '1',
        type: 'jwt',
        value: text.substring(5),
        startIndex: 5,
        endIndex: text.length,
        confidence: 0.9,
        category: 'jwt',
      },
    ];
    const result = await maskText(text, matches, {
      jwt: { strategy: 'redact', maskChar: '█' },
    });
    expect(result.maskedText).toContain('█');
    expect(result.maskedText).not.toContain('eyJ');
  });

  it('should handle multiple matches', async () => {
    const text = 'Email: test@example.com Phone: +1-555-1234';
    const matches: DetectionMatch[] = [
      {
        id: '1',
        type: 'email',
        value: 'test@example.com',
        startIndex: 7,
        endIndex: 23,
        confidence: 0.95,
        category: 'email',
      },
      {
        id: '2',
        type: 'phone',
        value: '+1-555-1234',
        startIndex: 31,
        endIndex: 42,
        confidence: 0.9,
        category: 'phone',
      },
    ];
    const result = await maskText(text, matches);
    expect(result.matches.length).toBe(2);
    expect(result.maskedText).not.toContain('test@example.com');
  });
});

