export const postTagOrLocationToDB = async (newValue: string, tableName: string) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/${tableName}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: newValue })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (err: unknown) {
    console.error((err as Error).message);
  }
};
