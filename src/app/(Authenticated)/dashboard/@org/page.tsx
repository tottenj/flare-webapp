'use server';

export default async function OrgDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
 
  return (
    <div className="grid h-full grid-cols-1 grid-rows-[1fr_4fr] gap-4 md:grid-cols-2">
 
    </div>
  );
}
