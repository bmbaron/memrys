import { Transition } from '@mantine/core';

export const TransitionedInput = ({ opened }: { opened: boolean }) => {
  return (
    <Transition mounted={opened} transition={'slide-left'} duration={400} timingFunction={'ease'}>
      {(styles) => <div style={styles}>Your modal</div>}
    </Transition>
  );
};
