export type OrgProfileDomainProps = {
  userId: string;
  orgName: string;
  status: 'PENDING';
  locationId: string;
};

export class OrgProfileDomain {
  constructor(public readonly props: OrgProfileDomainProps) {}

  static onSignUp(input: { userId: string; orgName: string; locationId: string }) {
    return new OrgProfileDomain({
      userId: input.userId,
      orgName: input.orgName,
      locationId: input.locationId,
      status: 'PENDING',
    });
  }
}
