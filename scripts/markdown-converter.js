const fs = require('fs');
const path = require('path');
const marked = require('marked');

// 配置 marked
marked.setOptions({
    highlight: function(code, lang) {
        if (lang) {
            return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
        }
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
    },
    gfm: true,
    breaks: true
});

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 分类映射
const categoryMapping = {
    '【Go语言学习】': { key: 'golang', name: 'Go语言', icon: '🚀', color: '#00ADD8' },
    '【Go学习路线】': { key: 'golang', name: 'Go语言', icon: '🚀', color: '#00ADD8' },
    '【Gin框架学习】': { key: 'golang', name: 'Go语言', icon: '🚀', color: '#00ADD8' },
    '【Java语言学习】': { key: 'java', name: 'Java', icon: '☕', color: '#ED8B00' },
    '【Mini-Spring】': { key: 'java', name: 'Java', icon: '☕', color: '#ED8B00' },
    '【SpringBoot框架学习】': { key: 'java', name: 'Java', icon: '☕', color: '#ED8B00' },
    '【Sa-Token框架学习】': { key: 'java', name: 'Java', icon: '☕', color: '#ED8B00' },
    '【JVM学习】': { key: 'java', name: 'Java', icon: '☕', color: '#ED8B00' },
    '【Netty学习】': { key: 'java', name: 'Java', icon: '☕', color: '#ED8B00' },
    '【AI工具学习】': { key: 'ai-tools', name: 'AI工具', icon: '🤖', color: '#FF6B6B' },
    '【AgentX】': { key: 'ai-tools', name: 'AI工具', icon: '🤖', color: '#FF6B6B' },
    '【Docker学习】': { key: 'devops', name: 'DevOps', icon: '🐳', color: '#0db7ed' },
    '【MinIO】': { key: 'devops', name: 'DevOps', icon: '🐳', color: '#0db7ed' },
    '【Git学习】': { key: 'devops', name: 'DevOps', icon: '🐳', color: '#0db7ed' },
    '【Python框架学习】': { key: 'python', name: 'Python', icon: '🐍', color: '#3776ab' },
    '【MySQL学习】': { key: 'database', name: '数据库', icon: '🗄️', color: '#4479A1' },
    '【Unity学习】': { key: 'gamedev', name: '游戏开发', icon: '🎮', color: '#000000' },
    '【微信开发者工具】': { key: 'frontend', name: '前端开发', icon: '🌐', color: '#61DAFB' },
    '【Leetcode刷题】': { key: 'algorithm', name: '算法', icon: '🧮', color: '#FFA116' },
    '【数据结构与算法】': { key: 'algorithm', name: '算法', icon: '🧮', color: '#FFA116' },
    '【毕业设计】': { key: 'project', name: '项目', icon: '📋', color: '#6f42c1' },
    '【Tomcat服务器】': { key: 'server', name: '服务器', icon: '🖥️', color: '#F8981D' }
};

// 解析文件名获取分类
function getCategoryFromFileName(fileName) {
    for (const [prefix, category] of Object.entries(categoryMapping)) {
        if (fileName.startsWith(prefix)) {
            return category;
        }
    }
    
    // 默认分类
    if (fileName.includes('二分查找') || fileName.includes('动态规划')) {
        return categoryMapping['【数据结构与算法】'];
    }
    
    if (fileName.startsWith('2025.01') || fileName.includes('搭建博客')) {
        return { key: 'blog', name: '博客', icon: '📝', color: '#28a745' };
    }
    
    if (fileName.includes('VSCode') || fileName.includes('Code Runner')) {
        return { key: 'tools', name: '开发工具', icon: '🔧', color: '#007ACC' };
    }
    
    // 默认分类
    return { key: 'other', name: '其他', icon: '📄', color: '#6c757d' };
}

// 解析 frontmatter
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
        return { frontMatter: {}, content: content };
    }
    
    const frontMatterText = match[1];
    const bodyContent = match[2];
    const frontMatter = {};
    
    frontMatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
            
            if (key === 'tags' && value.startsWith('[')) {
                try {
                    frontMatter[key] = JSON.parse(value);
                } catch {
                    frontMatter[key] = [value];
                }
            } else {
                frontMatter[key] = value;
            }
        }
    });
    
    return { frontMatter, content: bodyContent };
}

