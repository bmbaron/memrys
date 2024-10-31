import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Image,
  LoadingOverlay,
  Paper,
  Space,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { useState } from 'react';
import { CornerUpLeft, Edit } from 'react-feather';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
import MemryForm from './MemryForm.tsx';
import { MemryObject } from './ModalContent.tsx';

export type SeedData = {
  dateUTC: string;
  title: string;
  tag: string;
  location: string;
  notes?: string;
  image: {};
  imageURL?: string;
};
const SavedMemrys = ({ data, loading }: { data: MemryObject; loading: boolean }) => {
  const seedData: SeedData = {
    dateUTC: data.created_at,
    title: data.title,
    tag: data.tag,
    location: data.location,
    notes: data.notes || '',
    image: {},
    imageURL: data.mainURL || ''
  };
  const theme = useMantineTheme();
  const [editMode, setEditMode] = useState<boolean>(false);
  return (
    <Box pt={20} mb={40} pos={'relative'} bg={'white'}>
      <Button
        pos={'absolute'}
        top={30}
        right={20}
        bg={'white'}
        variant={'default'}
        c={'pink'}
        w={50}
        px={'2 0'}
        py={'0 6'}
        onClick={() => setEditMode(!editMode)}
      >
        <FeatherIcon Type={editMode ? CornerUpLeft : Edit} />
      </Button>
      {editMode ? (
        <MemryForm dateUTC={data.created_at} seedData={seedData} />
      ) : (
        <>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            color={'white'}
            overlayProps={{ radius: 'sm', blur: 2, backgroundOpacity: 0.005 }}
            loaderProps={{ color: 'pink', type: 'dots' }}
          />
          <Text size={'xl'} fw={700} mt={20} mb={40}>
            Title: {data.title}
          </Text>
          <Flex mb={20} align={'center'}>
            <Title order={5} mr={10}>
              Tagged:
            </Title>
            <Badge color={'blue'} size={'xl'}>
              <Flex>
                <Text tt={'none'} c={loading ? 'blue' : theme.white}>
                  {data.tag || '.....'}
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
                <Text tt={'none'} c={loading ? 'red' : theme.white}>
                  {data.location || '.....'}
                </Text>
              </Flex>
            </Badge>
          </Flex>
          <Space h={'sm'} />
          <Flex mb={40} w={'100%'}>
            <Title ta={'left'} order={5} mr={10}>
              Notes:
            </Title>{' '}
            <Paper ta={'left'} shadow={'xs'} p={'lg'} bd={'md'} withBorder w={'100%'}>
              <Text tt={'none'} c={theme.black}>
                {data.notes}
              </Text>
            </Paper>
          </Flex>
          <Center h={400} p={0}>
            {data.thumbnailURL && (
              <Image loading={'eager'} h={'100%'} w={'100%'} src={data.thumbnailURL} />
            )}
          </Center>
        </>
      )}
    </Box>
  );
};

export default SavedMemrys;
