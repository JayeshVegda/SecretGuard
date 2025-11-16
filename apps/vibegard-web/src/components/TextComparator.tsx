import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { detectSensitiveText, maskText, verifyMaskedText, type DetectionMatch, type MaskingPolicy, type VerificationResult } from 'secretguard-core';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Shield, Eye, EyeOff, Copy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface TextComparatorProps {
  originalText: string;
  onTextChange: (text: string) => void;
  onMatchesDetected: (matches: DetectionMatch[]) => void;
  maskingPolicy?: MaskingPolicy;
}

// Category display names
const categoryDisplayMap: Record<string, string> = {
  email: 'Email',
  phone: 'Phone',
  ssn: 'SSN',
  credit_card: 'Credit Card',
  api_key: 'API Key',
  aws_key: 'AWS Key',
  jwt_token: 'JWT Token',
  database_url: 'Database URL',
  database_url_extra: 'Database URL',
  private_key: 'Private Key',
  password: 'Password',
  ip_address: 'IP Address',
  ipv6_address: 'IPv6 Address',
  uuid: 'UUID',
  iban: 'IBAN',
  auth_header: 'Auth Header',
  github_token: 'GitHub Token',
  slack_token: 'Slack Token',
  stripe_key: 'Stripe Key',
  google_api_key: 'Google API Key',
  openai_key: 'OpenAI Key',
  twilio_sid: 'Twilio SID',
  mac_address: 'MAC Address',
  username: 'Username',
  street_address: 'Address',
  address: 'Address',
  bank_account: 'Bank Account',
  national_id: 'National ID',
  passport_number: 'Passport Number',
  hostname: 'Hostname',
  generic_secret: 'Secret',
};

// Color mapping for different sensitive data types - security-focused palette
const getCategoryColor = (category: string): string => {
  // All sensitive data uses danger color for consistency
  return 'bg-[rgb(var(--danger))]/10 text-[rgb(var(--danger))] border border-[rgb(var(--danger))]/20';
};

