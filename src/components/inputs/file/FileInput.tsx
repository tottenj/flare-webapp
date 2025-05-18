interface fileInput{
    name: string
    buttonText?:string
    required?: boolean
}

export default function FileInput({name, buttonText = "Proof of Ownership", required = false}:fileInput) {
  return (
    <>
    <label className="bg-primary cursor-pointer text-background font-nunito p-2 rounded-xl w-fit hover:bg-background border-2 hover:border-primary hover:text-primary transition ease-in-out transition-normal flex justify-center items-center font-bold text-xs">{buttonText}
     <input required={required}  className="hidden" type="file" name={name}/>
     </label>
    </>
  )
}