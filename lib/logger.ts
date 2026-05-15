function ts(): string {
  return new Date().toISOString();
}

export const log = {
  info: (tag: string, msg: string, data?: Record<string, unknown>): void => {
    const line = data
      ? `[APP] ${ts()} INFO  [${tag}] ${msg} ${JSON.stringify(data)}`
      : `[APP] ${ts()} INFO  [${tag}] ${msg}`;
    console.log(line);
  },
  warn: (tag: string, msg: string, data?: Record<string, unknown>): void => {
    const line = data
      ? `[APP] ${ts()} WARN  [${tag}] ${msg} ${JSON.stringify(data)}`
      : `[APP] ${ts()} WARN  [${tag}] ${msg}`;
    console.warn(line);
  },
  error: (tag: string, msg: string, err?: unknown, data?: Record<string, unknown>): void => {
    const errStr = err instanceof Error ? `${err.message} | stack: ${err.stack}` : String(err);
    const line = data
      ? `[APP] ${ts()} ERROR [${tag}] ${msg} error=${errStr} ${JSON.stringify(data)}`
      : `[APP] ${ts()} ERROR [${tag}] ${msg} error=${errStr}`;
    console.error(line);
  },
};
