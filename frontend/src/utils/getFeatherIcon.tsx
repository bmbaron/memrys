import { FC } from 'react';
import { IconProps } from 'react-feather';

const FeatherIcon = ({ Type }: { Type: FC<IconProps> }) => {
  return <Type style={{ height: 20, marginTop: 5 }} />;
};

export default FeatherIcon;
