export const sendImage = async (data: FormData) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/imageUpload`;
  console.log(data);
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: data
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
