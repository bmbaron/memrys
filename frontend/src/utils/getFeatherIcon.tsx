import { CSSProperties, FC } from 'react';
import { IconProps } from 'react-feather';
import classes from '../Styles.module.css';
const FeatherIcon = ({
  Type,
  style,
  hasHover
}: {
  Type: FC<IconProps>;
  style?: CSSProperties;
  hasHover?: boolean;
}) => {
  return (
    <Type
      style={{ ...style, height: 20, marginTop: 5 }}
      className={hasHover ? classes['icon-hover'] : ''}
    />
  );
};

export default FeatherIcon;
