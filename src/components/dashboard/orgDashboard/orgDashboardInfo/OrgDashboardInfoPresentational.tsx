import OrgSettings from '@/components/dashboard/settings/orgSettings/OrgSettings';
import UserDashboardInfo from '@/components/dashboard/userDashboardInfo/UserDashboardInfo';


interface Props {
  email: string;
  orgName: string;
  status: string;
  profilePicPath: string | null;
}

export default async function OrgDashboardInfoPresentational({
  email,
  orgName,
  status,
  profilePicPath,
}: Props) {
  return (
    <UserDashboardInfo profilePicPath={profilePicPath} settings={<OrgSettings />}>
        <h1>{orgName}</h1>
        <p>{email}</p>
        <p>{status}</p>
    </UserDashboardInfo>
  );
}
