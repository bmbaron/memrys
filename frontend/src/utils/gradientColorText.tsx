import { Text, Title, TitleOrder } from '@mantine/core';
export const getGradientColorText = (
  text: string,
  color1: string,
  color2: string,
  order: TitleOrder
) => {
  return (
    <Text
      component={Title}
      order={order}
      fw={900}
      variant={'gradient'}
      gradient={{ from: color1, to: color2, deg: 90 }}
    >
      {text}
    </Text>
  );
};
