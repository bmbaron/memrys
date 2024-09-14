export const getDBTags = async () => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/Tester`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    } else {
      return await response.json().then((data) => {
        return data.map((tag: { tag: string }) => tag.tag);
      });
    }
  } catch (e: unknown) {
    console.error((e as Error).message);
  }
};
