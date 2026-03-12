import UserDashboardInfo from '@/components/dashboard/userDashboardInfo/UserDashboardInfo';

interface Props {
  email: string;
  orgName: string;
  status: string;
  profilePicPath: string | null;
  settings?: React.ReactNode;
}

export default function OrgDashboardInfoPresentational({
  email,
  orgName,
  status,
  profilePicPath,
  settings,
}: Props) {
  return (
    <UserDashboardInfo profilePicPath={profilePicPath} settings={settings}>
      <h1>{orgName}</h1>
      <p>{email}</p>
      <p>{status}</p>
    </UserDashboardInfo>
  );
}
