import React, { FC, useState } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { PickProps, PicksProps } from '../../core/dto/picksDTO';
import Pick from './pick';

const Picks: FC<PicksProps> = ( { data, points, selectedX } ) => {

  const [ picksData, setPicksData ] = useState<PickProps[]>( [] );

  useAnimatedReaction(
    () => data.value,
    ( prev, res ) => prev !== res && runOnJS( setPicksData )( res?.picks || [] ),
    [ data ],
  );

  if ( picksData.length === 0 ) {

    return null;

  }

  return picksData.map( ( item ) => (
    <Pick
      key={item.xValue}
      {...item}
      data={data}
      points={points}
      selectedX={selectedX}
    />
  ) );

};

export default Picks;
