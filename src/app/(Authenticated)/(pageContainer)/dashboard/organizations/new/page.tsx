import OrganizationForm from '@/features/org-signup/components/OrganizationForm';
import PageHeading from '@/components/ui/PageHeading/PageHeading';
import PageSplitSection from '@/components/ui/PageSplitSection/PageSplitSection';

export default function page() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        headingLevel={1}
        subText="Start an organization profile for the group you host events with."
        withSeparator
      >
        Create New Organization
      </PageHeading>
      <PageSplitSection
        heading="Organization Details"
        subText="Your profile stays private while you finish setting it up."
      >
        <OrganizationForm />
      </PageSplitSection>
    </div>
  );
}
