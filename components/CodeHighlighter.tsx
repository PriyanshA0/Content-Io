/**
 * Syntax Highlighting Engine for Code Mode
 * Integrates react-syntax-highlighter with dynamic theme loading
 */

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  oneLight,
  coldarkDark,
  materialOceanic,
  synthwave84,
  dracula,
  nord,
  xonokai,
  atomDark,
  materialDark,
  gruvboxDark,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CodeTypography, SyntaxThemeName } from '@/app/types/styling';

interface CodeHighlighterProps {
  code: string;
  language: string;
  themeName: SyntaxThemeName;
  typography: CodeTypography;
}

// Map theme names to react-syntax-highlighter styles
const THEME_STYLE_MAP: Record<SyntaxThemeName, any> = {
  githubLight: oneLight,
  solarizedLight: oneLight,
  oneLight: oneLight,
  materialLight: oneLight,
  xcodeLight: oneLight,
  dracula: dracula,
  nord: nord,
  tokyoNight: atomDark,
  monokai: xonokai,
  oneDarkPro: atomDark,
  ayuDark: atomDark,
  gruvboxDark: gruvboxDark,
  catppuccinMocha: atomDark,
  synthwave84: synthwave84,
  cobalt2: atomDark,
  nightOwl: atomDark,
  shadesOfPurple: atomDark,
  materialDarker: materialDark,
  palenight: atomDark,
  vscDarkPlus: vscDarkPlus,
};

// Font family CSS values
const FONT_CSS: Record<string, string> = {
  jetbrains: "'JetBrains Mono', 'Courier New', monospace",
  firacode: "'Fira Code', 'Courier New', monospace",
  cascadia: "'Cascadia Code', 'Courier New', monospace",
  sourcecodepro: "'Source Code Pro', 'Courier New', monospace",
  plex: "'IBM Plex Mono', 'Courier New', monospace",
  hack: "'Hack', 'Courier New', monospace",
  courierprime: "'Courier Prime', 'Courier New', monospace",
};

export function CodeHighlighter({
  code,
  language,
  themeName,
  typography,
}: CodeHighlighterProps) {
  const themeStyle = THEME_STYLE_MAP[themeName] || vscDarkPlus;
  const fontCss = FONT_CSS[typography.fontFamily] || "'Courier New', monospace";

  return (
    <SyntaxHighlighter
      language={language}
      style={themeStyle}
      showLineNumbers
      wrapLongLines={false}
      customStyle={{
        margin: 0,
        padding: '1.5rem',
        fontSize: `${typography.fontSize}px`,
        background: 'transparent',
        lineHeight: typography.lineHeight,
        overflowX: 'auto',
        whiteSpace: 'pre',
        fontFamily: fontCss,
        fontWeight: typography.fontWeight,
        letterSpacing: `${typography.letterSpacing}px`,
        fontFeatureSettings: typography.enableLigatures ? '"liga"' : 'none',
      }}
      lineNumberStyle={{
        opacity: 0.25,
        minWidth: '2.5em',
        paddingRight: '1em',
        userSelect: 'none',
      }}
      codeTagProps={{ style: { backgroundColor: 'transparent' } }}
      lineProps={() => ({ style: { display: 'block', backgroundColor: 'transparent' } })}
    >
      {code}
    </SyntaxHighlighter>
  );
}
