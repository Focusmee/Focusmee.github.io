---
title: "我的第一篇博客文章"
date: "2025-01-20"
category: "other"
tags: ["入门", "博客", "Markdown"]
description: "这是我的第一篇使用Markdown格式的博客文章，介绍如何使用这个博客系统。"
---

# 我的第一篇博客文章

欢迎来到我的博客！这是我使用新的博客系统发布的第一篇文章。

## 关于这个博客系统

这个博客系统具有以下特点：

- 支持 Markdown 格式写作
- 自动生成 HTML 页面
- 支持代码高亮
- 响应式设计
- 无需外部依赖，可直接部署到 GitHub Pages

## 如何写文章

### 1. 创建 Markdown 文件

在 `_posts` 目录下创建文件，文件名格式为：`YYYY-MM-DD-title.md`

例如：`2025-01-20-my-first-post.md`

### 2. 添加 Front Matter

在文件开头添加元数据：

```yaml
---
title: "文章标题"
date: "2025-01-20"
category: "分类"
tags: ["标签1", "标签2"]
description: "文章描述"
---
```

### 3. 编写内容

使用标准的 Markdown 语法编写内容。

## 代码示例

支持语法高亮的代码块：

```javascript
function generateBlog() {
    console.log('开始生成博客...');
    // 你的代码
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

## 如何生成和部署

1. 运行生成命令：
   ```bash
   npm run generate
   ```

2. 查看结果：
   ```bash
   npm run serve
   ```

3. 部署到 GitHub：
   ```bash
   npm run deploy
   ```

就是这么简单！希望您会喜欢这个博客系统。 