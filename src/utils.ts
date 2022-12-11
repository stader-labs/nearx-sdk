declare var window: unknown | undefined;

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function nameof<T>(name: keyof T) {
  return name;
}

export function range(from: number, to: number, step: number = 1) {
  return [...Array(Math.floor((to - from) / step) + 1)].map(
    (_, i) => from + i * step
  );
}

export function parseHashReturnValue(outcome: any) {
  const status = outcome.status;
  const data = status.SuccessValue;
  if (!data) {
    throw new Error('bad return value');
  }

  const buff = Buffer.from(data, 'base64');
  return buff.toString('ascii').replaceAll('"', '');
}
