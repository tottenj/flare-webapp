import OrgCard from '@/components/org/orgCard/OrgCard';
import { OrgCardDto } from '@/lib/schemas/org/OrgCardDtoSchema';

export default function AdminOrgList({ cards }: { cards: OrgCardDto[] }) {
  return (
    <div className="flex flex-col gap-4">
      {cards.map((card) => (
        <OrgCard
          key={card.id}
          name={card.orgName}
          location={card.location}
          profilePicturePath={card.profilePicPath}
          href={`/admin/org/${card.id}?returnTo=/dashboard`}
        />
      ))}
    </div>
  );
}
