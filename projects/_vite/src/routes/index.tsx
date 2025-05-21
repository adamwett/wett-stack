import { Button } from '@repo/ui/components/button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>
      <Button onClick={() => alert('hello!')} variant='outline'>
        Hello, world!
      </Button>
      <div className='h-32 w-32 bg-red-500' />
    </div>
  );
}
