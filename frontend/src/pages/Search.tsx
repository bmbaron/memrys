import { Box, Flex, Paper, Title } from '@mantine/core';
import FeatherIcon from '../utils/getFeatherIcon.tsx';

const Search = () => {
  return (
    <Paper w={{ base: 700, xs: '100vw', md: 700 }} m={'auto'} bg={'black'} h={'100%'}>
      <Flex ta={'left'} mx={25} my={20} justify={'space-between'} align={'center'}>
        <Title order={1} c={'white'}>
          Search
        </Title>
        <Flex
          gap={10}
          align={'center'}
          justify={'space-around'}
          bg={'rgba(255, 255, 255, 0.85)'}
          h={55}
          style={{
            borderRadius: 50,
            transition: 'width 100ms linear'
          }}
          p={10}
        >
          <Box>yooaljfsdaf</Box>
          <FeatherIcon
            Type={Search}
            hasHover
            onClick={() => {
              console.log('clicked');
            }}
          />
        </Flex>
      </Flex>
    </Paper>
  );
};

export default Search;
