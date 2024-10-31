type MemryData = {
  dateUTC: string;
  title: string;
  tag: string;
  location: string;
  notes?: string;
  image?: {};
};
export const sendMemryToDB = async (data: MemryData, updated: boolean) => {
  console.log(JSON.stringify(data));
  const url = `${import.meta.env.VITE_BACKEND_URL}/memrys`;
  const formData = new FormData();
  formData.append('dateUTC', data.dateUTC);
  formData.append('title', data.title);
  formData.append('tag', data.tag);
  formData.append('location', data.location);
  formData.append('notes', data.notes || '');
  formData.append('image', data.image);
  try {
    const response = await fetch(url, {
      method: updated ? 'PUT' : 'POST',
      credentials: 'include',
      body: formData
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
