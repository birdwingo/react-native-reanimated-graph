
import React from 'react';
import { render } from '@testing-library/react-native';
import ReanimatedGraph from '../src';

describe('ReanimatedGraph Tests', () => {

  it('Should render without any errors', () => {

    render(<ReanimatedGraph />)
  
  });

  it('Should render with default props', () => {

    const { getByTestId, queryByTestId } = render(<ReanimatedGraph />);

    expect(getByTestId('graphContainer')).toBeTruthy();
    expect(getByTestId('extremeValues')).toBeTruthy();
    expect(queryByTestId('xAxis')).toBeNull();
    expect(queryByTestId('yAxis')).toBeNull();

  });

  it('Should call renderExtremeValue when graph is rendered', () => {

    const renderMock = jest.fn((val) => val);
    const { getByTestId } = render(<ReanimatedGraph renderExtremeValue={renderMock} />);

    const container = getByTestId('extremeValues');

    expect(container).toBeTruthy();
    expect(renderMock).toHaveBeenCalledTimes(2);

  });

});
