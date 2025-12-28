export function getRandomItems<T>(array: T[], count: number): string {
  const randomValues = new Uint32Array(count);
  crypto.getRandomValues(randomValues);

  let result = '';

  for (let i = 0; i < count; i++) {
    const randomIndex = randomValues[i] % array.length;
    result += array[randomIndex];
  }

  return result;
}
