import { redirect } from "next/navigation";
import verifyOrg from "./verifyOrg";

export async function redirectBasedOnRole() {
  const { claims } = await verifyOrg();
  if (claims === true) {
    redirect('/dashboard/@org');
  } else {
    redirect('/dashboard/@user');
  }
  
}
