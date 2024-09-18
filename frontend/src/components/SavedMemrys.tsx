import {
  Badge,
  Box,
  Flex,
  // List,
  // ListItem,
  // Paper,
  Space,
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
      <Text size={'xl'} fw={500}>
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
      {/*<Box mb={20}>*/}
      {/*  <Title ta={'left'} order={5} mr={10}>*/}
      {/*    Notes:*/}
      {/*  </Title>{' '}*/}
      {/*<List*/}
      {/*  spacing={'sm'}*/}
      {/*  size={'sm'}*/}
      {/*  ta={'left'}*/}
      {/*  icon={<ArrowRightCircle color={'white'} fill={'goldenrod'} />}*/}
      {/*  p={'xl'}*/}
      {/*  bd={'md'}*/}
      {/*>*/}
      {/*{...data.notes.map((note: string, index: number) => (*/}
      {/*  <Paper*/}
      {/*    component={ListItem}*/}
      {/*    ta={'left'}*/}
      {/*    shadow={'xs'}*/}
      {/*    p={'lg'}*/}
      {/*    bd={'md'}*/}
      {/*    withBorder*/}
      {/*    key={index}*/}
      {/*  >*/}
      {/*    <Text tt={'none'} c={theme.black}>*/}
      {/*      {note}*/}
      {/*    </Text>*/}
      {/*  </Paper>*/}
      {/*))}*/}
      {/*</List>*/}
      {/*</Box>*/}
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
