import { CSSProperties, ReactNode } from "react";

type HStackProps = { children: ReactNode, gap?: Gap };

export function HStack({ children, gap = 'none' }: HStackProps) {
  const styles = useStyles({ gap }, $HStackStyle);

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

const $HStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 0
};

type Gap = 'none' | 'sm' | 'md' | 'lg';

type StyleOptions = {
  gap: Gap
};