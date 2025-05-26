import PrimaryLabel from "../labels/primaryLabel/PrimaryLabel";

interface dateTimeProps{
  label?:string
  required?: boolean
  name: string
}
export default function DateTime({label, required = true, name}:dateTimeProps) {
  return( <div className="flex flex-col">
  <PrimaryLabel label={label} />
  <input className="bg-tertiary p-2 rounded-2xl font-nunito" type="datetime-local" name={name}/>
  </div>);
}
