import { trpc } from '@/router';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test')({
  component: RouteComponent,
});

function RouteComponent() {
  const testQuery = useQuery(trpc.threads.all.queryOptions());

  console.log(testQuery.data);

  return <div>{testQuery.data?.toString() ?? 'nothing'}</div>;
}
