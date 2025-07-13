import { Profile } from '@/features/profile/components/Profile';
import RouteGuard from '@/components/auth/RouteGuard';

export default function ProfilePage() {
  return (
    <RouteGuard requireAuth={true}>
      <Profile />
    </RouteGuard>
  );
} 