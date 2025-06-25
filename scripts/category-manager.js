// 分类管理模块

// 分类目录管理
class CategoryManager {
    constructor() {
        this.categories = new Map();
        this.postsDir = 'posts';
    }

    // 从文件系统动态获取分类目录
    async loadCategoriesFromFileSystem() {
        try {
            // 尝试从 posts-list.json 获取分类信息
            const response = await fetch('posts-list.json');
            if (response.ok) {
                const posts = await response.json();
                return this.extractCategoriesFromPosts(posts);
            }
        } catch (error) {
            console.warn('无法从JSON文件获取分类信息:', error);
        }

        // 如果无法从JSON获取，使用默认分类
        return this.getDefaultCategories();
    }

    // 从文章数据中提取分类信息
    extractCategoriesFromPosts(posts) {
        const categoriesMap = new Map();

        posts.forEach(post => {
            const category = post.category;
            if (!categoriesMap.has(category)) {
                categoriesMap.set(category, {
                    name: category,
                    displayName: post.categoryDisplayName || this.getCategoryDisplayName(category),
                    count: 0,
                    posts: [],
                    icon: this.getCategoryIcon(category),
                    description: this.getCategoryDescription(category),
                    color: this.getCategoryColor(category)
                });
            }

            const categoryInfo = categoriesMap.get(category);
            categoryInfo.count++;
            categoryInfo.posts.push(post);
        });

        return Array.from(categoriesMap.values()).sort((a, b) => b.count - a.count);
    }

    // 获取默认分类
    getDefaultCategories() {
        return [
            {
                name: 'java',
                displayName: 'Java',
                count: 0,
                posts: [],
                icon: 'coffee',
                description: 'Java开发相关文章',
                color: '#f89820'
            },
            {
                name: 'other',
                displayName: '其他',
                count: 0,
                posts: [],
                icon: 'file-alt',
                description: '其他技术文章',
                color: '#6c757d'
            }
        ];
    }

    // 获取分类显示名称
    getCategoryDisplayName(category) {
        const displayNames = {
            'java': 'Java',
            'spring': 'Spring',
            'database': '数据库',
            'distributed': '分布式',
            'iot': '物联网',
            'frontend': '前端',
            'backend': '后端',
            'algorithm': '算法',
            'system': '系统架构',
            'other': '其他'
        };
        return displayNames[category] || category;
    }

    // 获取分类图标
    getCategoryIcon(category) {
        const icons = {
            'java': 'coffee',
            'spring': 'leaf',
            'database': 'database',
            'distributed': 'network-wired',
            'iot': 'microchip',
            'frontend': 'laptop-code',
            'backend': 'server',
            'algorithm': 'calculator',
            'system': 'sitemap',
            'other': 'file-alt'
        };
        return icons[category] || 'file-alt';
    }

    // 获取分类描述
    getCategoryDescription(category) {
        const descriptions = {
            'java': 'Java开发技术、框架和最佳实践',
            'spring': 'Spring框架生态系统相关内容',
            'database': '数据库设计、优化和管理',
            'distributed': '分布式系统架构和微服务',
            'iot': '物联网技术和应用开发',
            'frontend': '前端开发技术和用户体验',
            'backend': '后端开发和服务器端技术',
            'algorithm': '算法设计和数据结构',
            'system': '系统架构设计和性能优化',
            'other': '其他技术相关内容'
        };
        return descriptions[category] || '技术文章';
    }

    // 获取分类颜色
    getCategoryColor(category) {
        const colors = {
            'java': '#f89820',
            'spring': '#6db33f',
            'database': '#336791',
            'distributed': '#ff6b6b',
            'iot': '#4ecdc4',
            'frontend': '#61dafb',
            'backend': '#43853d',
            'algorithm': '#ffd93d',
            'system': '#a8dadc',
            'other': '#6c757d'
        };
        return colors[category] || '#6c757d';
    }

    // 获取分类目录路径
    getCategoryPath(category) {
        return `${this.postsDir}/${category}`;
    }

