import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';

interface Props {
  email: string;
  orgName: string;
  status: string;
  profilePicPath?: string;
}

export default function OrgDashboardInfoPresentational({
  email,
  orgName,
  status,
  profilePicPath,
}: Props) {
  return (
    <div className="relative h-full w-full rounded-2xl bg-white p-4 shadow-2xl">
      <div className="flex h-full items-center gap-8">
        <ProfilePicture src={profilePicPath} size={150} />
        <div className="flex flex-col">
          <h1>{orgName}</h1>
          <p>{email}</p>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}
