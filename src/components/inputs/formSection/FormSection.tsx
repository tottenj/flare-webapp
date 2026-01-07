interface formSectionProps{
    text: string
    children: React.ReactNode
    blurb?:string
}
export default function FormSection({text, children, blurb}:formSectionProps) {
  return (
    <div className="mt-4 mb-8 w-full h-full">
      <h2>{text}</h2>
      <hr></hr>
      <p className="mt-2 pl-2 pr-2">{blurb}</p>
      {children}
    </div>
  );
}
