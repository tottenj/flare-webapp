export default abstract class BaseService<TDal, Ttype extends string> {
  protected dal: TDal;
  protected abstract publicFields: Partial<Record<Ttype, boolean>>

 
  constructor(DalClass: new () => TDal) {
    this.dal = new DalClass();
  }


  getPublicFields(){
    return this.publicFields
  }
}
