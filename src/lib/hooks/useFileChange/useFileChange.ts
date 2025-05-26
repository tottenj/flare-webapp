import { useState } from "react";

export default function useFileChange() {
 const [validFiles, setValidFiles] = useState<{ key: string; file: File }[]>([]);
 
 function handleFileChange(key: string, file: File) {
   setValidFiles((prev) => [...prev.filter((f) => f.key !== key), { key, file }]);
 }

 return {handleFileChange, validFiles}
}