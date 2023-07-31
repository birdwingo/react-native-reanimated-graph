import { RefObject } from 'react';
import { Path } from 'react-native-svg';

export const findPointOnPath = ( pathRef: RefObject<Path>, x: number ) => {

  const length = pathRef.current?.getTotalLength() || 0;
  let start = 0;
  let end = length;

  while ( start <= end ) {

    const middle = ( start + end ) / 2;
    const point = pathRef.current?.getPointAtLength( middle ) as { x: number, y:number };

    if ( point?.x < x ) {

      start = middle + 1;

    } else if ( point?.x > x ) {

      end = middle - 1;

    } else {

      return point;

    }

  }

  return pathRef.current?.getPointAtLength(
    Math.max( 0, Math.min( Math.floor( length ), ( start + end ) / 2 ) ),
  ) ?? { x: 0, y: 0 };

};
