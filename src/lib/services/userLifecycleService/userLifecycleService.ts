import { userDal } from "@/lib/dal/userDal/UserDal"
import { AuthErrors } from "@/lib/errors/authError"
import "server-only"

export class UserLifecycleService{
    static async onVerifiedSignIn(firebaseUid: string){
        const user = await userDal.findByFirebaseUid(firebaseUid)
        if(!user) throw AuthErrors.SigninFailed()
        if(user.status === "PENDING") await userDal.markActive(firebaseUid)
    }
}