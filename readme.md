# PPage 站点内容仓 — Shiqi Wang

本仓库是 [PPage](https://github.com/mappedinfo/ppage) 个人主页系统的**站点内容源**（site profile）。
它只包含内容与配置，不包含任何产品代码。产品代码统一在 `mappedinfo/ppage` 维护。

## 目录结构

```
├── config.yml     # 站点配置（个人信息、导航、项目、部署目标等）
├── content/       # Markdown 内容（posts / pages / protected / ...）
├── assets/        # 站点资源 → 部署到 /assets/（如 images/GIStudy.jpg）
└── public/        # 根级静态文件 → 部署到根路径（如 favicon GIStudy.jpg）
```

## 如何使用

在本机克隆产品仓库 `mappedinfo/ppage`，把本内容仓克隆进它的 `sites/shiqi/`（该目录被产品仓库
`.gitignore` 忽略），然后通过环境变量 `PPAGE_SITE=shiqi` 选择本 profile：

```bash
# 一次性：在产品仓库内挂载本内容仓
cd mappedinfo/ppage
git clone https://github.com/wsqstar/ppage.git sites/shiqi

# 写到 .env.local（一劳永逸）
echo 'PPAGE_SITE=shiqi' >> .env.local

# 开发 / 部署
npm run dev          # 实时预览本站点内容
npm run deploy       # 构建并推送到 config.yml 中 deploy.repository 指定的 gh-pages
```

## 部署

`config.yml` 末尾的 `deploy:` 段指定部署目标（`wsqstar/ppage` 的 `gh-pages` 分支，
自定义域名 `shiqi-wang.com`）。部署产物由产品仓库的 `scripts/deploy.sh` 构建并推送，
本仓的 `main` 分支只是内容源，`gh-pages` 分支才是线上站点。

## 加密内容

`content/protected/` 下的私密内容由产品仓库的加密脚本处理（密码通过产品仓库的
`.env.local` 中 `PPAGE_ENCRYPT_PASSWORD` 提供），加密后可安全存放于本公开仓库。
