import { FileWithPath } from '@mantine/dropzone';

type MemryData = {
  title: string;
  tag: string;
  location: string;
  notes?: string[];
  photos?: FileWithPath[];
};
export const postMemryToDB = async (data: MemryData) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/memrys`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid token. Please login again.');
      }
    } else {
      return response.json();
    }
  } catch (e: unknown) {
    return { error: (e as Error).message };
  }
};
