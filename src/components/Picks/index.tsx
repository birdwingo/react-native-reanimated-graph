import React, { FC, memo, useState } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { PickProps, PicksProps } from '../../core/dto/picksDTO';
import Pick from './pick';

const Picks: FC<PicksProps> = ( {
  data, points, selectedX, active,
} ) => {

  const [ picksData, setPicksData ] = useState<PickProps[]>( [] );

  useAnimatedReaction(
    () => data.value,
    ( res ) => runOnJS( setPicksData )( res?.picks || [] ),
    [ data ],
  );

  if ( picksData.length === 0 ) {

    return null;

  }

  return picksData.map( ( item ) => (
    <Pick
      key={item.x}
      {...item}
      data={data}
      points={points}
      selectedX={selectedX}
      active={active}
    />
  ) );

};

export default memo( Picks );
