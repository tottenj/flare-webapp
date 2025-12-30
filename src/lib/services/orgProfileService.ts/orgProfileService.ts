import 'server-only'
import AuthGateway from "@/lib/auth/authGateway";
import { locationDal} from "@/lib/dal/locationDal/LocationDal";
import { orgProfileDal } from "@/lib/dal/orgProfileDal/OrgProfileDal";
import { orgProofDal } from "@/lib/dal/orgProofDal/OrgProofDal";
import { orgSocialDal } from "@/lib/dal/orgSocialDal/OrgSocialDal";
import { userDal } from "@/lib/dal/userDal/UserDal";
import { OrgProfileDomain } from "@/lib/domain/orgProfileDomain/OrgProfileDomain";
import { AuthErrors } from "@/lib/errors/authError";
import { RequiresCleanupError } from "@/lib/errors/CleanupError";
import { OrgSignUpInput } from "@/lib/schemas/auth/orgSignUpSchema";
import { Prisma } from "@prisma/client";

export class OrgProfileService {
    static async signup(input: OrgSignUpInput, tx?:Prisma.TransactionClient){
        const auth = await AuthGateway.verifyIdToken(input.idToken);
        if(!auth.email) throw AuthErrors.EmailRequired()
        const user = await userDal.findByFirebaseUid(auth.uid, tx)
        if(!user){
            throw new RequiresCleanupError("User does not exist", auth.uid)
        }
        const location = await locationDal.create(input.org.location, tx);
        const domain = OrgProfileDomain.onSignUp({
            userId: user.id,
            orgName: input.org.name,
            locationId: location.id,
        })
        const org = await orgProfileDal.create(domain.props, tx);
        if(input.socials){
            await orgSocialDal.create(org.id, input.socials, tx)
        }
        if(input.proofs){
            await orgProofDal.create(org.id, input.proofs, tx)
        }
    }
}