declare module '*.png';
declare module '*.gif';

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare interface Keyframe {
  composite?: 'accumulate' | 'add' | 'auto' | 'replace';
  easing?: string;
  offset?: number | null;
  [property: string]: string | number | null | undefined;
}
