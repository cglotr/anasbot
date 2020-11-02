export function getEnv(envValue: string | undefined): string[] {
  const values: string[] = [];
  if (envValue) {
    envValue.split(',').forEach((value) => {
      values.push(value);
    });
  }
  return values;
}
