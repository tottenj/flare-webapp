import requireAuth from '@/lib/firebase/auth/requireAuth';
import type { FlareClaims } from '@/lib/types/FlareClaims';

export default abstract class BaseService<TDal, Ttype extends string> {
  protected uid!: string;
  protected claims!: FlareClaims;
  protected dal: TDal;
  protected abstract publicFields: Partial<Record<Ttype, boolean>>

 
  constructor(DalClass: new () => TDal) {
    this.dal = new DalClass();
  }

  protected async authenticate(requiredClaims?: (keyof FlareClaims)[]) {
    const user = await requireAuth(requiredClaims as string[]);
    if (!user) throw new Error('Unauthorized');
    this.uid = user.uid;
    this.claims = user.claims as FlareClaims;
  }

  getPublicFields(){
    return this.publicFields
  }

  
}
