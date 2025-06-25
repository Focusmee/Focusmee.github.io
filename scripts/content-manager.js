// 内容管理系统 - 动态加载博客文章
class ContentManager {
    constructor() {
        this.posts = [];
        this.init();
    }

    async init() {
        console.log('🚀 ContentManager 初始化中...');
        await this.loadPosts();
        console.log('📝 文章数据:', this.posts);
        this.updateBlogSection();
        this.updateNavigation();
        console.log('✅ ContentManager 初始化完成');
    }

    // 加载文章数据
    async loadPosts() {
        // 首先使用默认数据确保有内容显示
        this.loadDefaultPosts();
        console.log('🔄 使用默认文章数据，共', this.posts.length, '篇');
        
        try {
            // 尝试从blog.html加载更多数据
            const response = await fetch('blog.html');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            let loadedFromBlog = [];
            
            // 解析精选文章
            const featuredPost = doc.querySelector('.post-card.featured');
            if (featuredPost) {
                const post = this.parsePostCard(featuredPost);
                if (post) loadedFromBlog.push(post);
            }
            
            // 解析其他文章
            const otherPosts = doc.querySelectorAll('.blog-posts .post-card');
            otherPosts.forEach(postCard => {
                const post = this.parsePostCard(postCard);
                if (post) loadedFromBlog.push(post);
            });
            
            if (loadedFromBlog.length > 0) {
                this.posts = loadedFromBlog;
                console.log('✅ 从blog.html加载了', this.posts.length, '篇文章');
            }
        } catch (error) {
            console.warn('⚠️ 从blog.html加载文章失败，使用默认数据:', error.message);
        }
    }

    // 解析文章卡片
    parsePostCard(postCard) {
        try {
            const title = postCard.querySelector('.post-title')?.textContent?.trim();
            const excerpt = postCard.querySelector('.post-excerpt')?.textContent?.trim();
            const category = postCard.querySelector('.post-category')?.textContent?.trim();
            const date = postCard.querySelector('.post-date')?.textContent?.trim();
            const readTime = postCard.querySelector('.post-read-time')?.textContent?.trim();
            const link = postCard.querySelector('.post-link')?.getAttribute('href');
            const tags = Array.from(postCard.querySelectorAll('.post-tag')).map(tag => tag.textContent.trim());

            if (!title || !link) return null;

            return {
                title,
                excerpt,
                category,
                date,
                readTime,
                link,
                tags
            };
        } catch (error) {
            console.error('解析文章卡片失败:', error);
            return null;
        }
    }

    // 默认文章数据（备用）
    loadDefaultPosts() {
        this.posts = [
            {
                title: "Java学习之路：从入门到进阶",
                excerpt: "分享我的Java学习经验，从基础语法到高级特性的完整学习路线。",
                category: "Java",
                date: "2025-01-21",
                readTime: "6 分钟阅读",
                link: "posts/2025-01-21-java-learning.html",
                tags: ["Java", "学习路线", "编程"]
            },
            {
                title: "我的第一篇博客文章",
                excerpt: "这是我的第一篇使用Markdown格式的博客文章，介绍如何使用这个博客系统。",
                category: "其他",
                date: "2025-01-20",
                readTime: "3 分钟阅读",
                link: "posts/2025-01-20-my-first-post.html",
                tags: ["入门", "博客", "Markdown"]
            }
        ];
    }

    // 更新博客区域
    updateBlogSection() {
        console.log('📝 开始更新博客区域...');
        const blogGrid = document.querySelector('#latestBlogPosts');
        if (!blogGrid) {
            console.error('❌ 找不到博客容器元素 #latestBlogPosts');
            return;
        }

        console.log('✅ 找到博客容器，当前文章数量:', this.posts.length);

        // 清空现有内容
        blogGrid.innerHTML = '';

        // 按日期排序文章（最新的在前）
        const sortedPosts = this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 显示最新的3篇文章
        const latestPosts = sortedPosts.slice(0, 3);
        
        console.log('📊 准备显示的文章:', latestPosts);
        
        if (latestPosts.length === 0) {
            // 如果没有文章，显示占位内容
            console.log('⚠️ 没有文章数据，显示占位内容');
            blogGrid.innerHTML = `
                <div class="no-posts">
                    <p>暂无文章，敬请期待...</p>
                </div>
            `;
            return;
        }

        latestPosts.forEach((post, index) => {
            console.log(`📄 创建第${index + 1}篇文章卡片:`, post.title);
            const blogCard = this.createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
        
        console.log('✅ 博客区域更新完成');
    }

    // 创建博客卡片
    createBlogCard(post) {
        const article = document.createElement('article');
        article.className = 'blog-card';
        
        // 添加阅读进度估算
        const readingTime = this.calculateReadingTime(post.excerpt || '');
        
        article.innerHTML = `
            <div class="blog-meta">
                <span class="blog-category">${post.category || '未分类'}</span>
                <span class="blog-date">${post.date || '未知日期'}</span>
                <span class="blog-read-time">${post.readTime || readingTime}</span>
            </div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt || '暂无摘要'}</p>
            ${post.tags && post.tags.length > 0 ? `
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <a href="${post.link}" class="blog-link">阅读全文</a>
        `;

        // 添加悬浮效果
        article.addEventListener('mouseenter', () => {
            article.style.transform = 'translateY(-5px)';
        });
        
        article.addEventListener('mouseleave', () => {
            article.style.transform = 'translateY(0)';
        });

        return article;
    }

    // 创建"查看更多"按钮
    createMoreButton() {
        const moreCard = document.createElement('div');
        moreCard.className = 'blog-card more-card';
        
        moreCard.innerHTML = `
            <div class="more-content">
                <h3>查看更多文章</h3>
                <p>探索更多技术内容和学习心得</p>
                <a href="blog.html" class="blog-link">进入博客</a>
            </div>
        `;

        return moreCard;
    }

    // 计算阅读时间
    calculateReadingTime(text) {
        const wordsPerMinute = 200; // 中文阅读速度
        const words = text.length / 2; // 中文字符估算
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} 分钟阅读`;
    }

    // 更新导航
    updateNavigation() {
        // 修复博客导航链接
        const blogNavLink = document.querySelector('a[href="#blog"]');
        if (blogNavLink) {
            blogNavLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('blog').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }

        // 添加"技术博客"按钮点击事件
        const blogButton = document.querySelector('.btn-secondary');
        if (blogButton && blogButton.textContent.includes('技术博客')) {
            blogButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'blog.html';
            });
        }
    }

