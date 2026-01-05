export function expectFail(result: any) {
  if (result.ok) {
    throw new Error('Expected failure');
  }
  return result.error;
}
