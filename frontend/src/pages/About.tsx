import {Box, Text, Title, useMantineTheme} from '@mantine/core';
const About = () => {
  const theme = useMantineTheme();
  return <Box c={theme.primaryColor}>
    <Title order={1}>This is an h1 title</Title>
    <Title order={2}>This is an h2 title</Title>
    <Text span>This is some text content</Text>
    <Text>About</Text>
  </Box>;
};

export default About;
