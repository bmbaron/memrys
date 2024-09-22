export const fetchDataFromTable = async (tableName: string) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/${tableName}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((item: { value: string }) => item.value);
  } catch (e: unknown) {
    console.error((e as Error).message);
    return [];
  }
};

export const fetchMemryFromDB = async (date: string) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/memrys?date=${date}`;
  try {
    const response = await fetch(url, { method: 'GET', credentials: 'include' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data[0];
  } catch (err: unknown) {
    console.error((err as Error).message);
    throw err;
  }
};
