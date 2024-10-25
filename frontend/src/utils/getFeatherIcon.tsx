import { CSSProperties, FC } from 'react';
import { IconProps } from 'react-feather';
import classes from '../Styles.module.css';
const FeatherIcon = ({
  Type,
  style,
  height,
  hasHover,
  onClick
}: {
  Type: FC<IconProps>;
  style?: CSSProperties;
  height?: number;
  hasHover?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Type
      style={{ ...style, height: height || 20, width: 50, marginTop: 5 }}
      className={hasHover ? classes['icon-hover'] : ''}
      onClick={onClick}
    />
  );
};

export default FeatherIcon;
