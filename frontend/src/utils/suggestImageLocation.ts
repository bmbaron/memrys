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
        console.log(`Response status: ${response.status}`);
      }
      const data = await response.json();
      return data.result;
    } catch (err: unknown) {
      return err as Error;
    }
  } else {
    console.log('no suggestion');
  }
};
export default suggestImageLocation;
