// 博客文章数据管理

// 文章数据存储
let postsData = [];

// 获取所有文章数据
function getAllPosts() {
    return postsData;
}

// 获取精选文章
function getFeaturedPosts() {
    return postsData.filter(post => post.featured);
}

// 获取文章统计信息
function getPostsStats() {
    const categoriesMap = {};
    postsData.forEach(post => {
        if (!categoriesMap[post.category]) {
            categoriesMap[post.category] = 0;
        }
        categoriesMap[post.category]++;
    });
    
    const categories = Object.keys(categoriesMap).map(category => ({
        name: category,
        displayName: getCategoryDisplayName(category),
        count: categoriesMap[category]
    }));
    
    const totalViews = postsData.reduce((sum, post) => sum + (post.views || 150), 0);
    
    return {
        totalPosts: postsData.length,
        totalViews: formatNumber(totalViews),
        totalCategories: categories.length,
        categories: categories
    };
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
}

// 获取文章URL - 支持分类目录结构
function getPostUrl(postId) {
    const post = postsData.find(p => p.id === postId);
    if (!post) return '#';
    
    // 使用新的分类目录路径
    if (post.filePath) {
        return `posts/${post.filePath}`;
    }
    
    // 兼容旧格式
    return `posts/${post.category}/${post.fileName}`;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// 获取分类图标
function getCategoryIcon(category) {
    const icons = {
        'java': 'coffee',
        'spring': 'leaf',
        'database': 'database',
        'distributed': 'network-wired',
        'iot': 'microchip',
        'other': 'file-alt'
    };
    return icons[category] || 'file-alt';
}

// 获取分类显示名称
function getCategoryDisplayName(category) {
    const names = {
        'java': 'Java',
        'spring': 'Spring',
        'database': '数据库',
        'distributed': '分布式',
        'iot': '物联网',
        'other': '其他'
    };
    return names[category] || '其他';
}

// 获取分类目录列表
async function getCategoryDirectories() {
    const categories = [];
    
    // 从已加载的文章数据中获取分类
    if (postsData.length > 0) {
        const categorySet = new Set(postsData.map(post => post.category));
        return Array.from(categorySet);
    }
    
    // 如果没有数据，尝试从JSON文件获取
    try {
        const response = await fetch('posts-list.json');
        if (response.ok) {
            const posts = await response.json();
            const categorySet = new Set(posts.map(post => post.category));
            return Array.from(categorySet);
        }
    } catch (error) {
        console.warn('无法获取分类目录:', error);
    }
    
    // 返回默认分类
    return ['java', 'other'];
}

// 从HTML文件中提取文章元数据
async function extractPostMetadata(htmlContent, fileName, category) {
    // 创建一个临时的DOM解析器
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // 提取标题
    const titleElement = doc.querySelector('.post-title');
    const title = titleElement ? titleElement.textContent.trim() : fileName.replace('.html', '');
    
    // 提取描述
    const descElement = doc.querySelector('meta[name="description"]');
    const description = descElement ? descElement.getAttribute('content') : '';
    
    // 提取日期
    const dateElement = doc.querySelector('.post-date');
    const dateText = dateElement ? dateElement.textContent.trim() : '';
    
    // 提取分类
    const categoryElement = doc.querySelector('.post-category');
    const extractedCategory = categoryElement ? categoryElement.textContent.trim() : category || 'other';
    
    // 提取阅读时间
    const readTimeElement = doc.querySelector('.post-read-time');
    const readTime = readTimeElement ? readTimeElement.textContent.trim() : '3 分钟阅读';
    
    // 提取标签
    const tagElements = doc.querySelectorAll('.post-tag');
    const tags = Array.from(tagElements).map(tag => tag.textContent.trim());
    
    // 提取内容摘要
    const contentElement = doc.querySelector('.post-content');
    let excerpt = '';
    if (contentElement) {
        const firstParagraph = contentElement.querySelector('p');
        if (firstParagraph) {
            excerpt = firstParagraph.textContent.trim().substring(0, 120) + '...';
        }
    }
    
    return {
        id: fileName.replace('.html', ''),
        fileName: fileName,
        filePath: `${category}/${fileName}`,
        title: title,
        description: description || excerpt,
        publishedAt: parseDateFromText(dateText) || extractDateFromFileName(fileName),
        category: extractedCategory,
        categoryDisplayName: getCategoryDisplayName(extractedCategory),
        tags: tags.length > 0 ? tags : ['技术'],
        readTime: readTime,
        views: Math.floor(Math.random() * 300) + 50, // 模拟阅读量
        featured: Math.random() > 0.7, // 随机设置精选文章
        excerpt: excerpt || description || '点击阅读全文...'
    };
}

// 从文本中解析日期
function parseDateFromText(dateText) {
    if (!dateText) return null;
    
    // 匹配格式如 "2025/1/20 08:00:00"
    const match = dateText.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    if (match) {
        return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
    }
    
    return null;
}

// 从文件名中提取日期
function extractDateFromFileName(fileName) {
    const match = fileName.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : new Date().toISOString().split('T')[0];
}

// 动态加载posts目录下的所有HTML文件（支持分类目录）
async function loadPostsFromDirectory() {
    try {
        // 优先尝试从JSON文件加载
        try {
            const response = await fetch('posts-list.json');
            if (response.ok) {
                const posts = await response.json();
                if (posts && posts.length > 0) {
                    postsData = posts;
                    console.log(`从JSON文件成功加载 ${postsData.length} 篇文章`);
                    return postsData;
                }
            }
        } catch (jsonError) {
            console.warn('无法从JSON文件加载，尝试直接扫描HTML文件');
        }
        
        // 如果JSON文件不存在，扫描分类目录下的HTML文件
        const categories = await getCategoryDirectories();
        
        postsData = [];
        
        for (const category of categories) {
            const postFiles = await getPostFilesInCategory(category);
            
            for (const fileName of postFiles) {
                try {
                    // 获取文件内容
                    const response = await fetch(`posts/${category}/${fileName}`);
                    if (response.ok) {
                        const htmlContent = await response.text();
                        const metadata = await extractPostMetadata(htmlContent, fileName, category);
                        postsData.push(metadata);
                    }
                } catch (error) {
                    console.warn(`无法加载文章: ${category}/${fileName}`, error);
                }
            }
        }
        
        // 如果没有加载到任何文章，使用示例数据
        if (postsData.length === 0) {
            console.log('没有找到实际文章文件，使用示例数据');
            postsData = getExamplePosts();
        } else {
            // 按日期排序
            postsData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        }
        
        console.log(`总共加载 ${postsData.length} 篇文章`);
        return postsData;
        
    } catch (error) {
        console.error('加载文章失败:', error);
        // 如果加载失败，返回示例数据
        console.log('使用示例数据作为备选');
        return getExamplePosts();
    }
}

// 获取指定分类目录下的HTML文件列表
async function getPostFilesInCategory(category) {
    // 由于浏览器安全限制，我们使用已知的文件列表
    // 在实际应用中，可以通过服务器API获取
    const knownFilesByCategory = {
        'java': [
            '2025-01-21-java-learning.html'
        ],
        'other': [
            '2025-01-20-my-first-post.html'
        ]
    };
    
    const knownFiles = knownFilesByCategory[category] || [];
    
    // 检查文件是否存在
    const existingFiles = [];
    for (const fileName of knownFiles) {
        try {
            const response = await fetch(`posts/${category}/${fileName}`, { method: 'HEAD' });
            if (response.ok) {
                existingFiles.push(fileName);
            }
        } catch (error) {
            console.warn(`文件不存在: ${category}/${fileName}`);
        }
    }
    
    return existingFiles;
}

// 获取posts目录下的HTML文件列表（兼容旧版本）
async function getPostFiles() {
    const categories = await getCategoryDirectories();
    const allFiles = [];
    
    for (const category of categories) {
        const categoryFiles = await getPostFilesInCategory(category);
        allFiles.push(...categoryFiles);
    }
    
    return allFiles;
}

// 示例文章数据（作为备用）- 更新为分类目录结构
function getExamplePosts() {
    return [
        {
            id: '2025-01-21-java-learning',
            fileName: '2025-01-21-java-learning.html',
            filePath: 'java/2025-01-21-java-learning.html',
            title: 'Java学习之路：从入门到进阶',
            description: '分享我的Java学习经验，从基础语法到高级特性的完整学习路线。',
            publishedAt: '2025-01-21',
            category: 'java',
            categoryDisplayName: 'Java',
            tags: ['Java', '学习路线', '编程'],
            readTime: '6 分钟阅读',
            views: 245,
            featured: true,
            excerpt: 'Java作为一门经典的编程语言，在企业开发中占据重要地位。本文分享我的Java学习历程和一些实用的学习建议...'
        },
        {
            id: '2025-01-20-my-first-post',
            fileName: '2025-01-20-my-first-post.html',
            filePath: 'other/2025-01-20-my-first-post.html',
            title: '我的第一篇博客文章',
            description: '这是我的第一篇使用Markdown格式的博客文章，介绍如何使用这个博客系统。',
            publishedAt: '2025-01-20',
            category: 'other',
            categoryDisplayName: '其他',
            tags: ['入门', '博客', 'Markdown'],
            readTime: '3 分钟阅读',
            views: 128,
            featured: false,
            excerpt: '欢迎来到我的博客！这是我使用新的博客系统发布的第一篇文章...'
        }
    ];
}

// 初始化文章数据
async function initPostsData() {
    console.log('正在加载文章数据...');
    
    // 如果数据已经存在，直接返回
    if (postsData.length > 0) {
        console.log('文章数据已存在，无需重新加载');
        return postsData;
    }
    
    try {
        postsData = await loadPostsFromDirectory();
        console.log(`文章数据加载完成，共 ${postsData.length} 篇文章`);
    } catch (error) {
        console.error('文章数据加载失败，使用默认数据:', error);
        postsData = getExamplePosts();
    }
    
    // 确保数据不为空
    if (postsData.length === 0) {
        console.log('强制使用示例数据');
        postsData = getExamplePosts();
    }
    
    return postsData;
}

// 获取所有标签
function getAllTags() {
    const tagsMap = {};
    postsData.forEach(post => {
        post.tags.forEach(tag => {
            if (!tagsMap[tag]) {
                tagsMap[tag] = 0;
            }
            tagsMap[tag]++;
        });
    });
    
    return Object.keys(tagsMap).map(tag => ({
        name: tag,
        count: tagsMap[tag]
    })).sort((a, b) => b.count - a.count);
}

// 根据分类获取文章
function getPostsByCategory(category) {
    if (category === 'all') {
        return [...postsData];
    }
    return postsData.filter(post => post.category === category);
}

// 搜索文章
function searchPosts(searchTerm) {
    return postsData.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
}

// 获取热门文章
function getPopularPosts() {
    return [...postsData]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);
}

// 获取分类统计信息
function getCategoriesStats() {
    const stats = {};
    postsData.forEach(post => {
        if (!stats[post.category]) {
            stats[post.category] = {
                name: post.category,
                displayName: post.categoryDisplayName,
                count: 0,
                posts: []
            };
        }
        stats[post.category].count++;
        stats[post.category].posts.push(post);
    });
    
    return Object.values(stats).sort((a, b) => b.count - a.count);
}

// 页面加载时初始化数据（由blog.js统一调用）
// 移除独立的事件监听器，避免与blog.js冲突 