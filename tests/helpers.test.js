
import { MAX_POINTS, CHART_OFFSET } from '../src/core/constants/data';
import {
  reducePoints, compareObjects, checkRatio, calculateExtremeValues,
  calculatePoints, createPath, findNumbersAround,
} from '../src/core/helpers/worklets';
import { findPointOnPath } from '../src/core/helpers';

describe( 'reducePoints worklet test', () => {

  it( `should return the same array if the array length is less than ${MAX_POINTS}`, () => {

    const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    const result = reducePoints( array );

    expect( result ).toEqual( array );

  } );

  it( `should return the reduced length of array if length > ${MAX_POINTS} and length is even number`, () => {

    const array = Array.from( Array( MAX_POINTS * 2 ).keys() );
    const result = reducePoints( array );

    expect( result ).toHaveLength( MAX_POINTS );

  } );

  it( `should return the reduced length of array if length > ${MAX_POINTS} and length is odd number`, () => {

    const array = Array.from( Array( MAX_POINTS * 2 + 1 ).keys() );
    const result = reducePoints( array );

    expect( result ).toHaveLength( MAX_POINTS );

  } );

} );

describe( 'compareObjects worklet test', () => {

  it( 'should return false', () => {

    const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    const array2 = [ 1, 2, 3, 5, 5, 6, 7, 8, 9 ];
    const result = compareObjects( array, array2 );

    expect( result ).toBeFalsy();

  } );

  it( 'should return true', () => {

    const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    const array2 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    const result = compareObjects( array, array2 );

    expect( result ).toBeTruthy();

  } );

} );

describe( 'checkRatio worklet test', () => {

  it( 'should return 1', () => {

    const result = checkRatio( 5 );

    expect( result ).toBe( 1 );

  } );

  it( 'should return 0.1', () => {

    const result = checkRatio( -5 );

    expect( result ).toBe( 0.1 );

  } );

  it( 'should return same value as provided', () => {

    const value = 0.5;
    const result = checkRatio( 0.5 );

    expect( result ).toBe( value );

  } );

} );

describe( 'calculateExtremeValues worklet test', () => {

  it( 'should calculate extremes and legend values', () => {

    const result = calculateExtremeValues( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] );

    expect( result ).toStrictEqual( {
      max: 12,
      min: 0,
      values: [ 0, 4, 8, 12 ],
    } );

  } );

} );

describe( 'calculatePoints worklet test', () => {

  it( 'should return constant value', () => {

    const data = { from: [], to: { x: [ 0, 1 ], y: [ 0, 0 ] } };
    const width = 500;
    const height = 500;
    const result = calculatePoints( data, 1, width, height );

    expect( result ).toStrictEqual( [
      { x: CHART_OFFSET, y: height - CHART_OFFSET },
      { x: width - CHART_OFFSET, y: height - CHART_OFFSET },
    ] );

  } );

  it( 'should calculate points correctly with progress 0.5', () => {

    const data = {
      from: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ],
      to: { x: [ 0, 1, 2 ], y: [ 0, 1, 2 ] },
    };
    const width = 300;
    const height = 300;
    const result = calculatePoints( data, 0.5, width, height );

    expect( result ).toStrictEqual( [
      { x: 12, y: 144 },
      { x: 150, y: 98.50000000000001 },
      { x: 288, y: 53.00000000000003 },
    ] );

  } );

  it( 'should calculate points correctly with progress 1', () => {

    const data = {
      from: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ],
      to: { x: [ 0, 1, 2 ], y: [ 0, 1, 2 ] },
    };
    const width = 300;
    const height = 300;
    const result = calculatePoints( data, 1, width, height );

    expect( result ).toStrictEqual( [
      { x: 12, y: 288 },
      { x: 150, y: 196.00000000000003 },
      { x: 288, y: 104.00000000000006 },
    ] );

  } );

  it( 'should calculate points correctly with progress 0', () => {

    const data = {
      from: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ],
      to: { x: [ 0, 1, 2 ], y: [ 3, 5, 10 ] },
    };
    const width = 300;
    const height = 300;
    const result = calculatePoints( data, 0, width, height );

    expect( result ).toStrictEqual( [ { x: 12, y: 0 }, { x: 150, y: 1 }, { x: 288, y: 2 } ] );

  } );

  it( 'should calculate points correctly if data.length === 1', () => {

    const data = {
      from: [ { x: 0, y: 0 } ],
      to: { x: [ 0 ], y: [ 3 ] },
    };
    const width = 300;
    const height = 300;
    const result = calculatePoints( data, 0, width, height );

    expect( result ).toStrictEqual( [ { x: 12, y: 288 }, { x: 288, y: 288 } ] );

  } );

} );

