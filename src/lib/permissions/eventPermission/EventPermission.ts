import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import { EventStatus, OrgStatus } from '../../../../prisma/generated/enums';

export type EventActor =
  | AuthenticatedOrganization
  | (AuthenticatedUser & {
      organizationIds: readonly string[];
    });

export default class EventPermission {
  static isMember(organizationId: string, actor?: EventActor) {
    if (!actor) return false;
    return 'orgId' in actor
      ? actor.orgId === organizationId
      : actor.organizationIds.includes(organizationId);
  }

  static canView(
    event: { organizationId: string; status: EventStatus; organization: { status: OrgStatus } },
    actor?: EventActor
  ) {
    const isMember = this.isMember(event.organizationId, actor);
    const isPublished = event.status === EventStatus.PUBLISHED;
    const isOrgVerified = event.organization.status === OrgStatus.VERIFIED;

    return isMember || (isPublished && isOrgVerified);
  }

  static canEdit(event: { organizationId: string }, actor: EventActor) {
    return this.isMember(event.organizationId, actor);
  }

  static canDelete(event: { organizationId: string }, actor: AuthenticatedOrganization) {
    return actor.orgId === event.organizationId;
  }

  static canCreate(actor: AuthenticatedOrganization) {
    return !!actor.orgId;
  }
}
