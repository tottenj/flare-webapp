import AddEventFormHero from '@/components/forms/addEventForm/AddEventFormHero';
import HeroModal from '@/components/modals/Hero/HeroModal/HeroModal';

export default async function page() {
  return (
    <HeroModal backdrop='opaque' size='4xl'>
      <AddEventFormHero/>
    </HeroModal>
  );
}
