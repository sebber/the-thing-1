import { CSSProperties, ReactNode } from "react";

type VStackProps = { children: ReactNode, gap?: Gap }

export function VStack({ children, gap = 'none' }: VStackProps) {
  const styles = useStyles({ gap }, $VStackStyle);

  return <div style={styles}>{children}</div>
}

function useStyles({ gap }: StyleOptions, defaultStyle: CSSProperties): CSSProperties {
  const style = defaultStyle;

  if (gap === 'sm') {
    style.gap = '2px';
  } else if (gap === 'md') {
    style.gap = '4px';
  } else if (gap === 'lg') {
    style.gap = '8px';
  }

  return style;
}

const $VStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0
};

type Gap = 'none' | 'sm' | 'md' | 'lg';

type StyleOptions = {
  gap: Gap
};