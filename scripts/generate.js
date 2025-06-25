const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const fm = require('front-matter');
const hljs = require('highlight.js');

// 配置
const config = {
    sourceDir: '_posts',
    outputDir: 'posts',
    blogListFile: 'blog.html',
    templateDir: 'templates'
};

// 配置marked
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
});

// 主函数
async function generateBlog() {
    console.log('🚀 开始生成博客...');
    
    try {
        // 1. 确保输出目录存在
        await fs.ensureDir(config.outputDir);
        
        // 2. 读取所有Markdown文件
        const posts = await readMarkdownFiles();
        
        // 3. 创建分类目录结构
        await createCategoryDirectories(posts);
        
        // 4. 生成HTML文件到对应分类目录
        await generateHtmlFiles(posts);
        
        // 5. 更新博客列表页面
        await updateBlogList(posts);
        
        // 6. 生成posts-list.json文件
        await generatePostsList(posts);
        
        console.log(`✅ 博客生成完成！共生成 ${posts.length} 篇文章`);
        console.log('📁 按分类目录结构存储完成');
        
        // 显示目录结构
        await displayDirectoryStructure();
        
    } catch (error) {
        console.error('❌ 生成失败:', error);
        process.exit(1);
    }
}

// 创建分类目录结构
async function createCategoryDirectories(posts) {
    console.log('📁 创建分类目录结构...');
    
    const categories = [...new Set(posts.map(post => post.category))];
    
    for (const category of categories) {
        const categoryDir = path.join(config.outputDir, category);
        await fs.ensureDir(categoryDir);
        console.log(`  ✓ 创建目录: posts/${category}/`);
    }
}

// 显示目录结构
async function displayDirectoryStructure() {
    console.log('\n📂 生成的目录结构:');
    console.log('posts/');
    
    const dirs = await fs.readdir(config.outputDir);
    const categoryDirs = [];
    
    for (const dir of dirs) {
        const dirPath = path.join(config.outputDir, dir);
        const stat = await fs.stat(dirPath);
        
        if (stat.isDirectory()) {
            categoryDirs.push(dir);
            const files = await fs.readdir(dirPath);
            const htmlFiles = files.filter(file => file.endsWith('.html'));
            
            console.log(`├── ${dir}/`);
            htmlFiles.forEach((file, index) => {
                const isLast = index === htmlFiles.length - 1;
                console.log(`│   ${isLast ? '└──' : '├──'} ${file}`);
            });
        }
    }
    
    if (categoryDirs.length === 0) {
        console.log('└── (空目录)');
    }
}

