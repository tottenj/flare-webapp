import LinkButton from '@/components/buttons/linkButton/LinkButton';
import HeroCard from '@/components/ui/HeroCard/HeroCard';
import PageHeading from '@/components/ui/PageHeading/PageHeading';
import PageSplitSection from '@/components/ui/PageSplitSection/PageSplitSection';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';

export default async function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading headingLevel={1} subText="Manage your account and preferences." withSeparator>
        Settings
      </PageHeading>
      <PageSplitSection
        heading="General Settings"
        subText="Manage general account settings."
        contentRatio="wide"
      >
        <HeroCard className="ml-auto w-3/4 border-2">
          <HeroCard.Content>
            <div className="grid gap-y-4">
              <SettingsPageItem
                heading="Appearance"
                subText="Manage How Flare Looks On Your Device"
              >
                <ThemeToggle />
              </SettingsPageItem>

              <SettingsPageItem
                heading="Organization"
                subText="Hosting Events? Set up and organization profile"
              >
                <LinkButton href="/dashboard/organizations/new" variant="primary">
                  Create Organization
                </LinkButton>
              </SettingsPageItem>
            </div>
          </HeroCard.Content>
        </HeroCard>
      </PageSplitSection>
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
    <div className="flex items-center justify-between gap-8">
      <PageHeading headingLevel={'p'} headingSize="xs" subText={subText}>
        {heading}
      </PageHeading>
      {children}
    </div>
  );
}
