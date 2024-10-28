import {
  Badge,
  Box,
  Flex,
  Paper,
  Space,
  // List,
  // ListItem,
  // Paper,
  // Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
// import { ArrowRightCircle } from 'react-feather';
// import MemryImage from './MemryImage.tsx';
import { MemryObject } from './ModalContent.tsx';

const SavedMemrys = ({ data }: { data: MemryObject }) => {
  const theme = useMantineTheme();
  return (
    <Box pt={20} mb={40}>
      <Text size={'xl'} fw={700} mt={20} mb={40}>
        {data.title}
      </Text>
      <Flex mb={20} align={'center'}>
        <Title order={5} mr={10}>
          Tagged:
        </Title>
        {/*{...data.tags.map((tag: string, index: number) => (*/}
        <Badge color={'blue'} size={'xl'}>
          <Flex>
            <Text tt={'none'} c={theme.white}>
              {data.tag}
            </Text>
          </Flex>
        </Badge>
        {/*))}*/}
      </Flex>
      <Flex mb={20} align={'center'}>
        <Title order={5} mr={10}>
          Location:
        </Title>
        <Badge color={'red'} size={'xl'}>
          <Flex>
            <Text tt={'none'} c={theme.white}>
              {data.location}
            </Text>
          </Flex>
        </Badge>
      </Flex>
      <Space h={'xl'} />
      <Flex mb={20} w={'100%'}>
        <Title ta={'left'} order={5} mr={10}>
          Notes:
        </Title>{' '}
        <Paper
          ta={'left'}
          shadow={'xs'}
          p={'lg'}
          bd={'md'}
          withBorder
          w={'100%'}
          bg={!data.notes ? 'lightgrey' : 'none'}
        >
          <Text tt={'none'} c={theme.black}>
            {data.notes || '...nothing yet'}
          </Text>
        </Paper>
      </Flex>
      {/*<Stack gap={20}>*/}
      {/*  <Title ta={'left'} order={5} mr={10}>*/}
      {/*    Photos:*/}
      {/*  </Title>*/}
      {/*  <Flex wrap={'wrap'}>*/}
      {/*    {...data.images.map((imgSrc: string, index: number) => (*/}
      {/*      <MemryImage src={imgSrc} key={index} />*/}
      {/*    ))}*/}
      {/*  </Flex>*/}
      {/*</Stack>*/}
    </Box>
  );
};

export default SavedMemrys;
