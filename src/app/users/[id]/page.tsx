import { PublicUserProfile } from '@/features/profile/components/VisitProfile';

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const userId = parseInt(params.id, 10);

  return (
    <main>
      <PublicUserProfile userId={userId} />
    </main>
  );
}