// 生成HTML内容
function generateHtml(title, content, metadata) {
    const category = metadata.category || { key: 'other', name: '其他' };
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 技术博客</title>
    <meta name="description" content="${metadata.description || title}">
    <meta name="keywords" content="${metadata.tags ? metadata.tags.join(', ') : ''}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metadata.description || title}">
    <meta property="og:type" content="article">
    
    <!-- 样式文件 -->
    <link rel="stylesheet" href="../../styles/post.css">
    <link rel="stylesheet" href="../../styles/highlight.css">
    <link rel="stylesheet" href="../../styles/fonts.css">
    <link rel="stylesheet" href="../../styles/icons.css">
</head>
<body>
    <!-- 导航栏 -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="../../index.html" class="nav-brand">
                <span class="brand-icon">📚</span>
                <span class="brand-text">技术博客</span>
            </a>
            <div class="nav-links">
                <a href="../../index.html">首页</a>
                <a href="../../blog.html">博客</a>
                <a href="#contact">联系</a>
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
            <span class="category-tag">${category.name}</span>
            <span class="separator">›</span>
            <span class="current">${title}</span>
        </div>
    </div>

    <!-- 文章内容 -->
    <article class="post-container">
        <header class="post-header">
            <div class="post-meta">
                <span class="category-tag" style="background-color: ${category.color}20; color: ${category.color};">
                    <span class="category-icon">${category.icon}</span>
                    ${category.name}
                </span>
                <time class="post-date">${metadata.publishedAt || new Date().toISOString().split('T')[0]}</time>
                <span class="read-time">${metadata.readTime || '5 分钟阅读'}</span>
            </div>
            <h1 class="post-title">${title}</h1>
            ${metadata.description ? `<p class="post-description">${metadata.description}</p>` : ''}
            ${metadata.tags ? `<div class="post-tags">
                ${metadata.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>` : ''}
        </header>

        <div class="post-content">
            ${content}
        </div>

        <footer class="post-footer">
            <div class="post-actions">
                <button class="btn-secondary" onclick="history.back()">
                    <span class="icon">←</span>
                    返回
                </button>
                <button class="btn-primary" onclick="window.open('../../blog.html', '_self')">
                    <span class="icon">📝</span>
                    更多文章
                </button>
            </div>
            
            <div class="post-info">
                <p>文章分类：<span class="category-link">${category.name}</span></p>
                <p>发布时间：${metadata.publishedAt || new Date().toISOString().split('T')[0]}</p>
                ${metadata.tags ? `<p>标签：${metadata.tags.map(tag => `<span class="tag-link">#${tag}</span>`).join(' ')}</p>` : ''}
            </div>
        </footer>
    </article>

    <!-- 阅读工具栏 -->
    <div id="reading-toolbar" class="reading-toolbar collapsed">
        <div class="toolbar-toggle" onclick="toggleToolbar()">
            <span class="toggle-icon">🔧</span>
        </div>
        
        <div class="toolbar-content">
            <div class="toolbar-section">
                <label>字体大小：</label>
                <button onclick="adjustFontSize(-1)">A-</button>
                <button onclick="adjustFontSize(1)">A+</button>
            </div>
            
            <div class="toolbar-section">
                <label>主题：</label>
                <button onclick="toggleDarkMode()">🌙</button>
            </div>
            
            <div class="toolbar-section">
                <label>进度：</label>
                <div class="progress-container">
                    <div id="reading-progress" class="progress-bar"></div>
                    <span id="progress-text">0%</span>
                </div>
            </div>
            
            <div class="toolbar-section">
                <button onclick="sharePage()" class="share-btn">📤 分享</button>
                <button onclick="printPage()" class="print-btn">🖨️ 打印</button>
            </div>
        </div>
    </div>

    <!-- 分享模态框 -->
    <div id="share-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>分享文章</h3>
                <button class="modal-close" onclick="closeShareModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="share-options">
                    <button onclick="copyLink()" class="share-option">
                        <span class="icon">🔗</span>
                        复制链接
                    </button>
                    <button onclick="shareToWeibo()" class="share-option">
                        <span class="icon">🐺</span>
                        分享到微博
                    </button>
                    <button onclick="shareToQQ()" class="share-option">
                        <span class="icon">🐧</span>
                        分享到QQ
                    </button>
                </div>
                <div class="link-container">
                    <input type="text" id="page-link" readonly>
                    <button onclick="copyLink()">复制</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 提示信息 -->
    <div id="toast" class="toast"></div>

    <!-- 脚本文件 -->
    <script src="../../scripts/highlight.js"></script>
    <script src="../../scripts/reading-toolbar.js"></script>
    <script>
        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            // 代码高亮
            if (typeof hljs !== 'undefined') {
                hljs.highlightAll();
            }
            
            // 初始化阅读工具栏
            if (typeof initReadingToolbar === 'function') {
                initReadingToolbar();
            }
            
            // 更新页面链接
            document.getElementById('page-link').value = window.location.href;
        });
    </script>
