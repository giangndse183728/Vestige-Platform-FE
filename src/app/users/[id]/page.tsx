import { PublicUserProfile } from '@/features/profile/components/VisitProfile';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  return (
    <main>
      <PublicUserProfile userId={userId} />
    </main>
  );
}