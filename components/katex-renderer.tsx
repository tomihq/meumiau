// src/components/katex-renderer.tsx
'use client'; // This must be a client component as react-katex interacts with the DOM

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

interface KaTeXRendererProps {
  math: string;
  block?: boolean; // True for $$...$$ equations, false for $...$
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ math, block = false }) => {
  if (block) {
    return (
      <BlockMath
        math={math}
        errorColor="#cc0000" // Optional: custom error color
      />
    );
  } else {
    return (
      <InlineMath
        math={math}
        errorColor="#cc0000" // Optional: custom error color
      />
    );
  }
};