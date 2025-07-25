import React, { FC, memo } from 'react';
import { useAnimatedProps } from 'react-native-reanimated';
import { Mask } from 'react-native-svg';
import { AnimatedPath } from '../Animated';
import { createPath } from '../../core/helpers/worklets';
import { GraphPathProps } from '../../core/dto/graphPathDTO';
import { MASK_ID } from '../../core/constants/data';

const GraphPath: FC<GraphPathProps> = ( { pathRef, points, type, strokeWidth, strokeLinecap, strokeDasharray } ) => {

  const animatedProps = useAnimatedProps( () => ( { d: createPath( points.value, type ) } ) );

  return (
    <Mask id={MASK_ID}>
      <AnimatedPath
        ref={pathRef}
        animatedProps={animatedProps}
        stroke="white"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeDasharray={strokeDasharray}
      />
    </Mask>
  );

};

export default memo( GraphPath );