export default function TextComparator({
  originalText,
  onTextChange,
  onMatchesDetected,
  maskingPolicy,
}: TextComparatorProps) {
  const [maskedText, setMaskedText] = useState('');
  const [matches, setMatches] = useState<DetectionMatch[]>([]);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Initialize component
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
    };
  }, []);

  // Main detection and masking pipeline
  useEffect(() => {
    // Clear any pending detection
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
    }

    // Reset state if text is empty
    if (!originalText || !originalText.trim()) {
      setMaskedText('');
      setMatches([]);
      setVerificationResult(null);
      onMatchesDetected([]);
      return;
    }

    // Debounce detection (100ms)
    const timeoutId = setTimeout(async () => {
      if (!isMountedRef.current) {
        return;
      }

      try {
        // Detection - Extract spans matching sensitive patterns
        const detected = await detectSensitiveText(originalText, {
          confidenceThreshold: 0.5,
        });

        if (!isMountedRef.current) {
          return;
        }

        // Update matches state
        setMatches(detected);
        onMatchesDetected(detected);

        // Transformation - Controlled rewrite operation
        const result = await maskText(originalText, detected, maskingPolicy);

        if (!isMountedRef.current) {
          return;
        }

        // Safety Verification - Ensure no secrets remain
        const verification = await verifyMaskedText(originalText, result.maskedText, detected);
        setVerificationResult(verification);

        // Output - Set masked text with fade-in animation
        setMaskedText(result.maskedText);
      } catch (error) {
        if (!isMountedRef.current) {
          return;
        }
        console.error('Detection/Masking error:', error);
        setMaskedText('');
        setMatches([]);
        setVerificationResult(null);
      }
    }, 100);

    detectionTimeoutRef.current = timeoutId;

    return () => {
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
        detectionTimeoutRef.current = null;
      }
    };
  }, [originalText, maskingPolicy, onMatchesDetected]);

  // Get unique categories from matches
  const detectedCategories = useMemo(() => {
    const categories = new Set<string>();
    matches.forEach((match) => {
      categories.add(match.category);
    });
    return Array.from(categories);
  }, [matches]);

  // Render highlighted text with detected spans
  const renderHighlightedText = useCallback((text: string, matches: DetectionMatch[]) => {
    if (matches.length === 0) {
      return <span className="whitespace-pre-wrap break-words">{text}</span>;
    }

    // Sort matches by start index
    const sortedMatches = [...matches].sort((a, b) => a.startIndex - b.startIndex);

    // Build array of text segments with highlights
    const segments: Array<{ text: string; isHighlight: boolean; category?: string }> = [];
    let lastIndex = 0;

    sortedMatches.forEach((match) => {
      // Add text before match
      if (match.startIndex > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, match.startIndex),
          isHighlight: false,
        });
      }

      // Add highlighted match
      segments.push({
        text: text.substring(match.startIndex, match.endIndex),
        isHighlight: true,
        category: match.category,
      });

      lastIndex = match.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isHighlight: false,
      });
    }

    return (
      <span className="whitespace-pre-wrap break-words">
        {segments.map((segment, idx) => {
          if (segment.isHighlight && segment.category) {
            return (
              <mark
                key={idx}
                className={cn(
                  "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300",
                  "px-1 py-0.5 rounded border border-red-300 dark:border-red-800",
                  "font-medium"
                )}
              >
                {segment.text}
              </mark>
            );
          }
          return <span key={idx} className="text-foreground">{segment.text}</span>;
        })}
      </span>
    );
  }, []);

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Input Section */}
      <Card className="overflow-hidden shadow-2xl">
        <CardHeader className="pb-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm border border-teal-500/20 dark:border-teal-400/20 shadow-lg shadow-teal-500/10">
                  <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
                </div>
                Paste Your Text
              </CardTitle>
              <CardDescription className="text-sm pl-12">
                Add text with sensitive data - we'll detect and mask it in real-time
              </CardDescription>
            </div>
            {originalText && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTextChange('')}
                className="shrink-0 backdrop-blur-sm bg-background/50"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {/* Detected Items Badges */}
          {matches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="success" className="font-medium backdrop-blur-sm bg-teal-500/20 border-teal-500/30">
                {matches.length} item{matches.length !== 1 ? 's' : ''} detected
              </Badge>
              {detectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="border-teal-200/50 dark:border-teal-800/50 text-teal-700 dark:text-teal-300 backdrop-blur-sm bg-teal-50/50 dark:bg-teal-950/30"
                >
                  {categoryDisplayMap[category] || category}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <textarea
            value={originalText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your text here... We'll automatically detect and mask sensitive information like emails, API keys, SSN, credit cards, passwords, AWS secrets, database URLs, and more."
            className={cn(
              "w-full min-h-[350px] rounded-xl border border-input/50",
              "bg-background/40 backdrop-blur-md",
              "px-5 py-4 text-sm font-mono font-light",
              "placeholder:text-muted-foreground/70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2",
              "focus-visible:bg-background/60 focus-visible:border-teal-500/50",
              "resize-none transition-all duration-300",
              "shadow-inner"
            )}
          />
        </CardContent>
      </Card>

      {/* Output Panels - Only show when there's text */}
      {originalText && originalText.trim() && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Original Text Panel */}
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 dark:bg-red-400/10 backdrop-blur-sm border border-red-500/20 dark:border-red-400/20 shadow-lg shadow-red-500/10">
                    <Eye className="h-4.5 w-4.5 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                  </div>
                  Original Text
                </CardTitle>
                {matches.length > 0 && (
                  <Badge variant="destructive" className="ml-auto backdrop-blur-sm bg-red-500/20 border-red-500/30">
                    <AlertCircle className="h-3 w-3 mr-1.5" />
                    Sensitive
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs pl-12">
                Highlighted sections contain sensitive information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={cn(
                "rounded-xl border border-red-200/30 dark:border-red-900/30",
                "bg-background/40 backdrop-blur-md p-5",
                "max-h-[500px] min-h-[300px] overflow-auto",
                "font-mono text-sm font-light",
                "shadow-inner",
                matches.length > 0 && "ring-2 ring-red-200/50 dark:ring-red-900/50 animate-pulse"
              )}>
                {renderHighlightedText(originalText, matches)}
              </div>
            </CardContent>
          </Card>

          {/* Protected Text Panel */}
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm border border-teal-500/20 dark:border-teal-400/20 shadow-lg shadow-teal-500/10">
                    <EyeOff className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
                  </div>
                  Protected Text
                </CardTitle>
                {maskedText && verificationResult?.isSafe && (
                  <Badge variant="success" className="ml-auto backdrop-blur-sm bg-teal-500/20 border-teal-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    Masked
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs pl-12">
                Sensitive data masked with asterisks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className={cn(
                "rounded-xl border border-teal-200/30 dark:border-teal-900/30",
                "bg-background/40 backdrop-blur-md p-5",
                "max-h-[500px] min-h-[300px] overflow-auto",
                "font-mono text-sm font-light",
                "shadow-inner",
                maskedText && "ring-2 ring-teal-200/50 dark:ring-teal-900/50"
              )}>
                <span className="whitespace-pre-wrap break-words text-foreground">
                  {maskedText || originalText}
                </span>
              </div>
              {maskedText && (
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(maskedText);
                  }}
                  className="w-full backdrop-blur-sm bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Protected Text
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
