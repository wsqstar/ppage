import React from 'react';
import { DocumentCenter } from '../components/documentation/DocumentCenter';
import { useI18n } from '../i18n/I18nContext';
import styles from './Pages.module.css';

/**
 * 文档页面列表组件
 * 使用 DocumentCenter 组件实现
 */
export function Pages() {
  const { t } = useI18n();

  return (
    <div className={styles.pages}>
      <DocumentCenter
        type="page"
        title={t('pagesPage.title')}
        showCount={true}
        layout="sidebar"
        className={styles.documentCenter}
      />
    </div>
  );
}
