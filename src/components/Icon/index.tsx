import React, { FC, useMemo, memo } from 'react';
import icons from '../../core/constants/icons';
import { IconProps } from '../../core/dto/iconDTO';

const Icon:FC<IconProps> = ( {
  icon, ...props
} ) => {

  const IconComponent = useMemo( () => icons[icon], [ icon ] );

  return (
    <IconComponent {...props} />
  );

};

export default memo( Icon );