</body>
</html>`;
}

// 计算阅读时间
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} 分钟阅读`;
}

// 生成文章摘要
function generateExcerpt(content, maxLength = 150) {
    const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// 主函数：转换所有markdown文件
async function convertAllMarkdownFiles() {
    const postsDir = path.join(__dirname, '../_posts');
    const outputDir = path.join(__dirname, '../posts');
    const allPosts = [];

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🚀 开始转换markdown文件...');

    try {
        const files = fs.readdirSync(postsDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));

        console.log(`📁 找到 ${markdownFiles.length} 个markdown文件`);

        for (const file of markdownFiles) {
            const filePath = path.join(postsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 解析frontmatter
            const { frontMatter, content: bodyContent } = parseFrontMatter(content);
            
            // 获取分类信息
            const category = getCategoryFromFileName(file);
            
            // 生成文章信息
            const title = frontMatter.title || file.replace(/\.md$/, '').replace(/【.*?】/, '').trim();
            const publishedAt = frontMatter.date || extractDateFromFileName(file) || new Date().toISOString().split('T')[0];
            const htmlContent = marked(bodyContent);
            const readTime = calculateReadTime(htmlContent);
            const excerpt = generateExcerpt(htmlContent);
            
            // 创建分类目录
            const categoryDir = path.join(outputDir, category.key);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }
            
            // 生成HTML文件名
            const htmlFileName = `${publishedAt}-${generateSlug(title)}.html`;
            const htmlFilePath = path.join(categoryDir, htmlFileName);
            
            // 生成HTML内容
            const metadata = {
                ...frontMatter,
                category,
                publishedAt,
                readTime,
                description: frontMatter.description || excerpt
            };
            
            const htmlOutput = generateHtml(title, htmlContent, metadata);
            
            // 写入HTML文件
            fs.writeFileSync(htmlFilePath, htmlOutput, 'utf8');
            
            // 添加到文章列表
            allPosts.push({
                id: `${publishedAt}-${generateSlug(title)}`,
                fileName: htmlFileName,
                filePath: `${category.key}/${htmlFileName}`,
                title: title,
                description: metadata.description,
                publishedAt: publishedAt,
                category: category.key,
                categoryDisplayName: category.name,
                tags: frontMatter.tags || [],
                readTime: readTime,
                views: Math.floor(Math.random() * 500) + 50, // 随机生成浏览量
                featured: Math.random() > 0.8, // 20%的文章设为精选
                excerpt: excerpt
            });
            
            console.log(`✅ 已转换: ${file} -> ${category.key}/${htmlFileName}`);
        }

        // 按发布时间排序
        allPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // 生成posts-list.json
        const postsListPath = path.join(__dirname, '../posts-list.json');
        fs.writeFileSync(postsListPath, JSON.stringify(allPosts, null, 2), 'utf8');
        
        console.log(`\n🎉 转换完成！`);
        console.log(`📊 总共转换了 ${allPosts.length} 篇文章`);
        console.log(`📂 分类统计:`);
        
        const categoryStats = allPosts.reduce((stats, post) => {
            stats[post.categoryDisplayName] = (stats[post.categoryDisplayName] || 0) + 1;
            return stats;
        }, {});
        
        Object.entries(categoryStats).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} 篇`);
        });
        
        console.log(`\n📄 生成的文件:`);
        console.log(`   - posts-list.json (${allPosts.length} 篇文章)`);
        console.log(`   - posts/ 目录下的分类HTML文件`);

    } catch (error) {
        console.error('❌ 转换过程中出现错误:', error);
        throw error;
    }
}

// 辅助函数：从文件名提取日期
function extractDateFromFileName(fileName) {
    const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        return dateMatch[1];
    }
    
    const dateMatch2 = fileName.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (dateMatch2) {
        return `${dateMatch2[1]}-${dateMatch2[2]}-${dateMatch2[3]}`;
    }
    
    return null;
}

// 辅助函数：生成URL友好的slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
        .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
        .replace(/\s+/g, '-') // 空格转连字符
        .replace(/-+/g, '-') // 多个连字符合并
        .replace(/^-|-$/g, '') // 移除首尾连字符
        .substring(0, 50) || 'post'; // 限制长度，默认值
}

// 运行转换
if (require.main === module) {
    convertAllMarkdownFiles().catch(console.error);
}

module.exports = {
    convertAllMarkdownFiles,
    getCategoryFromFileName,
    parseFrontMatter
}; 