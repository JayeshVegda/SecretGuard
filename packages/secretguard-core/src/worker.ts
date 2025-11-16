import { detectSensitiveText } from './detectors';
import { maskText } from './masker';
import type { DetectionMatch, DetectionOptions, MaskingPolicy, MaskedResult, WorkerMessage, WorkerResponse } from './types';

// WebWorker entry point for detection and masking
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  try {
    if (type === 'detect') {
      const { text, options } = payload as { text: string; options?: DetectionOptions };
      const matches = await detectSensitiveText(text, options);
      const response: WorkerResponse = {
        type: 'detect',
        result: matches,
      };
      self.postMessage(response);
    } else if (type === 'mask') {
      const {
        text,
        matches,
        policy,
        salt,
      } = payload as {
        text: string;
        matches: DetectionMatch[];
        policy?: MaskingPolicy;
        salt?: string;
      };
      const result = await maskText(text, matches, policy, salt);
      const response: WorkerResponse = {
        type: 'mask',
        result,
      };
      self.postMessage(response);
    }
  } catch (error) {
    self.postMessage({
      type: type,
      result: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
};

