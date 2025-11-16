import { detectSensitiveText } from './detectors';
import { maskText, revealMatch } from './masker';
import type { DetectionMatch, MaskingPolicy, DetectionOptions, MaskedResult } from './types';

export interface VibeGardOptions extends DetectionOptions {
  maskingPolicy?: MaskingPolicy;
  salt?: string;
}

export class VibeGard {
  private options: VibeGardOptions;
  private allowlist: Set<string> = new Set();

  constructor(options: VibeGardOptions = {}) {
    this.options = options;
    if (options.allowlist) {
      this.allowlist = new Set(options.allowlist);
    }
  }

  async detect(text: string): Promise<DetectionMatch[]> {
    return detectSensitiveText(text, {
      ...this.options,
      allowlist: Array.from(this.allowlist),
    });
  }

  async mask(text: string, matches?: DetectionMatch[]): Promise<MaskedResult> {
    const detectedMatches = matches || (await this.detect(text));
    return maskText(
      text,
      detectedMatches,
      this.options.maskingPolicy,
      this.options.salt
    );
  }

  reveal(originalText: string, match: DetectionMatch): string {
    return revealMatch(originalText, match);
  }

  addToAllowlist(value: string): void {
    this.allowlist.add(value);
  }

  removeFromAllowlist(value: string): void {
    this.allowlist.delete(value);
  }

  getAllowlist(): string[] {
    return Array.from(this.allowlist);
  }

  updateOptions(options: Partial<VibeGardOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export default VibeGard;

