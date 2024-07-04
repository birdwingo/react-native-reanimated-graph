import React, { FC, useState } from 'react';
import { useAnimatedReaction } from 'react-native-reanimated';
import { PickProps, PicksProps } from '../../core/dto/picksDTO';
import Pick from './pick';

const Picks: FC<PicksProps> = ( { data, points, selectedX } ) => {

  const [ picksData, setPicksData ] = useState<PickProps[]>( [] );

  useAnimatedReaction(
    () => data.value,
    ( prev, res ) => prev !== res && setPicksData( res?.picks || [] ),
    [ data ],
  );

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
