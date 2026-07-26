# Focusmee 内容维护指南

站点的三类内容都使用 Astro Content Collections。添加内容时复制下面的模板，不需要修改页面组件。

## 发布博客

在 `src/content/logs` 新建 `.md` 或 `.mdx` 文件：

```md
---
title: "文章标题"
description: "用于列表和搜索摘要的一句话说明。"
pubDate: 2026-07-26
tags: ["Agent", "Workflow"]
draft: false
---

从这里开始写正文。
```

可选字段：

```yaml
updatedDate: 2026-07-27
cover: "/media/photos/article-cover.jpg"
coverAlt: "准确描述封面内容"
coverShape: "landscape" # landscape | portrait | square
```

新文章不需要填写 `category`、`mood`、`season` 或 `featured`。历史文章中的 `category` 仅用于兼容旧栏目页面。

## 添加电影

先把海报放到 `public/media/movies`，再在 `src/content/movies` 新建 `.md` 文件：

```md
---
title: "电影中文名"
originalTitle: "Original Title"
year: 2024
director: "导演姓名"
poster: "/media/movies/movie-slug.jpg"
note: "一两句喜欢它的原因。"
externalUrl: "https://example.com/optional-link"
order: 10
draft: false
---
```

`originalTitle`、`externalUrl` 和 `order` 可以省略。首页按 `order` 从小到大选取前 4 部电影；相同顺序按片名稳定排列。

## 添加图片

先把原图放到 `public/media/photos`，再在 `src/content/photos` 新建 `.md` 文件：

```md
---
image: "/media/photos/photo-slug.jpg"
alt: "准确描述图片内容，供屏幕阅读器使用"
shape: "landscape"
caption: "可选的图片说明"
date: 2026-07-26
location: "可选地点"
order: 10
draft: false
---
```

`shape` 必须是以下之一：

- `landscape`：横图，3:2
- `portrait`：竖图，4:5
- `square`：方图，1:1

图片列表使用 CSS 统一裁切；点击展示图会打开本地原图。首页按 `order` 选取前 6 张。

## 草稿和空集合

- `draft: true` 的条目不会生成到公开页面。
- 没有公开电影或图片时，首页不会渲染对应区块。
- `/movies` 和 `/photos` 会显示简洁空状态，直到加入真实内容。
- 不要为了测试提交虚构的喜好、外部热链或未经确认的个人图片。

## 发布前检查

```bash
npm run check
npm run build
```

内容字段、媒体目录或日期格式错误会在检查或构建阶段直接报告。
