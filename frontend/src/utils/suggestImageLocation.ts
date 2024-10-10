const suggestImageLocation = async (formData: FormData) => {
  if (formData) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/suggest-location`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      return data.result;
    } catch (err: unknown) {
      console.error((err as Error).message);
    }
  } else {
    console.log('no data');
  }
};
export default suggestImageLocation;
