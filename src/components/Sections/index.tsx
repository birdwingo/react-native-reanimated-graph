import React, { FC, useState } from 'react';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { GraphSectionsProps } from '../../core/dto/sectionsDTO';
import SectionItem from './item';

const GraphSections: FC<GraphSectionsProps> = ( {
  sections, sectionsColors, data, points,
} ) => {

  const [ colors, setColors ] = useState<string[]>( [] );

  useAnimatedReaction(
    () => sectionsColors.value,
    ( res ) => runOnJS( setColors )( res ),
    [ sectionsColors.value ],
  );

  if ( colors.length === 0 ) {

    return null;

  }

  return colors.map( ( color, index ) => (
    <SectionItem
      key={`${color}${String( index )}`}
      color={color}
      index={index}
      data={data}
      points={points}
      sections={sections}
    />
  ) );

};

export default GraphSections;
