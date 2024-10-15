import { Button, Flex, Input, Text, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { sendImage } from '../utils/sendImageTest.ts';
const About = () => {
  const theme = useMantineTheme();
  const formData = new FormData();
  const [result, setResult] = useState();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      formData.set('image', e.target.files[0]);
    }
  };
  const analyzeImage = async () => {
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
        setResult(data.result);
      } catch (err: unknown) {
        console.error((err as Error).message);
      }
    } else {
      console.log('no data');
    }
  };

  return (
    <Flex direction={'column'} p={100} gap={100}>
      <Flex direction={'column'} c={theme.primaryColor} gap={'20px'}>
        <Text>Get tag from image</Text>
        <input
          type={'file'}
          name={'image'}
          placeholder={'click to upload image'}
          onChange={handleChange}
        />
      </Flex>
      <Flex direction={'row'} c={theme.primaryColor} gap={'20px'}>
        <Text>{`Your result is: ${result}`}</Text>
      </Flex>
      <Button
        onClick={() => {
          sendImage(formData);
          analyzeImage();
        }}
      >
        analyze
      </Button>
      <Input type={'text'} value={result} />
    </Flex>
  );
};

export default About;
