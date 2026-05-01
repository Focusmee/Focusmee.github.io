# Blooming Logs

Blooming Logs 是一个基于 Astro 的个人博客骨架，主题设定为“海边白色唱片屋”。

## 当前技术栈

- Astro 6
- MDX
- React
- RSS
- Sitemap
- GitHub Pages 友好静态输出
- Node 24 LTS 本地开发

## 本地启动

```bash
npm install
npm run dev
```

## 构建与检查

```bash
npm run build
npm run check
```

## Node 版本

项目已经升级到当前 Astro 6 维护线，运行时要求至少为 `Node 22.12.0`。

仓库内提供了 `.nvmrc`，当前建议本地使用：

```bash
24.15.0
```

## 部署变量

这个骨架支持通过环境变量兼容两种 GitHub Pages 场景：

- `SITE_URL`: 你的站点域名，例如 `https://yourname.github.io`
- `BASE_PATH`: 你的子路径，例如 `/blooming-logs`

如果你用的是用户主页仓库 `username.github.io`，通常保持 `BASE_PATH=/` 即可。

## Giscus 评论与留言

项目已经内置了 Giscus 组件，接在：

- `/guestbook`
- 每篇文章页底部

启用方式：

1. 在 GitHub 仓库里开启 Discussions
2. 去 `giscus.app` 生成仓库配置
3. 把这些公开变量填进环境中：

```bash
PUBLIC_GISCUS_REPO=yourname/your-repo
PUBLIC_GISCUS_REPO_ID=...
PUBLIC_GISCUS_CATEGORY=General
PUBLIC_GISCUS_CATEGORY_ID=...
PUBLIC_GISCUS_THEME=preferred_color_scheme
PUBLIC_GISCUS_LANG=zh-CN
```

仓库里已经提供了 `.env.example` 作为模板。

## 目录说明

- `src/pages`: 页面路由
- `src/content`: 博客文章内容
- `src/components`: 布局、UI、首页模块
- `src/data`: 站点和栏目元数据
- `src/utils`: 内容查询、格式化、链接工具
- `public`: 静态资源

## 下一步建议

1. 修改 `src/data/site.ts` 里的作者、邮箱和社交链接
2. 替换示例文章为你自己的第一批内容
3. 决定 GitHub Pages 是根域名部署还是项目子路径部署
4. 在仓库变量里填入 `SITE_URL` 和 `BASE_PATH`
5. 后续再接 `Giscus`、`Pagefind` 和更完整的首页交互
