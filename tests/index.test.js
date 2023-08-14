
import React, { createRef } from 'react';
import { View, Text } from 'react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import ReanimatedGraph from '../src';
import BlinkingDot from '../src/components/BlinkingDot';
import Extremes from '../src/components/Extremes';
import * as helpers from '../src/core/helpers';
import SelectionArea from '../src/components/SelectionArea';

const findPointOnPathSpy = jest.spyOn( helpers, 'findPointOnPath' );
findPointOnPathSpy.mockImplementation( () => ( { x: 0, y: 0 } ) );

describe( 'ReanimatedGraph Tests', () => {

  it( 'Should render with default props', () => {

    const { getByTestId, queryByTestId } = render( <ReanimatedGraph /> );

    expect( getByTestId( 'graphContainer' ) ).toBeTruthy();
    expect( getByTestId( 'extremeValues' ) ).toBeTruthy();
    expect( queryByTestId( 'xAxis' ) ).toBeNull();
    expect( queryByTestId( 'yAxis' ) ).toBeNull();

  } );

  it( 'Should call renderExtremeValue when graph is rendered', () => {

    const renderMock = jest.fn( ( val ) => val );
    const { getByTestId } = render( <ReanimatedGraph renderExtremeValue={renderMock} /> );

    const container = getByTestId( 'extremeValues' );

    expect( container ).toBeTruthy();
    expect( renderMock ).toHaveBeenCalledTimes( 2 );

  } );

  it( 'Should updateData', () => {

    const ref = createRef();

    const { getByTestId } = render( <ReanimatedGraph animated={false} ref={ref} /> );

    act( () => {

      ref.current.updateData( {
        xAxis: [ 0, 1 ],
        yAxis: [ 0, 1 ],
        color: 'red',
        widthRatio: 0.4,
      } );

      ref.current.updateData( {
        color: 'red',
        widthRatio: 0.4,
      } );

    } );

  } );

  it( 'Should not updateData if are the same', () => {

    const ref = createRef();

    render( <ReanimatedGraph
      animated={false}
      ref={ref}
      showYAxisLegend
      showXAxisLegend
      renderXAxisLegend={() => <View />}
      gestureEnabled={false}
    /> );

    act( () => {

      ref.current.updateData( {
        xAxis: [ 0, 1 ],
        yAxis: [ 0, 0 ],
      } );

    } );

  } );

  it( 'Should call gesture callbacks', () => {

    const onStart = jest.fn();
    const onEnd = jest.fn();

    const { getByTestId } = render( <ReanimatedGraph
      onGestureStart={onStart}
      onGestureEnd={onEnd}
      defaultWidth={1}
      onGestureUpdate={() => {}}
    /> );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'responderStart', { active: true } );
      fireEvent( getByTestId( 'gestureContainer' ), 'responderEnd', { active: true } );

    } );

    expect( onStart ).toHaveBeenCalled();
    expect( onEnd ).toHaveBeenCalled();

  } );

  it( 'Should update width', () => {

    const { getByTestId } = render( <ReanimatedGraph /> );

    getByTestId( 'graphWrapper' ).props.onLayout( {
      nativeEvent: {
        layout: {
          x: 0, y: 0, width: 100, height: 100,
        },
      },
    } );

  } );

  it( 'Should not update width if defaultWidth provided', () => {

    const { getByTestId } = render( <ReanimatedGraph defaultWidth={1} /> );

    getByTestId( 'graphWrapper' ).props.onLayout( {
      nativeEvent: {
        layout: {
          x: 0, y: 0, width: 100, height: 100,
        },
      },
    } );

  } );

} );

describe( 'BlinkingDot Tests', () => {

  it( 'Should render without any errors', () => {

    const { getByTestId } = render( <BlinkingDot show={{ value: true }} color="grey" points={{ value: [ { x: 0, y: 0 } ] }} /> );

    expect( getByTestId( 'blinkingDot' ) ).toBeTruthy();

  } );

} );

describe( 'Extremes Tests', () => {

  it( 'Should render without any errors', async () => {

    const { getByTestId } = render( <Extremes
      width={{ value: 100 }}
      height={300}
      data={{ value: { from: [], to: { x: [ 0, 1 ], y: [ 0, 5 ] } } }}
      yAxisQuantity={4}
      renderFunction={(value, type) => <Text testID={`${type}Extreme`}>{value}</Text>}
    /> );

    expect( getByTestId( 'extremeValues' ) ).toBeTruthy();
    expect( getByTestId( 'maxExtreme' ) ).toHaveTextContent('5');
    expect( getByTestId( 'minExtreme' ) ).toHaveTextContent('0');

  } );

} );

describe( 'SelectionArea Tests', () => {

  const props = {
    width: { value: 100 },
    height: 300,
    x: { value: 0 },
    active: { value: true },
    selectionArea: { value: 'custom' },
    selectionAreaData: { value: [ 0, 5, 10 ] },
    selectionLines: 'none',
    selectionLineColor: 'red',
    gestureEnabled: true,
    color: 'blue',
    pathRef: {
      current: {
        getPointAtLength: jest.fn( () => ( { x: 0, y: 0 } ) ),
        getTotalLength: jest.fn( () => 100 ),
      },
    },
    points: { value: [ { x: 0, y: 0 }, { x: 0, y: 0 } ] },
    data: { value: { from: [], to: { x: [ 0, 1 ], y: [ 0, 5 ] } } },
  };

  it( 'Should render without any errors', () => {

    const { getByTestId } = render( <SelectionArea {...props} /> );

    expect( getByTestId( 'selectionArea' ) ).toBeTruthy();

  } );

  it( 'Should work with empty selectionAreaData', () => {

    render( <SelectionArea {...props} selectionAreaData={{ value: [] }} /> );

  } );

  it( 'Should work for selectionArea = none', () => {

    render( <SelectionArea {...props} selectionArea={{ value: 'none' }} /> );

  } );

  it( 'Should work if active = false', () => {

    render( <SelectionArea {...props} active={{ value: false }} /> );

  } );

  it( 'Should work wtih one point', () => {

    render( <SelectionArea {...props} points={{ value: [ { x: 0, y: 0 } ] }} /> );

  } );

  it( 'Should work with wrong selectionAreaData provided', () => {

    render( <SelectionArea {...props} selectionAreaData={{ value: [ -10, 0 ] }} /> );

  } );

} );
