import { Box, useMantineTheme } from '@mantine/core';
const About = () => {
  const theme = useMantineTheme();
  return <Box c={theme.primaryColor}>About</Box>;
};

export default About;