// 读取Markdown文件
async function readMarkdownFiles() {
    const postsDir = config.sourceDir;
    
    if (!await fs.pathExists(postsDir)) {
        console.log(`📁 创建 ${postsDir} 目录...`);
        await fs.ensureDir(postsDir);
        return [];
    }
    
    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const posts = [];
    
    for (const file of markdownFiles) {
        const filePath = path.join(postsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 解析front matter
        const { attributes, body } = fm(content);
        
        // 从文件名提取日期和slug
        const { date, slug } = parseFileName(file);
        
        const post = {
            ...attributes,
            content: body,
            slug: slug,
            fileName: file,
            date: attributes.date || date,
            title: attributes.title || slug.replace(/-/g, ' '),
            category: attributes.category || 'other',
            tags: attributes.tags || [],
            readTime: calculateReadTime(body)
        };
        
        posts.push(post);
    }
    
    // 按日期排序
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return posts;
}

// 解析文件名
function parseFileName(fileName) {
    const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    if (match) {
        return {
            date: match[1],
            slug: match[2]
        };
    }
    
    return {
        date: new Date().toISOString().split('T')[0],
        slug: fileName.replace('.md', '')
    };
}

// 计算阅读时间
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.length / 2; // 中文字符估算
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} 分钟阅读`;
}

// 生成HTML文件到分类目录
async function generateHtmlFiles(posts) {
    const template = await getPostTemplate();
    
    for (const post of posts) {
        console.log(`📝 生成文章: ${post.title} -> ${post.category}/`);
        
        // 转换Markdown为HTML
        const contentHtml = marked(post.content);
        
        // 计算相对路径深度（分类目录需要两层 ../../）
        const relativePath = '../../';
        
        // 生成完整的HTML，调整资源路径
        const html = template
            .replace(/{{title}}/g, post.title)
            .replace(/{{content}}/g, contentHtml)
            .replace(/{{date}}/g, new Date(post.date).toLocaleString('zh-CN'))
            .replace(/{{category}}/g, post.category)
            .replace(/{{categoryDisplayName}}/g, getCategoryName(post.category))
            .replace(/{{readTime}}/g, post.readTime)
            .replace(/{{tags}}/g, (post.tags || []).map(tag => `<span class="post-tag">${tag}</span>`).join(''))
            .replace(/{{description}}/g, post.description || post.title)
            .replace(/href="\.\.\/styles\//g, `href="${relativePath}styles/`)
            .replace(/href="\.\.\/index\.html"/g, `href="${relativePath}index.html"`)
            .replace(/href="\.\.\/blog\.html"/g, `href="${relativePath}blog.html"`)
            .replace(/src="\.\.\/scripts\//g, `src="${relativePath}scripts/`);
        
        // 输出到分类目录
        const categoryOutputDir = path.join(config.outputDir, post.category);
        const outputPath = path.join(categoryOutputDir, `${post.date}-${post.slug}.html`);
        await fs.writeFile(outputPath, html);
        
        // 更新文章的文件路径信息
        post.filePath = `${post.category}/${post.date}-${post.slug}.html`;
    }
}

// 生成posts-list.json文件
async function generatePostsList(posts) {
    console.log('📋 生成posts-list.json...');
    
    const postsList = posts.map(post => ({
        id: `${post.date}-${post.slug}`,
        fileName: `${post.date}-${post.slug}.html`,
        filePath: post.filePath,
        title: post.title,
        description: post.description,
        publishedAt: post.date,
        category: post.category,
        categoryDisplayName: getCategoryName(post.category),
        tags: post.tags || [],
        readTime: post.readTime,
        views: Math.floor(Math.random() * 500) + 50, // 模拟浏览量
        featured: post.featured || false,
        excerpt: post.description || post.title + '...'
    }));
    
    // 按日期倒序排列
    postsList.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    // 设置第一篇为精选文章
    if (postsList.length > 0) {
        postsList[0].featured = true;
    }
    
    await fs.writeFile('posts-list.json', JSON.stringify(postsList, null, 2));
}

// 获取文章模板 - 更新模板以适应分类目录结构
async function getPostTemplate() {
    const templatePath = path.join(config.templateDir, 'post.html');
    
    if (await fs.pathExists(templatePath)) {
        return await fs.readFile(templatePath, 'utf-8');
    }
    
    // 默认模板 - 调整资源路径为两级目录
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} | Focusmee</title>
    <meta name="description" content="{{description}}">
    <meta property="og:title" content="{{title}}">
    <meta property="og:description" content="{{description}}">
    <meta property="og:type" content="article">
    <link rel="stylesheet" href="../../styles/fonts.css">
    <link rel="stylesheet" href="../../styles/icons.css">
    <link rel="stylesheet" href="../../styles/highlight.css">
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/post.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="nav">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../../index.html" class="logo-link">
                    <span class="logo-text">Focusmee</span>
                    <div class="logo-subtitle">全栈开发工程师</div>
                </a>
            </div>
            <div class="nav-menu">
                <a href="../../index.html#about" class="nav-link">关于</a>
                <a href="../../index.html#work" class="nav-link">项目</a>
                <a href="../../blog.html" class="nav-link">博客</a>
                <a href="../../index.html#contact" class="nav-link">联系</a>
                <div class="nav-social">
                    <a href="https://github.com/Focusmee" target="_blank" class="social-link">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="mailto:2105735259@qq.com" class="social-link">
                        <i class="fas fa-envelope"></i>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Reading Toolbar -->
    <div id="readingToolbar" class="reading-toolbar">
        <div class="toolbar-handle">
            <i class="fas fa-bars"></i>
        </div>
        <div class="toolbar-content">
            <div class="toolbar-header">
                <h4>阅读工具</h4>
                <button class="toolbar-toggle" title="展开/收起">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
            <div class="toolbar-controls">
                <div class="control-group">
                    <label>字体大小</label>
                    <div class="font-size-controls">
                        <button class="font-btn" data-action="decrease">A-</button>
                        <span class="font-size-display">16px</span>
                        <button class="font-btn" data-action="increase">A+</button>
                    </div>
                </div>
                <div class="control-group">
                    <label>主题模式</label>
                    <button class="theme-toggle" id="themeToggle">
                        <i class="fas fa-moon"></i>
                        <span>深色模式</span>
                    </button>
                </div>
                <div class="control-group">
                    <label>阅读进度</label>
                    <div class="reading-progress-info">
                        <span id="readingPercentage">0%</span>
                        <div class="progress-bar-mini">
                            <div class="progress-fill-mini"></div>
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <button class="tool-btn" id="shareBtn">
                        <i class="fas fa-share-alt"></i>
                        <span>分享文章</span>
                    </button>
                </div>
                <div class="control-group">
                    <button class="tool-btn" id="printBtn">
                        <i class="fas fa-print"></i>
                        <span>打印文章</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Post Content -->
    <article class="post">
        <div class="container">
            <header class="post-header">
                <nav class="breadcrumb">
                    <a href="../../blog.html">博客</a>
                    <span class="separator">/</span>
                    <span class="category-breadcrumb">{{categoryDisplayName}}</span>
                    <span class="separator">/</span>
                    <span class="current">{{title}}</span>
                </nav>
                
                <div class="post-meta">
                    <time class="post-date">{{date}}</time>
                    <span class="post-category">{{categoryDisplayName}}</span>
                    <span class="post-read-time">{{readTime}}</span>
                </div>
                
                <h1 class="post-title">{{title}}</h1>
                
                <div class="post-tags">
                    {{tags}}
                </div>
            </header>
            
            <div class="post-content">
                {{content}}
            </div>
        </div>
    </article>

    <script src="../../scripts/highlight.js"></script>
    <script src="../../scripts/post-enhance.js"></script>
    <script src="../../scripts/reading-toolbar.js"></script>
</body>
</html>`;
}

