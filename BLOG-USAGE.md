# 博客系统使用说明

## 🎯 概述

这个博客系统现在能够自动识别并显示`posts`目录下的所有HTML文章。不再需要手动维护文章列表！

## 🚀 快速开始

### 1. 启动本地开发服务器
```bash
npm run serve
```

### 2. 访问博客页面
打开浏览器访问: `http://localhost:8080/blog.html`

## 📝 添加新文章

### 方法一：使用Markdown（推荐）
1. 在`_posts`目录下创建Markdown文件，格式：`YYYY-MM-DD-title.md`
2. 添加Front Matter元数据：
   ```yaml
   ---
   title: "文章标题"
   date: "2025-01-20"
   category: "java"
   tags: ["Java", "学习"]
   description: "文章描述"
   ---
   ```
3. 编写Markdown内容
4. 运行生成命令：
   ```bash
   npm run generate
   ```
5. 更新文章列表：
   ```bash
   npm run update-posts
   ```

### 方法二：直接添加HTML文件
1. 在`posts`目录下创建HTML文件
2. 确保包含必要的元数据标签：
   - `.post-title` - 文章标题
   - `.post-date` - 发布日期
   - `.post-category` - 文章分类
   - `.post-tag` - 文章标签
   - `meta[name="description"]` - 文章描述
3. 更新文章列表：
   ```bash
   npm run update-posts
   ```

## 🔧 系统工作原理

### 文章数据加载
博客系统使用以下方式加载文章数据：

1. **优先从JSON文件加载**：系统首先尝试从`posts-list.json`文件加载文章列表
2. **动态HTML扫描**：如果JSON文件不存在，系统会直接扫描`posts`目录下的HTML文件
3. **备用数据**：如果以上方法都失败，使用内置的示例数据

### 文章元数据提取
系统从HTML文件中自动提取以下信息：
- 标题（`.post-title`）
- 描述（`meta[name="description"]`）
- 发布日期（`.post-date`）
- 分类（`.post-category`）
- 标签（`.post-tag`）
- 阅读时间（`.post-read-time`）
- 内容摘要（第一个段落）

## 📋 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run serve` | 启动本地开发服务器 |
| `npm run generate` | 从Markdown生成HTML文章 |
| `npm run update-posts` | 更新文章列表数据 |
| `npm run clean` | 清理生成的文件 |
| `npm run build` | 完整构建（清理+生成） |
| `npm run deploy` | 构建并部署到Git |

## 🎨 功能特性

### 自动识别文章
- ✅ 自动扫描`posts`目录
- ✅ 提取文章元数据
- ✅ 按日期排序
- ✅ 分类和标签管理

### 响应式设计
- ✅ 支持移动设备
- ✅ 优雅的卡片布局
- ✅ 平滑动画效果

### 搜索和过滤
- ✅ 实时搜索功能
- ✅ 按分类过滤
- ✅ 标签过滤

### 用户交互
- ✅ 文章收藏功能
- ✅ 键盘导航支持
- ✅ 邮件订阅功能

## 🛠️ 自定义配置

### 修改分类
在`scripts/posts-data.js`中的`getCategoryDisplayName`函数中添加新分类：

```javascript
function getCategoryDisplayName(category) {
    const names = {
        'java': 'Java',
        'python': 'Python', // 添加新分类
        // ... 其他分类
    };
    return names[category] || '其他';
}
```

### 修改文章布局
编辑`styles/blog.css`和`styles/post.css`文件来自定义样式。

## 🔍 调试

### 查看控制台日志
打开浏览器开发者工具，查看控制台输出：
- 文章加载状态
- 错误信息
- 性能信息

### 常见问题
1. **文章不显示**：检查HTML文件中是否包含必要的CSS类
2. **数据加载失败**：检查`posts-list.json`文件是否存在且格式正确
3. **样式异常**：检查CSS文件是否正确引用

## 🎉 最佳实践

1. **定期更新文章列表**：添加新文章后运行`npm run update-posts`
2. **使用语义化标签**：确保HTML结构清晰
3. **优化图片**：使用适当大小的图片
4. **SEO友好**：填写完整的meta信息

## 📞 支持

如果遇到问题，请检查：
1. 控制台错误信息
2. 文件路径是否正确
3. 必要的依赖是否安装

---

*更新时间：2025年1月* 