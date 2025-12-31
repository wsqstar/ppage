/**
 * 文档中心使用示例
 * 展示如何使用 DocumentCenter 组件的各种功能
 */

import React from 'react';
import { DocumentCenter } from '../components/documentation/DocumentCenter';

/**
 * 示例 1: 默认的文档中心
 * 展示所有类型的文档，使用默认配置
 */
export function DefaultDocumentCenter() {
  return <DocumentCenter />;
}

/**
 * 示例 2: Posts 文档中心
 * 只展示 post 类型的文档
 */
export function PostsDocumentCenter() {
  return (
    <DocumentCenter
      type="post"
      title="博客文章"
      showCount={true}
    />
  );
}

/**
 * 示例 3: Pages 文档中心
 * 只展示 page 类型的文档
 */
export function PagesDocumentCenter() {
  return (
    <DocumentCenter
      type="page"
      title="文档页面"
      showCount={true}
    />
  );
}

/**
 * 示例 4: 特定集合的文档中心
 * 展示特定集合的文档（通过 front matter 中的 collection 字段）
 */
export function CollectionDocumentCenter() {
  return (
    <DocumentCenter
      collection="user-guide"
      title="用户指南"
      enableTree={true}
      showBreadcrumb={true}
    />
  );
}

/**
 * 示例 5: 树形结构文档中心
 * 使用树形结构展示有层级关系的文档
 */
export function TreeDocumentCenter() {
  return (
    <DocumentCenter
      type="page"
      title="产品文档"
      enableTree={true}
      showBreadcrumb={true}
      layout="sidebar"
    />
  );
}

/**
 * 示例 6: 自定义排序
 * 使用自定义排序函数
 */
export function CustomSortDocumentCenter() {
  // 自定义排序：按日期降序
  const sortByDate = (a, b) => {
    const dateA = a.metadata?.date || '';
    const dateB = b.metadata?.date || '';
    return dateB.localeCompare(dateA);
  };

  return (
    <DocumentCenter
      type="post"
      title="最新文章"
      customSort={sortByDate}
      showCount={true}
    />
  );
}

/**
 * 示例 7: 自定义过滤
 * 使用自定义过滤函数，只显示特定标签的文档
 */
export function CustomFilterDocumentCenter() {
  // 自定义过滤：只显示包含 "tutorial" 标签的文档
  const filterByTag = (doc) => {
    return doc.metadata?.tags?.includes('tutorial');
  };

  return (
    <DocumentCenter
      type="all"
      title="教程文档"
      customFilter={filterByTag}
      enableTree={true}
    />
  );
}

/**
 * 示例 8: 带回调的文档中心
 * 监听文档切换事件
 */
export function CallbackDocumentCenter() {
  const handleDocumentChange = (doc) => {
    console.log('切换到文档:', doc.title);
    // 可以在这里执行其他操作，如更新 URL、统计等
  };

  return (
    <DocumentCenter
      type="all"
      title="所有文档"
      onDocumentChange={handleDocumentChange}
    />
  );
}

/**
 * 示例 9: Dropdown 布局
 * 使用下拉菜单选择文档
 */
export function DropdownDocumentCenter() {
  return (
    <DocumentCenter
      type="page"
      title="文档中心"
      layout="dropdown"
    />
  );
}

/**
 * 示例 10: 多个文档中心组合
 * 在一个页面中使用多个文档中心组件
 */
export function MultipleDocumentCenters() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* 最新文章 */}
      <section>
        <DocumentCenter
          type="post"
          title="最新文章"
          customSort="date"
          showCount={true}
        />
      </section>

      {/* 用户指南 */}
      <section>
        <DocumentCenter
          collection="user-guide"
          title="用户指南"
          enableTree={true}
          showBreadcrumb={true}
        />
      </section>

      {/* API 文档 */}
      <section>
        <DocumentCenter
          collection="api-docs"
          title="API 文档"
          enableTree={true}
          layout="sidebar"
        />
      </section>
    </div>
  );
}

/**
 * 示例 11: 自定义样式的文档中心
 * 使用自定义 CSS 类
 */
export function StyledDocumentCenter() {
  return (
    <DocumentCenter
      type="page"
      title="定制化文档中心"
      className="custom-doc-center"
      enableTree={true}
    />
  );
}
