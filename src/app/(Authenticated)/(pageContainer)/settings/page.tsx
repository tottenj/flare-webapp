import HeroCard from '@/components/ui/HeroCard/HeroCard';
import HeroSeparator from '@/components/ui/HeroSeparator/HeroSeparator';
import PageHeading from '@/components/ui/PageHeading/PageHeading';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';

export default async function SettingsPage() {
  return (
    <div className="grid grid-cols-[1fr_3fr]">
      <PageHeading subText="Manage your account and preferences.">Settings</PageHeading>
      <HeroCard className="ml-auto w-3/4 border-2">
        <HeroCard.Content>
          <div className="grid gap-y-4">
            <SettingsPageItem heading="Appearance" subText="Manage How Flare Looks On Your Device">
              <ThemeToggle />
            </SettingsPageItem>
           
            <SettingsPageItem
              heading="Organization"
              subText="Hosting Events? Set up and organization profile"
            >
              <p></p>
            </SettingsPageItem>
          </div>
        </HeroCard.Content>
      </HeroCard>
    </div>
  );
}

function SettingsPageItem({
  heading,
  subText,
  children,
}: {
  heading: string;
  subText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between ">
      <PageHeading headingLevel={'p'} headingSize="xs" subText={subText}>
        {heading}
      </PageHeading>
      {children}
    </div>
  );
}
