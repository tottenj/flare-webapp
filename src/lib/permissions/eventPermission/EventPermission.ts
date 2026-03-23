import { AuthenticatedOrganization } from "@/lib/types/AuthenticatedOrganization";
import { EventStatus, OrgStatus } from "../../../../prisma/generated/enums";

export default class EventPermission {
  static canView(
    event: { organizationId: string; status: EventStatus; organization: { status: OrgStatus } },
    actor?: AuthenticatedOrganization
  ) {
    const isOwner = actor?.orgId === event.organizationId;
    const isPublished = event.status === EventStatus.PUBLISHED;
    const isOrgVerified = event.organization.status === OrgStatus.VERIFIED;

    return isOwner || (isPublished && isOrgVerified);
  }

  static canEdit(event: { organizationId: string }, actor: AuthenticatedOrganization) {
    return actor.orgId === event.organizationId;
  }

  static canDelete(event: { organizationId: string }, actor: AuthenticatedOrganization) {
    return actor.orgId === event.organizationId;
  }

  static canCreate(actor: AuthenticatedOrganization) {
    return !!actor.orgId;
  }
}
