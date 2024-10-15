import { CSSProperties, FC } from 'react';
import { IconProps } from 'react-feather';
import classes from '../Styles.module.css';
const FeatherIcon = ({
  Type,
  style,
  hasHover,
  onClick
}: {
  Type: FC<IconProps>;
  style?: CSSProperties;
  hasHover?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Type
      style={{ ...style, height: 20, marginTop: 5 }}
      className={hasHover ? classes['icon-hover'] : ''}
      onClick={onClick}
    />
  );
};

export default FeatherIcon;
