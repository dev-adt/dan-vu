import { headers } from 'next/headers';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  await headers();
  return <HomeClient />;
}

