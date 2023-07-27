import React, { FC, memo } from 'react';
import { useAnimatedStyle } from 'react-native-reanimated';
import { AnimatedSvg, AnimatedView } from '../Animated';
import { GraphWrapperProps } from '../../core/dto/graphDTO';
import GraphStyles from './Graph.styles';

const GraphWrapper: FC<GraphWrapperProps> = ( {
  children, width, height, onLayout, style,
} ) => {

  const animatedStyle = useAnimatedStyle( () => ( {
    width: width.value,
    height,
  } ) );

  return (
    <AnimatedView onLayout={onLayout} style={[ style, GraphStyles.globalContainer ]}>
      <AnimatedSvg style={animatedStyle}>
        {children}
      </AnimatedSvg>
    </AnimatedView>
  );

};

export default memo( GraphWrapper );
