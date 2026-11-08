export default function PageContainer({
  children,
  width,
}: {
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <div className={`mx-auto w-full ${width ?? 'max-w-[1280px]'} flex flex-1 flex-col px-4`}>
      {children}
    </div>
  );
}
