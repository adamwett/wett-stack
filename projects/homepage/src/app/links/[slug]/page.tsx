import { redirect } from 'next/navigation';
import links from '../links.json';

export async function generateStaticParams() {
  return links.map((link) => ({
    slug: link.slug,
  }));
}

export const dynamic = 'force-static';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const matchingLink = links.find((link) => link.slug === resolvedParams.slug);

  if (matchingLink) {
    redirect(matchingLink.url);
  }

  redirect('/links');
}