    // 生成分类导航HTML
    generateCategoryNavigation(categories, currentCategory = 'all') {
        let html = `
            <div class="category-navigation">
                <div class="category-nav-header">
                    <h3>文章分类</h3>
                    <span class="category-count">${categories.reduce((sum, cat) => sum + cat.count, 0)} 篇文章</span>
                </div>
                <div class="category-nav-list">
                    <a href="#" class="category-nav-item ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
                        <i class="fas fa-th-large"></i>
                        <span class="category-name">全部</span>
                        <span class="category-count">${categories.reduce((sum, cat) => sum + cat.count, 0)}</span>
                    </a>
        `;

        categories.forEach(category => {
            const isActive = currentCategory === category.name ? 'active' : '';
            html += `
                    <a href="#" class="category-nav-item ${isActive}" data-category="${category.name}">
                        <i class="fas fa-${category.icon}"></i>
                        <span class="category-name">${category.displayName}</span>
                        <span class="category-count">${category.count}</span>
                    </a>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    // 生成分类卡片HTML
    generateCategoryCards(categories) {
        let html = '<div class="categories-grid">';

        categories.forEach(category => {
            html += `
                <div class="category-card" data-category="${category.name}" style="border-left-color: ${category.color}">
                    <div class="category-card-header">
                        <div class="category-icon">
                            <i class="fas fa-${category.icon}" style="color: ${category.color}"></i>
                        </div>
                        <div class="category-info">
                            <h4 class="category-title">${category.displayName}</h4>
                            <p class="category-description">${category.description}</p>
                        </div>
                    </div>
                    <div class="category-stats">
                        <span class="posts-count">${category.count} 篇文章</span>
                        <span class="latest-post">
                            ${category.posts.length > 0 ? '最新: ' + category.posts[0].title.substring(0, 20) + '...' : '暂无文章'}
                        </span>
                    </div>
                    <div class="category-actions">
                        <button class="btn-view-category" data-category="${category.name}">
                            查看文章
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    // 生成分类统计信息
    generateCategoryStats(categories) {
        const totalPosts = categories.reduce((sum, cat) => sum + cat.count, 0);
        const mostPopularCategory = categories.reduce((prev, current) => 
            prev.count > current.count ? prev : current, categories[0]);

        return {
            totalCategories: categories.length,
            totalPosts: totalPosts,
            averagePostsPerCategory: Math.round(totalPosts / categories.length),
            mostPopularCategory: mostPopularCategory,
            categoryDistribution: categories.map(cat => ({
                name: cat.displayName,
                count: cat.count,
                percentage: Math.round((cat.count / totalPosts) * 100)
            }))
        };
    }

    // 搜索分类
    searchCategories(categories, query) {
        if (!query) return categories;

        return categories.filter(category => 
            category.name.toLowerCase().includes(query.toLowerCase()) ||
            category.displayName.toLowerCase().includes(query.toLowerCase()) ||
            category.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    // 获取分类的文章列表
    getCategoryPosts(categories, categoryName) {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.posts : [];
    }

    // 检查分类是否存在
    categoryExists(categories, categoryName) {
        return categories.some(cat => cat.name === categoryName);
    }

    // 获取推荐分类（基于文章数量和最近更新）
    getRecommendedCategories(categories, limit = 3) {
        return categories
            .filter(cat => cat.count > 0)
            .sort((a, b) => {
                // 综合考虑文章数量和最新文章日期
                const aScore = a.count + (a.posts.length > 0 ? new Date(a.posts[0].publishedAt).getTime() / 1000000000 : 0);
                const bScore = b.count + (b.posts.length > 0 ? new Date(b.posts[0].publishedAt).getTime() / 1000000000 : 0);
                return bScore - aScore;
            })
            .slice(0, limit);
    }
}

// 全局分类管理器实例
const categoryManager = new CategoryManager();

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.categoryManager = categoryManager;
}

// 模块导出（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryManager;
} 