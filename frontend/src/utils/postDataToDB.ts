export const addNewDBTag = async (tagValue: string) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/Tester`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tag: tagValue })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (e: unknown) {
    console.error((e as Error).message);
  }
};
