export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string; back?: string }>;
}) {
  const { id } = await params;
  const { returnTo } = await searchParams;

  return (
  <div></div>
  );
}
