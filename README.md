# Focusmee

Focusmee 是一个使用 Astro 构建的中文个人站，用来发布博客、电影短笺和个人图片。站点完全静态生成，部署到 GitHub Pages。

## 技术栈

- Astro 6
- Markdown / MDX Content Collections
- RSS 与 Sitemap
- Giscus 评论
- 原生 Astro 组件与 CSS，无 React 或动画运行时

## 本地开发

```bash
npm install
npm run dev
```

项目要求 Node `>=22.12.0`，推荐使用仓库 `.nvmrc` 指定的版本。

## 检查与构建

```bash
npm run check
npm run build
```

非根路径部署可以设置：

```bash
SITE_URL=https://example.github.io
BASE_PATH=/repository-name
npm run build
```

所有站内链接和媒体地址都兼容 Astro `base`。

## 内容更新

- 博客：`src/content/logs`
- 电影：`src/content/movies`
- 图片：`src/content/photos`
- 电影海报：`public/media/movies`
- 个人图片：`public/media/photos`

完整字段、排序规则和可复制模板见 [docs/content-guide.md](docs/content-guide.md)。

## 路由

- `/`：首页
- `/logs`：博客
- `/movies`：电影
- `/photos`：图片
- `/about`：关于
- `/projects`：项目
- `/archive`：文章归档
- `/guestbook`：Giscus 留言

旧版 `/collections` 路由仍为历史文章保留。

## Giscus

文章页和留言页读取 `.env.example` 中列出的 `PUBLIC_GISCUS_*` 变量。它们属于公开构建配置，不应存放其他秘密信息。
