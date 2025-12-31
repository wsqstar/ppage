# 部署问题排查指南

## 问题：访问自定义域名时出现 404 错误

### 症状
- 网站能打开，但CSS和JS文件404
- 错误信息：`Failed to load resource: the server responded with a status of 404`
- 访问的是自定义域名（如 `shiqi-wang.com`）

### 原因
使用了错误的 base 路径构建，或部署了旧的构建产物。

### 解决步骤

#### 步骤1：确认你的部署场景

你正在使用自定义域名 `shiqi-wang.com`，应该使用 **根域名部署模式**。

#### 步骤2：执行根域名部署

```bash
# 一键部署（自动清理、构建、部署）
./scripts/deploy.sh root
```

**脚本会自动执行以下操作：**
1. 🧹 清理旧的 `dist` 目录
2. 📦 使用根域名模式构建项目 (base = `/`)
3. 📤 部署到 GitHub Pages

#### 步骤3：等待部署生效

GitHub Pages 需要 1-5 分钟来更新内容。

#### 步骤4：清除浏览器缓存

- **Chrome/Edge**: `Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows)
- **Safari**: `Cmd+Option+R`
- 或者使用无痕模式访问

#### 步骤5：验证线上文件

访问这些URL，确认文件存在：
```
https://shiqi-wang.com/
https://shiqi-wang.com/assets/index-D5-s-R9n.css
https://shiqi-wang.com/vite.svg
```

如果还是404，检查 GitHub Pages 设置中的自定义域名配置。

---

## 快速诊断命令

```bash
# 一键部署（推荐）
./scripts/deploy.sh root

# 或手动验证构建产物
cat dist/index.html | head -15
```

---

## 不同部署场景的选择

### 场景A：自定义域名（shiqi-wang.com）
```bash
./scripts/deploy.sh root
```

### 场景B：GitHub子目录 (yourusername.github.io/ppage)
```bash
./scripts/deploy.sh subdir
# 或直接
./scripts/deploy.sh
```

### 场景C：GitHub用户页面 (yourusername.github.io)
```bash
./scripts/deploy.sh root
```

**注意**：所有部署命令都会自动执行清理、构建、部署三个步骤。

---

## 常见问题

### Q: 我修改了代码但网站没变化？
A: 清除浏览器缓存，或使用无痕模式访问。

### Q: 我重新部署了但还是404？
A: 
1. 等待 3-5 分钟
2. 检查 GitHub Actions 或部署日志
3. 确认 GitHub Pages 设置中的分支和目录正确

### Q: 如何知道我应该用哪种部署模式？
A: 
- 如果访问地址有子路径（如 `/ppage`）→ 使用 `subdir`
- 如果是根域名或自定义域名 → 使用 `root`

### Q: 我可以在本地测试构建产物吗？
A: 可以！
```bash
npm run build:root
npm run preview
```
然后访问 `http://localhost:4173`
