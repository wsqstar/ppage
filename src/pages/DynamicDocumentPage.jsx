import React from 'react';
import { DocumentCenter } from '../components/documentation/DocumentCenter';
import { useI18n } from '../i18n/I18nContext';
import styles from './Pages.module.css'; // 复用 Pages 的样式

/**
 * 动态文档页面组件
 * 根据传入的配置自动渲染文档中心
 * 
 * @param {Object} props - 组件属性
 * @param {Object} props.config - 文件夹配置
 */
export function DynamicDocumentPage({ config }) {
  const { t } = useI18n();

  if (!config) {
    return (
      <div className={styles.pages}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pages}>
      <DocumentCenter
        type={config.type || 'page'}
        collection={config.name}
        title={config.title}
        showCount={true}
        enableTree={config.enableTree}
        showBreadcrumb={config.showBreadcrumb}
        layout={config.layout || 'sidebar'}
        className={styles.documentCenter}
      />
    </div>
  );
}
