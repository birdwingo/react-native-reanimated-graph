import React, { FC, memo } from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '~/core/dto/iconDTO';

const Arrow: FC<IconProps> = ( { color } ) => (
  <Svg width="8" height="7" viewBox="0 0 9 7" fill="none">
    <Path fill={color} d="M3.69536 1.08967C4.09507 0.548278 4.90465 0.548279 5.30436 1.08967L8.2975 5.14381C8.78489 5.80396 8.31358 6.73776 7.493 6.73776L1.50671 6.73776C0.686134 6.73776 0.21483 5.80396 0.702217 5.14381L3.69536 1.08967Z" />
  </Svg>
);

export default memo( Arrow );
