const fs = require('fs');
const path = require('path');

// 分类映射
const categoryMapping = {
    '【Go语言学习】': { key: 'golang', name: 'Go语言', icon: '🚀' },
    '【Go学习路线】': { key: 'golang', name: 'Go语言', icon: '🚀' },
    '【Gin框架学习】': { key: 'golang', name: 'Go语言', icon: '🚀' },
    '【Java语言学习】': { key: 'java', name: 'Java', icon: '☕' },
    '【Mini-Spring】': { key: 'java', name: 'Java', icon: '☕' },
    '【SpringBoot框架学习】': { key: 'java', name: 'Java', icon: '☕' },
    '【Sa-Token框架学习】': { key: 'java', name: 'Java', icon: '☕' },
    '【JVM学习】': { key: 'java', name: 'Java', icon: '☕' },
    '【Netty学习】': { key: 'java', name: 'Java', icon: '☕' },
    '【AI工具学习】': { key: 'ai-tools', name: 'AI工具', icon: '🤖' },
    '【AgentX】': { key: 'ai-tools', name: 'AI工具', icon: '🤖' },
    '【Docker学习】': { key: 'devops', name: 'DevOps', icon: '🐳' },
    '【MinIO】': { key: 'devops', name: 'DevOps', icon: '🐳' },
    '【Git学习】': { key: 'devops', name: 'DevOps', icon: '🐳' },
    '【Python框架学习】': { key: 'python', name: 'Python', icon: '🐍' },
    '【MySQL学习】': { key: 'database', name: '数据库', icon: '🗄️' },
    '【Unity学习】': { key: 'gamedev', name: '游戏开发', icon: '🎮' },
    '【微信开发者工具】': { key: 'frontend', name: '前端开发', icon: '🌐' },
    '【Leetcode刷题】': { key: 'algorithm', name: '算法', icon: '🧮' },
    '【数据结构与算法】': { key: 'algorithm', name: '算法', icon: '🧮' },
    '【毕业设计】': { key: 'project', name: '项目', icon: '📋' },
    '【Tomcat服务器】': { key: 'server', name: '服务器', icon: '🖥️' }
};

// 获取分类
function getCategoryFromFileName(fileName) {
    for (const [prefix, category] of Object.entries(categoryMapping)) {
        if (fileName.startsWith(prefix)) {
            return category;
        }
    }
    
    if (fileName.includes('二分查找') || fileName.includes('动态规划')) {
        return { key: 'algorithm', name: '算法', icon: '🧮' };
    }
    
    if (fileName.startsWith('2025.01') || fileName.includes('搭建博客')) {
        return { key: 'blog', name: '博客', icon: '📝' };
    }
    
    if (fileName.includes('VSCode')) {
        return { key: 'tools', name: '开发工具', icon: '🔧' };
    }
    
    return { key: 'other', name: '其他', icon: '📄' };
}

// 提取日期
function extractDateFromFileName(fileName) {
    const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) return dateMatch[1];
    
    const dateMatch2 = fileName.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (dateMatch2) return `${dateMatch2[1]}-${dateMatch2[2]}-${dateMatch2[3]}`;
    
    return new Date().toISOString().split('T')[0];
}

