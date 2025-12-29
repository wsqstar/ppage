import React, { useMemo } from 'react';
import { renderMarkdown } from '../../utils/markdown';
import styles from './MarkdownRenderer.module.css';
import 'highlight.js/styles/github-dark.css';

/**
 * Markdown 渲染器组件
 */
export function MarkdownRenderer({ content, className = '' }) {
  // 使用 useMemo 缓存渲染结果
  const html = useMemo(() => {
    if (!content) return '';
    return renderMarkdown(content);
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <div 
      className={`${styles.markdown} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
