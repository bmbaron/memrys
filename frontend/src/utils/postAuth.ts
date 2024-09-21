const postRegister = async (data: {
  name: string;
  email: string;
  password: string;
  password2: string;
}) => {
  const { name, email, password, password2 } = data;
  const url = `${import.meta.env.VITE_BACKEND_URL}/register`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        password2: password2
      })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (err: unknown) {
    console.error((err as Error).message);
    return err;
  }
};

const postLogin = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const url = `${import.meta.env.VITE_BACKEND_URL}/login`;
  const loginURL = url + `?email=${email}&password=${password}`;
  try {
    const response = await fetch(loginURL, {
      method: 'Get'
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    console.error((err as Error).message);
    return err;
  }
};
export { postLogin, postRegister };
