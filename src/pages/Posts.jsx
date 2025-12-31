import React from 'react';
import { DocumentCenter } from '../components/documentation/DocumentCenter';
import { useI18n } from '../i18n/I18nContext';
import styles from './Posts.module.css';

/**
 * 博客文章列表页面组件
 * 使用 DocumentCenter 组件实现
 */
export function Posts() {
  const { t } = useI18n();

  return (
    <div className={styles.posts}>
      <DocumentCenter
        type="post"
        title={t('posts.title')}
        showCount={true}
        layout="sidebar"
        className={styles.documentCenter}
      />
    </div>
  );
}
