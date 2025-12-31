import React, { useState, useEffect } from 'react';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { loadAllMarkdownFiles } from '../utils/markdownIndex';
import { filterMarkdownByLanguage } from '../utils/i18nMarkdown';
import { useI18n } from '../i18n/I18nContext';
import styles from './Pages.module.css';

/**
 * 文档页面列表组件
 * 自动扫描 content/pages/ 目录下的所有 Markdown 文件
 */
export function Pages() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, language } = useI18n(); // 获取当前语言

  useEffect(() => {
    loadPages();
  }, [language]); // 语言变化时重新加载

  async function loadPages() {
    try {
      setLoading(true);
      setError(null);
      
      // 使用自动扫描功能加载所有 Markdown 文件
      const allMarkdownFiles = await loadAllMarkdownFiles();
      
      // 只获取 page 类型的文件
      const pageFiles = allMarkdownFiles.filter(file => file.type === 'page');
      
      // 根据当前语言过滤文件
      const filteredPages = filterMarkdownByLanguage(pageFiles, language, 'zh');
      
      // 转换为页面数据格式
      const formattedPages = filteredPages.map(file => ({
        name: file.path.split('/').pop(),
        title: file.title,
        path: file.path,
        content: file.content
      }));
      
      console.log(`当前语言: ${language}, 自动发现 ${formattedPages.length} 个文档页面`);
      setPages(formattedPages);
      
      // 默认加载第一个页面
      if (formattedPages.length > 0) {
        setSelectedPage({
          path: formattedPages[0].path,
          content: formattedPages[0].content
        });
      }
    } catch (err) {
      console.error('加载文档列表失败:', err);
      setError('加载文档列表失败');
    } finally {
      setLoading(false);
    }
  }

  async function loadPage(path) {
    try {
      // 先从已加载的 pages 中查找
      const page = pages.find(p => p.path === path);
      if (page && page.content) {
        setSelectedPage({ path, content: page.content });
        return;
      }
      
      // 如果没有预加载的内容，则通过 fetch 加载
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`加载文档失败: ${response.statusText}`);
      }
      const content = await response.text();
      setSelectedPage({ path, content });
    } catch (err) {
      console.error('加载文档失败:', err);
      setError(`加载文档失败: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className={styles.pages}>
        <div className={styles.loading}>{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pages}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pages}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('pagesPage.title')}</h1>
        {!loading && pages.length > 0 && (
          <span className={styles.count}>{t('pagesPage.count', { count: pages.length })}</span>
        )}
      </div>
      
      {pages.length === 0 && !loading ? (
        <div className={styles.empty}>
          <p>{t('pagesPage.empty')}</p>
          <p className={styles.hint}>{t('pagesPage.emptyHint')}</p>
        </div>
      ) : (
        <div className={styles.container}>
        {/* 文档列表侧边栏 */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>{t('pagesPage.listTitle')}</h2>
          <ul className={styles.pageList}>
            {pages.map((page, index) => (
              <li 
                key={index}
                className={`${styles.pageItem} ${selectedPage?.path === page.path ? styles.active : ''}`}
                onClick={() => loadPage(page.path)}
              >
                {page.title}
              </li>
            ))}
          </ul>
        </aside>

        {/* 文档内容区域 */}
        <main className={styles.content}>
          {selectedPage ? (
            <MarkdownRenderer content={selectedPage.content} />
          ) : (
            <div className={styles.empty}>{t('pagesPage.selectPage')}</div>
          )}
        </main>
      </div>
      )}
    </div>
  );
}
