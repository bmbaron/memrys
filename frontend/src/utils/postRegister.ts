
export const postRegister = async (data: {name: string, email: string, password: string, password2: string}) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/register`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        password2: data.password2
      })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (e: unknown) {
    console.error((e as Error).message);
  }
}