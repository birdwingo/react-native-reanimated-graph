import React, { FC } from 'react';
import { useAnimatedProps } from 'react-native-reanimated';
import { AnimatedRect } from '../Animated';
import { MASK_ID } from '../../core/constants/data';
import { SectionItemProps } from '../../core/dto/sectionsDTO';
import { findNumbersAround } from '../../core/helpers/worklets';

const SectionItem: FC<SectionItemProps> = ( {
  color, index, data, points, sections,
} ) => {

  const animatedProps = useAnimatedProps( () => {

    const start = sections.value[index];
    const end = sections.value[index + 1];

    const [ closestStart ] = findNumbersAround( start, data.value.to.x );
    const [ closestEnd ] = findNumbersAround( end, data.value.to.x );

    const startPoint = points.value[data.value.to.x.indexOf( closestStart )]?.x;
    const endPoint = points.value[data.value.to.x.indexOf( closestEnd )]?.x;

    if ( closestStart === undefined || closestEnd === undefined ) {

      return { x: 0, width: 0 };

    }

    return { x: startPoint, width: endPoint - startPoint };

  }, [] );

  return (
    <AnimatedRect
      mask={`url(#${MASK_ID})`}
      animatedProps={animatedProps}
      fill={color}
      y="0"
      height="100%"
    />
  );

};

export default SectionItem;
