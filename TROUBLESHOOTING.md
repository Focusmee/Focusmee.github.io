# 故障排除指南

## 🐛 常见问题及解决方案

### 1. JavaScript 错误：Cannot read properties of undefined (reading 'map')

**问题描述：**
```
TypeError: Cannot read properties of undefined (reading 'map')
    at generateCategoriesList (blog.js:297:45)
    at generateSidebar (blog.js:264:5)
```

**原因分析：**
- `getPostsStats()` 函数没有返回 `categories` 属性
- 侧边栏生成函数在文章数据还未准备好时就被调用
- 缺少必要的辅助函数如 `getAllTags()`, `getPopularPosts()` 等

**解决方案：**
1. 更新 `getPostsStats()` 函数，确保返回 `categories` 数组
2. 添加缺失的辅助函数：
   - `getAllTags()` - 获取所有标签
   - `getPostsByCategory()` - 根据分类获取文章
   - `searchPosts()` - 搜索文章
   - `getPopularPosts()` - 获取热门文章
3. 为生成函数添加安全检查和错误处理

**修复代码示例：**
```javascript
// 获取文章统计信息
function getPostsStats() {
    // ... 其他代码
    const categories = Object.keys(categoriesMap).map(category => ({
        name: category,
        displayName: getCategoryDisplayName(category),
        count: categoriesMap[category]
    }));
    
    return {
        totalPosts: postsData.length,
        totalViews: formatNumber(totalViews),
        totalCategories: categories.length,
        categories: categories  // 确保返回categories数组
    };
}

// 生成分类列表（带安全检查）
function generateCategoriesList() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    
    try {
        const stats = getPostsStats();
        if (!stats || !stats.categories) {
            console.warn('分类数据未准备好');
            return;
        }
        // ... 其他代码
    } catch (error) {
        console.error('生成分类列表失败:', error);
    }
}
```

### 2. 文章数据加载失败

**问题描述：**
- 页面显示"正在加载文章..."但一直不显示内容
- 控制台显示网络错误或文件找不到

**原因分析：**
- `posts-list.json` 文件不存在或格式错误
- posts目录下的HTML文件路径不正确
- 网络请求被阻止（CORS 问题）

**解决方案：**
1. 确保 `posts-list.json` 文件存在：
   ```bash
   npm run update-posts
   ```

2. 检查文件路径和权限

3. 使用本地服务器（解决CORS问题）：
   ```bash
   npm run serve
   ```

### 3. 样式显示异常

**问题描述：**
- 页面布局混乱
- 字体或图标不显示
- 响应式效果不正常

**原因分析：**
- CSS文件路径错误
- 字体文件或图标库加载失败
- CSS文件被缓存

**解决方案：**
1. 检查CSS文件引用路径
2. 清除浏览器缓存
3. 确保字体和图标库正常加载

### 4. 文章链接无法点击

**问题描述：**
- 点击文章标题或"阅读全文"无反应
- 链接指向错误的路径

**原因分析：**
- `getPostUrl()` 函数返回错误的路径
- 文章HTML文件不存在

**解决方案：**
1. 检查 `getPostUrl()` 函数实现
2. 确保posts目录下有对应的HTML文件
3. 验证文件名格式正确

## 🔧 调试技巧

### 1. 使用浏览器开发者工具
- 按 F12 打开开发者工具
- 查看 Console 标签页的错误信息
- 检查 Network 标签页的网络请求

### 2. 查看详细日志
```javascript
// 在console中执行以下命令查看数据
console.log('当前文章数据:', postsData);
console.log('文章统计:', getPostsStats());
console.log('所有标签:', getAllTags());
```

### 3. 检查文件结构
```bash
# 确认文件结构正确
ls -la posts/
ls -la scripts/
ls -la styles/
```

## 📋 预防措施

### 1. 定期更新文章列表
```bash
# 添加新文章后运行
npm run update-posts
```

### 2. 代码质量检查
- 确保所有函数都有错误处理
- 添加适当的日志输出
- 使用TypeScript或JSDoc添加类型注释

### 3. 测试覆盖
- 测试各种场景（空数据、网络错误等）
- 测试不同浏览器的兼容性
- 测试移动设备的响应式效果

## 🆘 获取帮助

如果以上解决方案都无法解决您的问题，请：

1. **检查控制台错误信息**：提供完整的错误堆栈
2. **描述复现步骤**：详细说明如何触发问题
3. **环境信息**：浏览器版本、操作系统等
4. **文件结构**：确认相关文件是否存在

---

*最后更新：2025年1月* 