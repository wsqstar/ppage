#!/bin/bash

# PPage 本地部署脚本
# 用于将构建产出部署到 GitHub Pages

set -e

echo "🚀 开始构建和部署..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build

# 2. 进入构建产出目录
cd dist

# 3. 初始化 git 仓库（如果还没有）
if [ ! -d ".git" ]; then
  echo "🔧 初始化 Git 仓库..."
  git init
  git checkout -b gh-pages
fi

# 4. 添加所有文件
echo "📝 添加文件..."
git add -A

# 5. 提交
echo "💾 提交更改..."
git commit -m "deploy: 更新站点 $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有更改需要提交"

# 6. 推送到 GitHub
echo "📤 推送到 GitHub..."
git remote add origin https://github.com/mappedinfo/ppage.git 2>/dev/null || true
git remote set-url origin https://github.com/mappedinfo/ppage.git
git push -f origin gh-pages

echo "✅ 部署完成！"
echo "📁 产出目录: dist/"
echo "🌐 请访问: https://mappedinfo.github.io/ppage/"

cd ..