    // 添加文章目录功能
    generateTableOfContents(content) {
        const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>文章目录</h3>';
        
        const tocList = document.createElement('ul');
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            const id = `heading-${index}`;
            heading.id = id;
            
            const listItem = document.createElement('li');
            listItem.className = `toc-level-${level}`;
            listItem.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
            tocList.appendChild(listItem);
        });
        
        toc.appendChild(tocList);
        return toc;
    }

    // 添加阅读进度条
    addReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = scrolled + '%';
            }
        });
    }

    // 相关文章推荐
    getRelatedPosts(currentPost, count = 3) {
        if (!currentPost || !currentPost.tags) return [];
        
        const related = this.posts
            .filter(post => post.link !== currentPost.link)
            .map(post => {
                const commonTags = post.tags ? 
                    post.tags.filter(tag => currentPost.tags.includes(tag)).length : 0;
                const sameCategory = post.category === currentPost.category ? 1 : 0;
                
                return {
                    ...post,
                    relevanceScore: commonTags * 2 + sameCategory
                };
            })
            .filter(post => post.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, count);
            
        return related;
    }

    // 搜索功能
    searchPosts(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return this.posts;
        
        return this.posts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(searchTerm);
            const categoryMatch = post.category && post.category.toLowerCase().includes(searchTerm);
            const tagsMatch = post.tags && post.tags.some(tag => 
                tag.toLowerCase().includes(searchTerm)
            );
            
            return titleMatch || excerptMatch || categoryMatch || tagsMatch;
        });
    }

    // 按分类筛选
    filterByCategory(category) {
        if (!category || category === 'all') return this.posts;
        return this.posts.filter(post => post.category === category);
    }

    // 获取所有分类
    getCategories() {
        const categories = [...new Set(this.posts.map(post => post.category))];
        return categories.filter(cat => cat && cat.trim());
    }

    // 获取文章统计
    getStats() {
        return {
            totalPosts: this.posts.length,
            categories: this.getCategories().length,
            totalTags: [...new Set(this.posts.flatMap(post => post.tags || []))].length
        };
    }
}

// 简化版本：直接在首页显示文章
function initHomeBlog() {
    const blogGrid = document.querySelector('#latestBlogPosts');
    if (!blogGrid) {
        console.error('❌ 找不到博客容器');
        return;
    }

    console.log('✅ 找到博客容器，开始显示文章');

    // 直接创建文章卡片HTML
    const articlesHTML = `
        <article class="blog-card">
            <div class="blog-meta">
                <span class="blog-category">Java</span>
                <span class="blog-date">2025-01-21</span>
                <span class="blog-read-time">6 分钟阅读</span>
            </div>
            <h3 class="blog-title">Java学习之路：从入门到进阶</h3>
            <p class="blog-excerpt">分享我的Java学习经验，从基础语法到高级特性的完整学习路线。</p>
            <div class="blog-tags">
                <span class="blog-tag">Java</span>
                <span class="blog-tag">学习路线</span>
                <span class="blog-tag">编程</span>
            </div>
            <a href="posts/2025-01-21-java-learning.html" class="blog-link">阅读全文</a>
        </article>

        <article class="blog-card">
            <div class="blog-meta">
                <span class="blog-category">其他</span>
                <span class="blog-date">2025-01-20</span>
                <span class="blog-read-time">3 分钟阅读</span>
            </div>
            <h3 class="blog-title">我的第一篇博客文章</h3>
            <p class="blog-excerpt">这是我的第一篇使用Markdown格式的博客文章，介绍如何使用这个博客系统。</p>
            <div class="blog-tags">
                <span class="blog-tag">入门</span>
                <span class="blog-tag">博客</span>
                <span class="blog-tag">Markdown</span>
            </div>
            <a href="posts/2025-01-20-my-first-post.html" class="blog-link">阅读全文</a>
        </article>

        <article class="blog-card">
            <div class="blog-meta">
                <span class="blog-category">分布式</span>
                <span class="blog-date">2025-01-15</span>
                <span class="blog-read-time">8 分钟阅读</span>
            </div>
            <h3 class="blog-title">深入理解分布式系统</h3>
            <p class="blog-excerpt">探讨分布式系统的核心概念，包括一致性、可用性和分区容错性的权衡。</p>
            <div class="blog-tags">
                <span class="blog-tag">分布式</span>
                <span class="blog-tag">系统设计</span>
                <span class="blog-tag">架构</span>
            </div>
            <a href="#" class="blog-link">阅读全文</a>
        </article>
    `;

    blogGrid.innerHTML = articlesHTML;
    console.log('✅ 文章显示完成');

    // 添加悬浮效果
    const blogCards = blogGrid.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 页面加载完成，初始化博客');
    initHomeBlog();
    window.contentManager = new ContentManager();
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentManager;
} 