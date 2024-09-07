import { Box, Button, Image, useMantineTheme } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { Maximize2 } from 'react-feather';

const MemryImage = ({ src, key }: { src: string; key: number }) => {
  const { ref, toggle, fullscreen } = useFullscreen();
  const theme = useMantineTheme();

  return (
    <Box pos={'relative'} key={key} flex={'1 1 0'}>
      <Image ref={ref} src={src} miw={200} h={300} />
      <Button
        onClick={toggle}
        color={theme.white}
        opacity={0.8}
        pos={'absolute'}
        w={40}
        p={0}
        right={0}
        top={0}
      >
        {fullscreen ? 'Exit Fullscreen' : <Maximize2 color={theme.primaryColor} />}
      </Button>
    </Box>
  );
};

export default MemryImage;
