const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 配置
const config = {
    postsDir: 'posts',
    outputFile: 'posts-list.json'
};

// 主函数
async function updatePostsList() {
    console.log('🔄 正在更新文章列表...');
    
    try {
        const posts = await scanPostsDirectory();
        const outputPath = path.join(__dirname, '..', config.outputFile);
        
        // 写入JSON文件
        fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8');
        
        console.log(`✅ 成功更新文章列表！共 ${posts.length} 篇文章`);
        console.log(`📄 文件保存至: ${outputPath}`);
        
    } catch (error) {
        console.error('❌ 更新失败:', error);
        process.exit(1);
    }
}

// 扫描posts目录
async function scanPostsDirectory() {
    const postsDir = path.join(__dirname, '..', config.postsDir);
    
    if (!fs.existsSync(postsDir)) {
        console.warn(`⚠️  posts目录不存在: ${postsDir}`);
        return [];
    }
    
    const files = fs.readdirSync(postsDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    const posts = [];
    
    for (const fileName of htmlFiles) {
        try {
            const filePath = path.join(postsDir, fileName);
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const postData = extractPostMetadata(htmlContent, fileName);
            posts.push(postData);
            console.log(`📝 处理文章: ${postData.title}`);
        } catch (error) {
            console.warn(`⚠️  无法处理文件 ${fileName}:`, error.message);
        }
    }
    
    // 按日期排序
    posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    return posts;
}

// 从HTML文件中提取文章元数据
function extractPostMetadata(htmlContent, fileName) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    // 提取标题
    const titleElement = document.querySelector('.post-title');
    const title = titleElement ? titleElement.textContent.trim() : fileName.replace('.html', '');
    
    // 提取描述
    const descElement = document.querySelector('meta[name="description"]');
    const description = descElement ? descElement.getAttribute('content') : '';
    
    // 提取日期
    const dateElement = document.querySelector('.post-date');
    const dateText = dateElement ? dateElement.textContent.trim() : '';
    
    // 提取分类
    const categoryElement = document.querySelector('.post-category');
    const category = categoryElement ? categoryElement.textContent.trim() : 'other';
    
    // 提取阅读时间
    const readTimeElement = document.querySelector('.post-read-time');
    const readTime = readTimeElement ? readTimeElement.textContent.trim() : '3 分钟阅读';
    
    // 提取标签
    const tagElements = document.querySelectorAll('.post-tag');
    const tags = Array.from(tagElements).map(tag => tag.textContent.trim()).filter(tag => tag);
    
    // 提取内容摘要
    const contentElement = document.querySelector('.post-content');
    let excerpt = '';
    if (contentElement) {
        const firstParagraph = contentElement.querySelector('p');
        if (firstParagraph) {
            excerpt = firstParagraph.textContent.trim().substring(0, 120) + '...';
        }
    }
    
    // 解析日期
    const publishedAt = parseDateFromText(dateText) || extractDateFromFileName(fileName);
    
    return {
        id: fileName.replace('.html', ''),
        fileName: fileName,
        title: title,
        description: description || excerpt,
        publishedAt: publishedAt,
        category: category,
        categoryDisplayName: getCategoryDisplayName(category),
        tags: tags.length > 0 ? tags : ['技术'],
        readTime: readTime,
        views: Math.floor(Math.random() * 300) + 50, // 模拟阅读量
        featured: Math.random() > 0.6, // 随机设置精选文章
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

// 如果直接运行此脚本
if (require.main === module) {
    updatePostsList();
}

module.exports = { updatePostsList }; 