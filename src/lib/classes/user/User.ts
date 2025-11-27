import { User as UserModel } from '@/app/generated/prisma';

export default class User{
    id: string;
    email: string;
    accountType: string

    constructor(payload: UserModel){
        this.id = payload.id;
        this.email = payload.email;
        this.accountType = payload.account_type;
    }



    toJSON(){
        return {
            id: this.id,
            email: this.email,
            accountType: this.accountType
        }
    }
}