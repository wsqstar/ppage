/**
 * Markdown 文件索引生成器
 * 使用 Vite 的 import.meta.glob 自动发现所有 Markdown 文件
 */

// 使用 Vite 的 glob 导入功能
// 注意：必须使用 eager: true 来同步加载，或者使用绝对路径
// 开发环境中，content 目录通过 vite-plugin-static-copy 插件复制到 public
// 因此我们需要使用 fetch 来加载这些文件，而不是 import.meta.glob
// 这里先用 glob 获取文件列表，然后用 fetch 加载内容
const postsModules = import.meta.glob('../../content/posts/**/*.md', { eager: false });
const pagesModules = import.meta.glob('../../content/pages/**/*.md', { eager: false });

/**
 * 从 Markdown 内容中提取标题
 * 优先级：YAML front matter 中的 title > 正文中的一级标题 > 文件名
 * @param {string} content - Markdown 文件内容
 * @param {string} filename - 文件名（作为后备）
 * @returns {string} 提取的标题
 */
function extractTitle(content, filename) {
  // 1. 尝试从 YAML front matter 中提取 title
  const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[1];
    const titleMatch = frontMatter.match(/^title:\s*["']?([^"'\n]+)["']?/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }
  
  // 2. 尝试从正文中提取一级标题（# 标题）
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // 3. 使用文件名作为后备
  return filename.replace('.md', '');
}

/**
 * 加载所有 Markdown 文件
 * @returns {Promise<Array>} Markdown 文件数组
 */
export async function loadAllMarkdownFiles() {
  const markdownFiles = [];
  
  // 加载 posts - 使用 fetch 代替 import
  for (const path in postsModules) {
    try {
      // 将相对路径转换为绝对路径
      // path 例如: '../../content/posts/welcome.md'
      // 需要转换为: '/content/posts/welcome.md'
      const absolutePath = path.replace('../..', '');
      const filename = path.split('/').pop();
      
      const response = await fetch(absolutePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      
      // 使用新的标题提取函数
      const title = extractTitle(content, filename);
      
      markdownFiles.push({
        path: absolutePath,
        content,
        title,
        type: 'post'
      });
    } catch (error) {
      console.error(`加载文件失败: ${path}`, error);
    }
  }
  
  // 加载 pages - 使用 fetch 代替 import
  for (const path in pagesModules) {
    try {
      // 将相对路径转换为绝对路径
      const absolutePath = path.replace('../..', '');
      const filename = path.split('/').pop();
      
      const response = await fetch(absolutePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      
      // 使用新的标题提取函数
      const title = extractTitle(content, filename);
      
      markdownFiles.push({
        path: absolutePath,
        content,
        title,
        type: 'page'
      });
    } catch (error) {
      console.error(`加载文件失败: ${path}`, error);
    }
  }
  
  return markdownFiles;
}

/**
 * 获取 Markdown 文件列表（仅路径和标题，不加载内容）
 * @returns {Array} 文件信息数组
 */
export function getMarkdownFileList() {
  const fileList = [];
  
  // 获取 posts 列表
  Object.keys(postsModules).forEach(path => {
    fileList.push({
      path,
      type: 'post'
    });
  });
  
  // 获取 pages 列表
  Object.keys(pagesModules).forEach(path => {
    fileList.push({
      path,
      type: 'page'
    });
  });
  
  return fileList;
}
