/**
 * 文档中心工具函数
 * 提供文档组织、排序、树形结构构建等功能
 */

import { extractTitle } from './markdownIndex';

/**
 * 从 Markdown 内容中提取元数据（Front Matter）
 * @param {string} content - Markdown 内容
 * @returns {Object} 元数据对象
 */
export function extractMetadata(content) {
  const metadata = {
    title: null,
    order: null,
    parent: null,
    collection: null,
    date: null,
    author: null,
    tags: [],
    category: null,
    id: null,
    pinned: false,
    sticky: false,
    priority: 0
  };

  // 提取 YAML front matter
  const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) return metadata;

  const frontMatter = frontMatterMatch[1];
  const lines = frontMatter.split('\n');

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (!key) return;

    const trimmedKey = key.trim();
    const value = valueParts.join(':').trim();

    switch (trimmedKey) {
      case 'title':
        metadata.title = value.replace(/^["']|["']$/g, '');
        break;
      case 'order':
        metadata.order = parseInt(value, 10);
        break;
      case 'parent':
        metadata.parent = value.replace(/^["']|["']$/g, '');
        break;
      case 'collection':
        metadata.collection = value.replace(/^["']|["']$/g, '');
        break;
      case 'date':
        metadata.date = value.replace(/^["']|["']$/g, '');
        break;
      case 'author':
        metadata.author = value.replace(/^["']|["']$/g, '');
        break;
      case 'category':
        metadata.category = value.replace(/^["']|["']$/g, '');
        break;
      case 'id':
        metadata.id = value.replace(/^["']|["']$/g, '');
        break;
      case 'pinned':
        metadata.pinned = value === 'true' || value === true;
        break;
      case 'sticky':
        metadata.sticky = value === 'true' || value === true;
        break;
      case 'priority':
        metadata.priority = parseInt(value, 10) || 0;
        break;
      case 'tags':
        // 处理标签数组：可能是 [tag1, tag2] 或 YAML 数组格式
        const tagsMatch = value.match(/\[(.*)\]/);
        if (tagsMatch) {
          metadata.tags = tagsMatch[1]
            .split(',')
            .map(tag => tag.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
        }
        break;
    }
  });

  return metadata;
}

/**
 * 增强文档对象，添加元数据和 ID
 * @param {Object} file - 原始文件对象
 * @returns {Object} 增强后的文档对象
 */
export function enhanceDocument(file) {
  const metadata = extractMetadata(file.content);
  
  // 生成文档 ID（如果 metadata 中没有指定）
  const id = metadata.id || generateDocumentId(file.path);
  
  return {
    ...file,
    id,
    metadata,
    title: metadata.title || file.title,
    order: metadata.order,
    parent: metadata.parent,
    collection: metadata.collection
  };
}

/**
 * 从文件路径生成文档 ID
 * @param {string} path - 文件路径
 * @returns {string} 文档 ID
 */
function generateDocumentId(path) {
  // 移除 /content/ 前缀和 .md 后缀，将路径转换为 ID
  return path
    .replace(/^\/content\//, '')
    .replace(/\.md$/, '')
    .replace(/\.(zh|en)$/, '')
    .replace(/\//g, '-');
}

/**
 * 根据类型过滤文档
 * @param {Array} documents - 文档数组
 * @param {string} type - 文档类型
 * @returns {Array} 过滤后的文档数组
 */
export function filterDocumentsByType(documents, type) {
  if (type === 'all') return documents;
  return documents.filter(doc => doc.type === type);
}

/**
 * 文档排序
 * @param {Array} documents - 文档数组
 * @param {Function|string} sortBy - 排序方式（函数或预定义键）
 * @returns {Array} 排序后的文档数组
 */
export function sortDocuments(documents, sortBy = 'order') {
  const docs = [...documents];
  
  if (typeof sortBy === 'function') {
    return docs.sort(sortBy);
  }
  
  switch (sortBy) {
    case 'order':
      // 智能排序：置顶 > 优先级 > order > 文件名
      return docs.sort((a, b) => {
        // 1. 置顶文件优先（pinned 或 sticky）
        const aPinned = a.metadata?.pinned || a.metadata?.sticky || false;
        const bPinned = b.metadata?.pinned || b.metadata?.sticky || false;
        if (aPinned !== bPinned) return bPinned - aPinned;
        
        // 2. 按优先级排序
        const aPriority = a.metadata?.priority || 0;
        const bPriority = b.metadata?.priority || 0;
        if (aPriority !== bPriority) return bPriority - aPriority;
        
        // 3. 按 order 字段排序
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        if (orderA !== orderB) return orderA - orderB;
        
        // 4. 按标题字母顺序排序
        return a.title.localeCompare(b.title);
      });
      
    case 'title':
      return docs.sort((a, b) => a.title.localeCompare(b.title));
      
    case 'date':
      return docs.sort((a, b) => {
        const dateA = a.metadata?.date || '';
        const dateB = b.metadata?.date || '';
        return dateB.localeCompare(dateA); // 降序
      });
      
    case 'path':
      return docs.sort((a, b) => a.path.localeCompare(b.path));
      
    default:
      return docs;
  }
}

/**
 * 构建文档树形结构
 * @param {Array} documents - 文档数组
 * @returns {Object} 树形结构根节点
 */
export function buildDocumentTree(documents) {
  // 增强所有文档
  const enhancedDocs = documents.map(doc => enhanceDocument(doc));
  
  // 创建文档映射
  const docMap = new Map();
  enhancedDocs.forEach(doc => {
    docMap.set(doc.id, doc);
  });
  
  // 创建树节点
  const nodeMap = new Map();
  const rootChildren = [];
  
  enhancedDocs.forEach(doc => {
    const node = {
      id: doc.id,
      title: doc.title,
      order: doc.order,
      document: doc,
      children: []
    };
    nodeMap.set(doc.id, node);
  });
  
  // 建立父子关系
  enhancedDocs.forEach(doc => {
    const node = nodeMap.get(doc.id);
    
    if (doc.parent) {
      const parentNode = nodeMap.get(doc.parent);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        console.warn(`文档 ${doc.id} 的父节点 ${doc.parent} 不存在`);
        rootChildren.push(node);
      }
    } else {
      rootChildren.push(node);
    }
  });
  
  // 对每个节点的子节点进行排序
  function sortChildren(node) {
    if (node.children.length > 0) {
      node.children.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });
      node.children.forEach(child => sortChildren(child));
    }
  }
  
  // 创建根节点
  const root = {
    id: 'root',
    title: 'Root',
    children: rootChildren
  };
  
  sortChildren(root);
  
  return root;
}

/**
 * 根据 ID 查找文档
 * @param {string} id - 文档 ID
 * @param {Object} tree - 文档树
 * @returns {Object|null} 文档对象
 */
export function findDocumentById(id, tree) {
  function search(node) {
    if (node.id === id) return node.document;
    
    if (node.children) {
      for (const child of node.children) {
        const found = search(child);
        if (found) return found;
      }
    }
    
    return null;
  }
  
  return search(tree);
}

/**
 * 获取文档的路径（面包屑）
 * @param {Object} document - 文档对象
 * @param {Object} tree - 文档树
 * @returns {Array} 路径节点数组
 */
export function getDocumentPath(document, tree) {
  if (!tree || !document) return [];
  
  const path = [];
  
  function search(node, currentPath) {
    const newPath = [...currentPath, node];
    
    if (node.id === document.id) {
      path.push(...newPath);
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (search(child, newPath)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  search(tree, []);
  
  // 移除根节点
  return path.filter(node => node.id !== 'root');
}

/**
 * 获取文档的前一个和后一个文档（用于导航）
 * @param {Object} document - 当前文档
 * @param {Array} documents - 文档数组
 * @returns {Object} { prev, next }
 */
export function getAdjacentDocuments(document, documents) {
  const index = documents.findIndex(doc => doc.id === document.id);
  
  return {
    prev: index > 0 ? documents[index - 1] : null,
    next: index < documents.length - 1 ? documents[index + 1] : null
  };
}

/**
 * 按集合分组文档
 * @param {Array} documents - 文档数组
 * @returns {Object} 集合名到文档数组的映射
 */
export function groupDocumentsByCollection(documents) {
  const groups = new Map();
  
  documents.forEach(doc => {
    const collection = doc.collection || 'default';
    if (!groups.has(collection)) {
      groups.set(collection, []);
    }
    groups.get(collection).push(doc);
  });
  
  return Object.fromEntries(groups);
}

/**
 * 搜索文档
 * @param {Array} documents - 文档数组
 * @param {string} query - 搜索关键词
 * @returns {Array} 匹配的文档数组
 */
export function searchDocuments(documents, query) {
  if (!query || query.trim() === '') return documents;
  
  const lowerQuery = query.toLowerCase();
  
  return documents.filter(doc => {
    // 搜索标题
    if (doc.title.toLowerCase().includes(lowerQuery)) return true;
    
    // 搜索内容
    if (doc.content.toLowerCase().includes(lowerQuery)) return true;
    
    // 搜索标签
    if (doc.metadata?.tags) {
      return doc.metadata.tags.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      );
    }
    
    return false;
  });
}
