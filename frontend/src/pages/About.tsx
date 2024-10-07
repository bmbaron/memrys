import { Button, Flex, Input, Text, useMantineTheme } from '@mantine/core';
const About = () => {
  const theme = useMantineTheme();
  const formData = new FormData();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      formData.append('image', e.target.files[0]);
    }
  };
  const analyzeImage = async () => {
    if (formData) {
      const url = `${import.meta.env.VITE_BACKEND_URL}/about`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
      } catch (err: unknown) {
        console.error((err as Error).message);
      }
    }
  };

  return (
    <Flex direction={'column'} c={theme.primaryColor} p={'xl'} gap={'20px'}>
      <Text>Get tag from image</Text>
      <input
        type={'file'}
        name={'image'}
        placeholder={'click to upload image'}
        onChange={handleChange}
      />
      <Button onClick={analyzeImage}>analyze</Button>
      <Input type={'text'} placeholder={'Your tag'} />
    </Flex>
  );
};

export default About;
