import { CSSProperties, FC } from 'react';
import { IconProps } from 'react-feather';

const FeatherIcon = ({ Type, style }: { Type: FC<IconProps>; style?: CSSProperties }) => {
  return <Type style={{ ...style, height: 20, marginTop: 5 }} />;
};

export default FeatherIcon;
