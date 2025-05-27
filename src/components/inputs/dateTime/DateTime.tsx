import PrimaryLabel from "../labels/primaryLabel/PrimaryLabel";

interface dateTimeProps{
  label?:string
  required?: boolean
  name: string
}
export default function DateTime({label, required = true, name}:dateTimeProps) {
  return( <div className="flex flex-col">
  <PrimaryLabel label={label} />
  <input required={required} className="bg-tertiary p-2 rounded-2xl font-nunito" type="datetime-local" defaultValue={Date.now()} name={name}/>
  </div>);
}
