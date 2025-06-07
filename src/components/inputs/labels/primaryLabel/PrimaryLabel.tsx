
interface primaryLabelProps{
    label?:string
}
export default function PrimaryLabel({label}:primaryLabelProps) {
  return <label className="font-nunito mb-2 font-black capitalize">{label}</label>;
}