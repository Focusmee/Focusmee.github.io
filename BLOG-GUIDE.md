# 博客系统使用指南

这是一个类似 Hexo 的静态博客生成器，可以将 Markdown 文件转换为 HTML 并部署到 GitHub Pages。

## 📁 目录结构

```
简历/
├── _posts/                  # Markdown 文章源文件
│   └── 2025-01-20-title.md # 文章格式：YYYY-MM-DD-title.md
├── posts/                   # 生成的 HTML 文章
├── scripts/                 # 构建脚本
│   ├── generate.js         # 主生成脚本
│   └── clean.js           # 清理脚本
├── styles/                 # 样式文件
├── package.json           # 项目配置
├── blog.html             # 博客列表页
└── index.html            # 主页
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 写一篇文章

在 `_posts` 目录下创建 Markdown 文件，格式为 `YYYY-MM-DD-title.md`：

```markdown
---
title: "文章标题"
date: "2025-01-20"
category: "java"           # java, distributed, iot, spring, database, other
tags: ["标签1", "标签2"]
description: "文章摘要描述"
---

# 文章内容

这里是你的文章内容...
```

### 3. 生成博客

```bash
npm run generate
```

### 4. 预览博客

```bash
npm run serve
```

### 5. 部署到 GitHub

```bash
npm run deploy
```

## 📝 写作指南

### Front Matter 字段说明

- `title`: 文章标题（必填）
- `date`: 发布日期，格式 YYYY-MM-DD（可选，默认从文件名提取）
- `category`: 文章分类（可选，默认 "other"）
  - `java`: Java 相关
  - `distributed`: 分布式系统
  - `iot`: 物联网
  - `spring`: Spring 框架
  - `database`: 数据库
  - `other`: 其他
- `tags`: 标签数组（可选）
- `description`: 文章描述，用于摘要显示（可选）

### 文件命名规则

文件名格式：`YYYY-MM-DD-slug.md`

- `YYYY-MM-DD`: 发布日期
- `slug`: 文章标识符，只能包含字母、数字、连字符

例如：
- `2025-01-20-java-classloader.md`
- `2025-01-15-spring-boot-tutorial.md`

### Markdown 语法支持

支持标准 Markdown 语法，包括：

- 标题：`# ## ###`
- 列表：`- * +`
- 链接：`[文本](链接)`
- 图片：`![alt](src)`
- 代码块：` ```语言 `
- 表格、引用等

#### 代码高亮

支持多种编程语言的语法高亮：

```javascript
function hello() {
    console.log('Hello World!');
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

## 🛠️ 可用命令

| 命令 | 说明 |
|-----|-----|
| `npm run generate` | 生成博客文件 |
| `npm run serve` | 启动本地服务器预览 |
| `npm run clean` | 清理生成的文件 |
| `npm run build` | 清理 + 生成 |
| `npm run deploy` | 构建并部署到 GitHub |

## 📤 部署流程

### 自动部署

使用 `npm run deploy` 命令会自动：

1. 清理旧文件
2. 生成新的 HTML 文件
3. 提交到 Git
4. 推送到 GitHub

### 手动部署

1. 生成文件：`npm run generate`
2. 提交更改：`git add . && git commit -m "更新博客"`
3. 推送：`git push`

## 🎨 自定义

### 修改样式

编辑 `styles/` 目录下的 CSS 文件：
- `main.css`: 主要样式
- `blog.css`: 博客页面样式

### 自定义模板

可以在 `templates/post.html` 创建自定义文章模板。

### 修改配置

编辑 `scripts/generate.js` 中的 `config` 对象：

```javascript
const config = {
    sourceDir: '_posts',        // Markdown 文件目录
    outputDir: 'posts',         # HTML 输出目录
    blogListFile: 'blog.html',  # 博客列表页面
    templateDir: 'templates'    # 模板目录
};
```

## 🔧 故障排除

### 常见问题

1. **生成失败**
   - 检查 Markdown 文件的 Front Matter 格式
   - 确保文件名符合规范

2. **样式显示异常**
   - 检查 CSS 文件路径
   - 清理浏览器缓存

3. **代码高亮不生效**
   - 确保代码块指定了正确的语言

### 调试

查看详细错误信息：

```bash
node scripts/generate.js
```

## 📚 扩展功能

你可以根据需要扩展以下功能：

- 评论系统（如 Gitalk）
- 搜索功能
- RSS 订阅
- 文章归档
- 分页功能

---

🎉 **现在开始写作吧！** 创建你的第一篇 Markdown 文章，体验便捷的博客发布流程。 