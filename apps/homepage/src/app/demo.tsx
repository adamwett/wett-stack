import React from 'react';

async function getData() {
  // Simulate data fetching with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    message: 'Hello from the server!',
    timestamp: new Date().toISOString(),
  };
}

export default async function Demo() {
  const data = await getData();

  return (
    <div className='p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md'>
      <h1 className='text-xl font-bold mb-4'>Server Component Demo</h1>
      <p className='mb-2'>{data.message}</p>
      <p className='text-sm text-gray-500'>Generated at: {data.timestamp}</p>
    </div>
  );
}
