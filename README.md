# @birdwingo/react-native-reanimated-graph

![npm downloads](https://img.shields.io/npm/dm/%40birdwingo/react-native-reanimated-graph)
![npm version](https://img.shields.io/npm/v/%40birdwingo/react-native-reanimated-graph)
![github release](https://github.com/birdwingo/react-native-reanimated-graph/actions/workflows/release.yml/badge.svg?event=pull_request)
![npm release](https://github.com/birdwingo/react-native-reanimated-graph/actions/workflows/public.yml/badge.svg?event=release)

## Features 🌟

🚀 Supercharged Performance with React-Native-Reanimated: Our library leverages the power of react-native-reanimated to ensure fluid animations and top-tier speed, making your graphs shine even with hefty data sets.

📊 Versatile Graphing: Whether it's SVG, Cubic Bezier, or any other graph type, we've got you covered.

🎨 Customizable: Tons of optional properties to make the graph fit perfectly within your app's design.

🖌 Smooth Visuals: Leveraging the power of Cubic Bezier for that polished, professional look.

📱 React-Native Optimized: Tailored specifically for React-Native, ensuring seamless integration and performance on both iOS and Android.

🔄 Dynamic Data Friendly: Easily handle real-time data updates without any performance hiccups.

💡 Well-documented: Clear and concise documentation to get you up and running in no time.

🌍 Community-Driven: We believe in the power of open-source. Join our community, contribute, or simply enjoy the product!

🔧 Regular Updates: We're continuously improving. Stay tuned for regular updates and feature additions.

❤️ Support & Collaboration: Having issues or suggestions? Our team and community are here to help!

## About

`react-native-reanimated-graph` is a React Native component that provides a customizable and animated graph for displaying data. It allows you to visualize data points on a graph and supports various configuration options to customize the appearance and behavior of the graph. It is used in the [Birdwingo mobile app](https://www.birdwingo.com) to show user portfolio graphs and market graphs.

<div style="flex-direction:row;">
  <img src="./src/assets/images/demo.gif" width="300">
  <img src="./src/assets/images/demo2.gif" width="300">
</div>

## Installation

```bash
npm install react-native-svg
npm install react-native-reanimated
npm install react-native-gesture-handler
npm install @birdwingo/react-native-reanimated-graph
```

## Usage

To use the `ReanimatedGraph` component, you need to import it in your React Native application and include it in your JSX code. Here's an example of how to use it:

```jsx
import React, { useRef } from 'react';
import { View } from 'react-native';
import ReanimatedGraph, { ReanimatedGraphPublicMethods } from '@birdwingo/react-native-reanimated-graph';

const data = {
  // Your data points here
  xAxis: [0, 1, 2, 3, 4],
  yAxis: [0, 5, 2, 7, 4],
};

const YourComponent = () => {
  const graphRef = useRef<ReanimatedGraphPublicMethods>(null);

  const updateGraphData = () => {
    // Call this function to update the data displayed on the graph
    if (graphRef.current) {
      graphRef.current.updateData(data);
    }
  };

  return (
    <View>
      <ReanimatedGraph
        ref={graphRef}
        xAxis={data.xAxis}
        yAxis={data.yAxis}
        // Add any other props as needed
      />
    </View>
  );
};

export default YourComponent;
```

## Props

 Name                    | Type                                         | Default value           | Description       
-------------------------|----------------------------------------------|-------------------------|---------------------
 `xAxis`                 | number[]                                     | [0, 1]                  | An array of numbers representing the x-axis values of the data points.
 `yAxis`                 | number[]                                     | [0, 0]                  | An array of numbers representing the y-axis values of the data points.
 `picks`                 | [PickProps](#pickprops)[]                    | [0, 0]                  | An array of points that should be on graph highlited by dot.
 `color`                 | string                                       | '#FFFFFF'               | The color of the graph line.
 `widthRatio`            | number (0 - 1)                               | 1                       | The width ratio of the graph compared to available width.
 `selectionArea`         | 'default'\|'none'\|'custom'                  | 'default'               | The selection area type. The selection area is highlighted while hovering over the graph. If `custom` you need to provide `selectionAreaData`, if `default`, selection area is to the left of the gesture point.
 `selectionAreaData`     | number[]                                     | []                      | An array of numbers representing the selection area data points.
 `height`                | number                                       | 200                     | The height of the graph component.
 `defaultWidth`          | number                                       |                         | If `defaultWidth` is not provided, width will be 100% of parent element.
 `animated`              | boolean                                      | true                    | Whether the graph should be animated.
 `animationDuration`     | number                                       | 750                     | The duration of the animation in ms.
 `smoothAnimation`       | boolean                                      | true                    | Whether the gesture animation should be smooth or not. If false, the selection dot will be only on graph points.
 `type`                  | 'curve'\|'line'                              | 'curve'                 | The type of graph line.
 `maxPoints`             | number                                       | 512                     | The maximum number of data points to display on the graph. If the data has more points than `maxPoints`, the data will be reduced so that it does not affect the shape of the graph.
 `showXAxisLegend`       | boolean                                      | false                   | Whether to show the x-axis legend.
 `xAxisLegendQuantity`   | number                                       | 4                       | The quantity of x-axis legend values to display.
 `showYAxisLegend`       | boolean                                      | false                   | Whether to show the y-axis legend.
 `yAxisLegendQuantity`   | number                                       | 4                       | The quantity of y-axis legend values to display.
 `showExtremeValues`     | boolean                                      | true                    | Whether to show extreme values (min and max) on the graph.
 `showBlinkingDot`       | boolean                                      | false                   | Whether to show a blinking dot on the graph. (Will be placed at the last point of the graph)
 `blinkingDotRadius`     | number                                       | 5                       | The radius of the blinking dot.
 `blinkingDotExpansion`  | number                                       | 10                      | The expansion of the blinking dot.
 `showSelectionDot`      | boolean                                      | true                    | Whether to show the selection dot on the graph while hovering.
 `selectionDotRadius`    | number                                       | 5                       | The radius of the selection dot.
 `selectionDotExpansion` | number                                       | 10                      | The expansion of the selection dot.
 `selectionLines`        |'horizontal'\|'vertical'\|'both'\|'none'      | 'both'                  | The type of selection lines to display.
 `selectionLineColor`    | string                                       | '#D4D4D4'               | The color of the selection lines.
 `gestureEnabled`        | boolean                                      | true                    | Whether to enable gestures on the graph.
 `containerStyle`        | ViewProps['style']                           |                         | The style object to customize the container of the graph.
 `graphStyle`            | ViewProps['style']                           |                         | The style object to customize the graph.
 `textStyle`             | TextProps['style']                           |                         | The style object to customize the text elements in the graph.
 `strokeWidth`           | number                                       | 2                       | The width of the graph line stroke.
 `strokeLinecap`         | 'round'\|'butt'\|'square'                    | 'round'                 | The shape to be used at the end of the graph line.
 `strokeDasharray`       | number[]                                     | []                      | An array of numbers defining the pattern of dashes and gaps used to stroke the graph line.
 `renderXAxisLegend`     | (value: number, index: number) => void       |                         | A function to render custom x-axis legend values. It takes two arguments, `value` - the x-axis value for which the legend is being rendered & `index` - the index of the x-axis value on legend.
 `renderYAxisLegend`     | (value: number, index: number) => void       |                         | A function to render custom y-axis legend values. It takes two arguments, `value` - the y-axis value for which the legend is being rendered & `index` - the index of the y-axis value on legend.
 `renderExtremeValue`    | (value: number, type: 'min'\|'max') => void  |                         | A function to render custom extreme values. It takes two arguments, `value` - the extreme value to be rendered, `type` - the type of extreme value, either minimum or maximum.
 `onGestureStart`        | () => void                                   |                         | A callback function invoked when a gesture is started on the graph.
 `onGestureEnd`          | () => void                                   |                         | A callback function invoked when a gesture is ended on the graph.
 `onGestureUpdate`       | (x: number, y: number, index: number) => void|                         | A callback function invoked when a gesture is updated on the graph. It takes three arguments, `x` - the x-axis value at the position of the gesture, `y` - the y-axis value at the position of the gesture, `index` - the index of the nearest data point to the gesture position.

## Public Methods

Name                  | Type                                                                                                     | Description
----------------------|----------------------------------------------------------------------------------------------------------|--------------
`updateData`          | ({xAxis, yAxis, color, widthRatio, selectionArea, selectionAreaData, showBlinkingDot, pickProps}) => void| Use this method to update the data displayed on the graph dynamically. Types for data argument are the same as mentioned above.

## Types

### PickProps

 Parameter             | Type                                   | Required
-----------------------|----------------------------------------|----------------
 `x`                   | number                                 | true
 `y`                   | number                                 | true
 `color`               | string                                 | true
 `renderLabel`         | () => JSX.Element                      | false

## Sponsor

**react-native-reanimated-graph** is sponsored by [Birdwingo](https://www.birdwingo.com).\
Download Birdwingo mobile app to see react-native-reanimated-graph in action!