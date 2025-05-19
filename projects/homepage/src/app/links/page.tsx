'use client';

import Link from 'next/link';
import links from './links.json';

export interface LinkData {
  name: string;
  url: string;
  slug: string;
  description?: string;
}

const LinkItem = ({ link }: { link: LinkData }) => {
  const tooltip = link.description ? `${link.slug} - ${link.description}` : link.slug;

  return (
    <div className='group relative'>
      <Link className='font-bold text-blue-500 underline hover:text-blue-700' href={`/links/${link.slug}`}>
        {link.name}
      </Link>
      <div className='absolute top-full left-0 z-10 mt-1 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white group-hover:block'>
        {tooltip}
      </div>
    </div>
  );
};

export default function LinksPage() {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <h1 className='font-bold text-2xl'>Some links</h1>
      <div className='flex flex-col'>
        {links.map((link) => (
          <LinkItem key={link.url} link={link} />
        ))}
      </div>
    </div>
  );
}
