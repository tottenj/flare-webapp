export default async function fakeLoading(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
