const timestamp = (): string => new Date().toISOString();

export const logger = {
  info(message: string): void {
    console.log(`[${timestamp()}] INFO: ${message}`);
  },

  error(message: string, error?: Error): void {
    console.error(`[${timestamp()}] ERROR: ${message}`);
    if (error) {
      console.error(`  Stack: ${error.stack ?? error.message}`);
    }
  },

  warn(message: string): void {
    console.warn(`[${timestamp()}] WARN: ${message}`);
  },
};