// 生成slug
function generateSlug(text) {
    return text
        .replace(/【.*?】/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .substring(0, 30)
        .replace(/\s+/g, '-')
        .toLowerCase() || 'post';
}

// 解析markdown内容
function parseMarkdown(content) {
    // 简单的markdown转html
    let html = content
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
        .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br />');
    
    return `<p>${html}</p>`;
}

// 生成HTML模板
function generateHtml(title, content, metadata) {
    const { category, publishedAt, readTime } = metadata;
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 技术博客</title>
    <meta name="description" content="${title} - ${category.name}相关技术文章">
    <meta name="keywords" content="${category.name}, 技术博客, 编程, 开发">
    
    <!-- CSS样式文件 -->
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/post.css">
    <link rel="stylesheet" href="../../styles/highlight.css">
</head>
<body>
    <!-- 顶部导航栏 -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="../../index.html" class="nav-brand">📚 技术博客</a>
            <div class="nav-links">
                <a href="../../index.html" class="nav-link">首页</a>
                <a href="../../blog.html" class="nav-link">博客</a>
            </div>
        </div>
    </nav>

    <!-- 面包屑导航 -->
    <div class="breadcrumb">
        <div class="container">
            <a href="../../index.html">首页</a>
            <span class="separator">›</span>
            <a href="../../blog.html">博客</a>
            <span class="separator">›</span>
            <span class="category-breadcrumb">${category.name}</span>
            <span class="separator">›</span>
            <span class="current-page">${title}</span>
        </div>
    </div>

    <!-- 文章容器 - 目录功能会在这里动态插入 -->
    <div class="container">
        <article class="post-container">
            <!-- 文章头部 -->
            <header class="post-header">
                <div class="post-meta">
                    <span class="category-tag ${category.key}">${category.icon} ${category.name}</span>
                    <time class="publish-date" datetime="${publishedAt}">${publishedAt}</time>
                    <span class="read-time">📖 ${readTime}</span>
                </div>
                <h1 class="post-title">${title}</h1>
            </header>
            
            <!-- 文章内容 -->
            <main class="post-content">
                ${content}
            </main>
            
            <!-- 文章底部 -->
            <footer class="post-footer">
                <div class="post-actions">
                    <button class="back-button" onclick="history.back()">← 返回上页</button>
                    <a href="../../blog.html" class="more-posts-link">查看更多文章 →</a>
                </div>
                
                <!-- 文章标签 -->
                <div class="post-tags">
                    <span class="tag-label">标签：</span>
                    <span class="tag">${category.name}</span>
                </div>
                
                <!-- 版权信息 -->
                <div class="post-copyright">
                    <p>本文由技术博客原创，转载请注明出处。欢迎分享与交流！</p>
                </div>
            </footer>
        </article>
    </div>

    <!-- JavaScript文件 -->
    <script src="../../scripts/highlight.js"></script>
    <script src="../../scripts/reading-toolbar.js"></script>
    <script src="../../scripts/table-of-contents.js"></script>
    
    <!-- 页面性能监控 -->
    <script>
        // 简单的页面加载性能监控
        window.addEventListener('load', function() {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log('页面加载时间:', loadTime + 'ms');
        });
    </script>
</body>
</html>`;
}

// 主函数
async function convertAllPosts() {
    const postsDir = path.join(__dirname, '../_posts');
    const outputDir = path.join(__dirname, '../posts');
    const allPosts = [];

    console.log('🚀 开始转换markdown文件...');

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    console.log(`📁 找到 ${markdownFiles.length} 个文件`);

    for (const file of markdownFiles) {
        try {
            const filePath = path.join(postsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const category = getCategoryFromFileName(file);
            const title = file.replace(/\.md$/, '').replace(/【.*?】/, '').trim();
            const publishedAt = extractDateFromFileName(file);
            const htmlContent = parseMarkdown(content);
            const readTime = `${Math.ceil(content.length / 1000)} 分钟阅读`;
            
            // 创建分类目录
            const categoryDir = path.join(outputDir, category.key);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }
            
            // 生成HTML文件
            const slug = generateSlug(title);
            const htmlFileName = `${publishedAt}-${slug}.html`;
            const htmlFilePath = path.join(categoryDir, htmlFileName);
            
            const metadata = { category, publishedAt, readTime };
            const htmlOutput = generateHtml(title, htmlContent, metadata);
            
            fs.writeFileSync(htmlFilePath, htmlOutput, 'utf8');
            
            // 添加到文章列表
            allPosts.push({
                id: `${publishedAt}-${slug}`,
                fileName: htmlFileName,
                filePath: `${category.key}/${htmlFileName}`,
                title: title,
                description: content.substring(0, 150).replace(/[#*]/g, '').trim() + '...',
                publishedAt: publishedAt,
                category: category.key,
                categoryDisplayName: category.name,
                tags: [],
                readTime: readTime,
                views: Math.floor(Math.random() * 500) + 50,
                featured: Math.random() > 0.8,
                excerpt: content.substring(0, 200).replace(/[#*]/g, '').trim() + '...'
            });
            
            console.log(`✅ ${file} -> ${category.key}/${htmlFileName}`);
            
        } catch (error) {
            console.error(`❌ 转换失败: ${file}`, error.message);
        }
    }

    // 按发布时间排序
    allPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // 生成posts-list.json
    const postsListPath = path.join(__dirname, '../posts-list.json');
    fs.writeFileSync(postsListPath, JSON.stringify(allPosts, null, 2), 'utf8');
    
    console.log(`\n🎉 转换完成！共 ${allPosts.length} 篇文章`);
    
    // 统计分类
    const categoryStats = {};
    allPosts.forEach(post => {
        categoryStats[post.categoryDisplayName] = (categoryStats[post.categoryDisplayName] || 0) + 1;
    });
    
    console.log('\n📊 分类统计:');
    Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} 篇`);
    });
}

// 运行
if (require.main === module) {
    convertAllPosts().catch(console.error);
}

module.exports = { convertAllPosts }; 