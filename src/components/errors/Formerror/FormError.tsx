type FormErrorProps = {
  error?: string;
};

export default function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  return <div className="max-w-4/5 rounded bg-red-100 p-3 text-center text-red-700">{error}</div>;
}
