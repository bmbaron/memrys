import {
  Badge,
  Box, Button, Center,
  Flex, Image,
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
import FeatherIcon from "../utils/getFeatherIcon.tsx";
import {Edit} from "react-feather";

const SavedMemrys = ({ data }: { data: MemryObject }) => {
  const theme = useMantineTheme();
  return (
    <Box pt={20} mb={40}>
      <Text size={'xl'} fw={700} mt={20} mb={40}>
        {data.title}
      </Text>
      <Button pos={'absolute'} top={90} right={20} bg={'white'} variant={'default'} c={'pink'} w={50} px={'2 0'} py={'0 6'}>
        <FeatherIcon Type={Edit} />
      </Button>
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
      {data.preSignedImageURL &&
        <Center>
					<Image h={400} w={'auto'} src={data.preSignedImageURL} />
        </Center>
      }
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
