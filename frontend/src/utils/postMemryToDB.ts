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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (e: unknown) {
    console.error((e as Error).message);
  }
};