describe( 'createPath worklet test', () => {

  it( 'should return one point on [0, 0] position', () => {

    const result = createPath( [] );

    expect( result ).toBe( 'M0 0, L0 0' );

  } );

  it( 'should return one point by it\'s position', () => {

    const result = createPath( [ { x: 1, y: 1 } ] );

    expect( result ).toBe( 'M1 1, L1 1' );

  } );

  it( 'should calculate path for line graph', () => {

    const result = createPath( [ { x: 1, y: 1 }, { x: 2, y: 2 } ], 'line' );

    expect( result ).toBe( 'M1 1L2 2' );

  } );

} );

describe( 'findNumbersAround worklet test', () => {

  it( 'should return [0, 1]', () => {

    const result = findNumbersAround( 0.5, [ 0, 1, 2, 3, 4, 5 ] );

    expect( result ).toStrictEqual( [ 0, 1 ] );

  } );

  it( 'should work if number is in array', () => {

    const result = findNumbersAround( 3, [ 0, 1, 2, 3, 4, 5 ] );

    expect( result ).toStrictEqual( [ 2, 3 ] );

  } );

  it( 'should work if number is in array at index 0', () => {

    const result = findNumbersAround( 0, [ 0, 1, 2, 3, 4, 5 ] );

    expect( result ).toStrictEqual( [ 0, 1 ] );

  } );

} );

describe( 'findPointOnPath helper test', () => {

  it( 'should return current point if found by x position', () => {

    const pathRef = {
      current: {
        getPointAtLength: jest.fn( () => ( { x: 0, y: 0 } ) ),
        getTotalLength: jest.fn( () => 100 ),
      },
    };

    const result = findPointOnPath( pathRef, 0 );

    expect( result ).toStrictEqual( { x: 0, y: 0 } );

  } );

  it( 'should find closest point', () => {

    const pathRef = {
      current: {
        getPointAtLength: jest.fn( ( length ) => ( { x: length, y: 0 } ) ),
        getTotalLength: jest.fn( () => 100 ),
      },
    };

    const result = findPointOnPath( pathRef, 0 );

    expect( result ).toStrictEqual( { x: 0, y: 0 } );

  } );

  it( 'should find closest point that is smaller than searched', () => {

    const pathRef = {
      current: {
        getPointAtLength: jest.fn( ( length ) => ( { x: length, y: 0 } ) ),
        getTotalLength: jest.fn( () => 100 ),
      },
    };

    const result = findPointOnPath( pathRef, 200 );

    expect( result ).toStrictEqual( { x: 100, y: 0 } );

  } );

  it( 'should return length 0 if pathRef returns undefined', () => {

    const pathRef = {
      current: {
        getPointAtLength: jest.fn( ( length ) => ( { x: length, y: 0 } ) ),
        getTotalLength: jest.fn( () => undefined ),
      },
    };

    const result = findPointOnPath( pathRef, 200 );

    expect( result ).toStrictEqual( { x: 0, y: 0 } );

  } );

  it( 'should return { x: 0, y: 0 } if pathRef returns undefined', () => {

    const pathRef = {
      current: {
        getPointAtLength: jest.fn( () => undefined ),
        getTotalLength: jest.fn( () => -1 ),
      },
    };

    const result = findPointOnPath( pathRef, 200 );

    expect( result ).toStrictEqual( { x: 0, y: 0 } );

  } );

  it( 'should return { x: 0, y: 0 } if point is undefined', () => {

    const pathRef = {
      current: {
        getPointAtLength: jest.fn( () => undefined ),
        getTotalLength: jest.fn( () => 0 ),
      },
    };

    const result = findPointOnPath( pathRef, 200 );

    expect( result ).toStrictEqual( { x: 0, y: 0 } );

  } );

} );