// 更新博客列表页面 - 适应新的分类目录结构
async function updateBlogList(posts) {
    console.log('📋 更新博客列表页面...');
    
    // 读取现有的blog.html
    const blogHtmlPath = config.blogListFile;
    let blogHtml = await fs.readFile(blogHtmlPath, 'utf-8');
    
    // 生成文章卡片HTML
    const postsHtml = generatePostCards(posts);
    
    // 替换整个博客内容区域
    const startMarker = '<!-- Blog Content -->';
    const endMarker = '<!-- Newsletter Section -->';
    
    const startIndex = blogHtml.indexOf(startMarker);
    const endIndex = blogHtml.indexOf(endMarker);
    
    if (startIndex !== -1 && endIndex !== -1) {
        const beforePosts = blogHtml.substring(0, startIndex + startMarker.length);
        const afterPosts = blogHtml.substring(endIndex);
        
        const blogContentSection = `
    <section class="blog-content">
        <div class="container">
            <div class="blog-layout">
${postsHtml}
            </div>
        </div>
    </section>

    `;
        
        blogHtml = beforePosts + blogContentSection + afterPosts;
        
        await fs.writeFile(blogHtmlPath, blogHtml);
    }
    
    // 更新统计信息
    await updateBlogStats(posts, blogHtml);
}

// 生成文章卡片 - 更新链接路径
function generatePostCards(posts) {
    if (posts.length === 0) {
        return `                <!-- Featured Post -->
                <div class="featured-post">
                    <div class="empty-state">
                        <h3>暂无文章</h3>
                        <p>请在 _posts 目录下添加 Markdown 文件</p>
                    </div>
                </div>
                
                <!-- Blog Posts Grid -->
                <div class="blog-posts">
                </div>`;
    }
    
    const featuredPost = posts[0]; // 最新文章作为精选
    const otherPosts = posts.slice(1);
    
    let html = `                <!-- Featured Post -->
                <div class="featured-post">
                    <article class="post-card featured" data-category="${featuredPost.category}">
                        <div class="post-image">
                            <div class="post-image-placeholder">
                                <i class="fas fa-code"></i>
                            </div>
                        </div>
                        <div class="post-content">
                            <div class="post-meta">
                                <span class="post-category">${getCategoryName(featuredPost.category)}</span>
                                <span class="post-date">${featuredPost.date}</span>
                                <span class="post-read-time">${featuredPost.readTime}</span>
                            </div>
                            <h2 class="post-title">${featuredPost.title}</h2>
                            <p class="post-excerpt">
                                ${featuredPost.description || featuredPost.title}
                            </p>
                            <div class="post-tags">
                                ${(featuredPost.tags || []).map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                            </div>
                            <a href="posts/${featuredPost.category}/${featuredPost.date}-${featuredPost.slug}.html" class="post-link">阅读全文</a>
                        </div>
                    </article>
                </div>

                <!-- Blog Posts Grid -->
                <div class="blog-posts">`;
    
    for (const post of otherPosts) {
        html += `
                    <article class="post-card" data-category="${post.category}">
                        <div class="post-content">
                            <div class="post-meta">
                                <span class="post-category">${getCategoryName(post.category)}</span>
                                <span class="post-date">${post.date}</span>
                                <span class="post-read-time">${post.readTime}</span>
                            </div>
                            <h3 class="post-title">${post.title}</h3>
                            <p class="post-excerpt">
                                ${post.description || post.title}
                            </p>
                            <div class="post-tags">
                                ${(post.tags || []).map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                            </div>
                            <a href="posts/${post.category}/${post.date}-${post.slug}.html" class="post-link">阅读全文</a>
                        </div>
                    </article>`;
    }
    
    html += '\n                </div>';
    
    return html;
}

// 获取分类中文名
function getCategoryName(category) {
    const categoryMap = {
        'java': 'Java',
        'distributed': '分布式',
        'iot': '物联网',
        'spring': 'Spring',
        'database': '数据库',
        'other': '其他'
    };
    
    return categoryMap[category] || category;
}

// 更新博客统计
async function updateBlogStats(posts, blogHtml) {
    const totalPosts = posts.length;
    const categories = [...new Set(posts.map(post => post.category))];
    
    // 更新统计数字
    let updatedHtml = blogHtml
        .replace(/(<span class="stat-number" id="totalPosts">)\d+(<\/span>)/g, `$1${totalPosts}$2`)
        .replace(/(<span class="stat-number" id="totalCategories">)\d+(<\/span>)/g, `$1${categories.length}$2`);
    
    await fs.writeFile(config.blogListFile, updatedHtml);
}

// 运行生成器
if (require.main === module) {
    generateBlog();
}

module.exports = { generateBlog }; 