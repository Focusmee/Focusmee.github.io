// 增强版博客JavaScript文件

// 全局变量
let currentView = 'grid';
let currentSort = 'newest';
let isLoading = false;

// 重写显示加载状态函数
function showLoadingState() {
    const loadingContainer = document.getElementById('loadingContainer');
    const featuredSpotlight = document.getElementById('featuredSpotlight');
    const postsCollection = document.getElementById('postsCollection');
    const contentFooter = document.getElementById('contentFooter');
    
    if (loadingContainer) loadingContainer.style.display = 'block';
    if (featuredSpotlight) featuredSpotlight.style.display = 'none';
    if (postsCollection) postsCollection.style.display = 'none';
    if (contentFooter) contentFooter.style.display = 'none';
}

// 隐藏加载状态并显示内容
function hideLoadingState() {
    const loadingContainer = document.getElementById('loadingContainer');
    const featuredSpotlight = document.getElementById('featuredSpotlight');
    const postsCollection = document.getElementById('postsCollection');
    const contentFooter = document.getElementById('contentFooter');
    
    if (loadingContainer) {
        setTimeout(() => {
            loadingContainer.style.display = 'none';
            if (featuredSpotlight) featuredSpotlight.style.display = 'block';
            if (postsCollection) postsCollection.style.display = 'block';
            if (contentFooter) contentFooter.style.display = 'block';
        }, 1000);
    }
}

// 重写文章列表生成函数
function generatePostsListEnhanced() {
    const gridContainer = document.getElementById('postsGrid');
    const listContainer = document.getElementById('postsList');
    const postsCountElement = document.getElementById('postsCount');
    const emptyState = document.getElementById('emptyState');
    
    if (!gridContainer || !listContainer) return;
    
    console.log('生成增强版文章列表，filteredPosts数量:', filteredPosts.length);
    
    // 隐藏空状态
    if (emptyState) emptyState.style.display = 'none';
    
    // 如果没有文章，显示空状态
    if (filteredPosts.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (postsCountElement) postsCountElement.textContent = '0';
        return;
    }
    
    // 排序文章
    const sortedPosts = sortPosts(filteredPosts);
    
    // 过滤掉精选文章（避免重复显示）
    const regularPosts = sortedPosts.filter(post => !post.featured);
    const postsToShow = regularPosts.length > 0 ? regularPosts : sortedPosts;
    
    // 生成网格视图HTML
    const gridHTML = postsToShow.map(post => generatePostCardHTML(post)).join('');
    
    // 生成列表视图HTML
    const listHTML = postsToShow.map(post => generatePostListItemHTML(post)).join('');
    
    // 更新容器内容
    gridContainer.innerHTML = gridHTML;
    listContainer.innerHTML = listHTML;
    
    // 更新文章数量
    if (postsCountElement) {
        postsCountElement.textContent = postsToShow.length;
    }
    
    // 更新总阅读时间
    updateTotalReadingTime(postsToShow);
    
    console.log('文章列表生成完成');
}

// 生成列表视图项目HTML
function generatePostListItemHTML(post) {
    const bookmarks = getBookmarks();
    const isBookmarked = bookmarks.includes(post.id);
    const bookmarkIcon = isBookmarked ? 'fas' : 'far';
    
    return `
        <article class="post-list-item" data-category="${post.category}">
            <div class="post-list-content">
                <div class="post-list-header">
                    <div class="post-list-meta">
                        <span class="post-category-badge ${post.category}">${post.categoryDisplayName}</span>
                        <span class="post-date">${formatDate(post.publishedAt)}</span>
                        <span class="post-read-time">${post.readTime}</span>
                    </div>
                    <button class="post-bookmark-list" title="收藏文章" data-post-id="${post.id}">
                        <i class="${bookmarkIcon} fa-bookmark"></i>
                    </button>
                </div>
                
                <div class="post-list-main">
                    <h3 class="post-list-title">
                        <a href="${getPostUrl(post)}">${post.title}</a>
                    </h3>
                    <p class="post-list-excerpt">${post.description}</p>
                    
                    <div class="post-list-tags">
                        ${post.tags.map(tag => `<span class="post-tag-small">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="post-list-footer">
                    <div class="post-list-stats">
                        <span class="post-views">
                            <i class="fas fa-eye"></i> ${formatNumber(post.views)}
                        </span>
                    </div>
                    <a href="${getPostUrl(post)}" class="post-list-link">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </article>
    `;
}

// 排序文章
function sortPosts(posts) {
    switch (currentSort) {
        case 'newest':
            return [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        case 'oldest':
            return [...posts].sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        case 'popular':
            return [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
        case 'title':
            return [...posts].sort((a, b) => a.title.localeCompare(b.title));
        default:
            return posts;
    }
}

// 更新总阅读时间
function updateTotalReadingTime(posts) {
    const totalReadingTimeElement = document.getElementById('totalReadingTime');
    if (!totalReadingTimeElement) return;
    
    const totalMinutes = posts.reduce((total, post) => {
        const minutes = parseInt(post.readTime.match(/\d+/)?.[0] || '0');
        return total + minutes;
    }, 0);
    
    const span = totalReadingTimeElement.querySelector('span');
    if (span) {
        span.textContent = totalMinutes;
    }
}

// 视图模式切换
function initViewModeToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const gridView = document.getElementById('postsGrid');
    const listView = document.getElementById('postsList');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            
            // 更新按钮状态
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 切换视图
            if (view === 'grid') {
                currentView = 'grid';
                if (gridView) gridView.style.display = 'grid';
                if (listView) listView.style.display = 'none';
            } else if (view === 'list') {
                currentView = 'list';
                if (gridView) gridView.style.display = 'none';
                if (listView) listView.style.display = 'block';
            }
            
            localStorage.setItem('blogViewMode', currentView);
        });
    });
}

// 排序功能
function initSortFunction() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            // 优先使用增强版生成函数
            if (typeof generatePostsListEnhanced === 'function') {
                generatePostsListEnhanced();
            } else if (typeof generatePostsList === 'function') {
                generatePostsList();
            }
            localStorage.setItem('blogSortMode', currentSort);
        });
    }
}

// 快速操作功能
function initQuickActions() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const randomPostBtn = document.getElementById('randomPostBtn');
    if (randomPostBtn) {
        randomPostBtn.addEventListener('click', () => {
            const allPosts = getAllPosts();
            if (allPosts.length > 0) {
                const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
                window.location.href = getPostUrl(randomPost);
            }
        });
    }
    
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    if (typeof showNotification === 'function') {
                        showNotification('链接已复制到剪贴板', 'success');
                    }
                });
            }
        });
    }
}

// 集合操作功能
function initCollectionActions() {
    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            if (isLoading) return;
            
            isLoading = true;
            refreshBtn.querySelector('i').classList.add('fa-spin');
            
            try {
                // 重新加载数据
                await initPostsData();
                await loadBlogData();
                showNotification('文章列表已刷新', 'success');
            } catch (error) {
                showNotification('刷新失败，请重试', 'error');
            } finally {
                isLoading = false;
                refreshBtn.querySelector('i').classList.remove('fa-spin');
            }
        });
    }
    
    // 全部收藏按钮
    const bookmarkAllBtn = document.getElementById('bookmarkAllBtn');
    if (bookmarkAllBtn) {
        bookmarkAllBtn.addEventListener('click', () => {
            const allPosts = getAllPosts();
            const bookmarks = getBookmarks();
            
            const newBookmarks = allPosts.map(post => post.id);
            localStorage.setItem('blogBookmarks', JSON.stringify(newBookmarks));
            
            // 更新按钮状态
            const icon = bookmarkAllBtn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
            
            showNotification(`已收藏 ${allPosts.length} 篇文章`, 'success');
            
            // 重新生成列表以更新收藏状态
            generatePostsListEnhanced();
        });
    }
}

// 更新内容页脚统计信息
function updateContentFooter() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    const totalViewsElement = document.getElementById('totalViews');
    
    if (lastUpdateElement) {
        const allPosts = getAllPosts();
        if (allPosts.length > 0) {
            const latestPost = allPosts.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            )[0];
            lastUpdateElement.textContent = formatDate(latestPost.publishedAt);
        }
    }
    
    if (totalViewsElement) {
        const stats = getPostsStats();
        totalViewsElement.textContent = stats.totalViews;
    }
}

// 重写加载博客数据函数
function loadBlogDataEnhanced() {
    try {
        // 从数据源获取文章
        currentPosts = getAllPosts();
        filteredPosts = [...currentPosts];
        
        console.log(`加载了 ${currentPosts.length} 篇文章`);
        
        // 生成页面内容
        setTimeout(() => {
            // 优先使用存在的函数
            if (typeof generateBlogStats === 'function') {
                generateBlogStats();
            }
            
            if (typeof generateFeaturedPost === 'function') {
                generateFeaturedPost();
            }
            
            generatePostsListEnhanced(); // 使用新的生成函数
            
            if (typeof generateSidebar === 'function') {
                generateSidebar();
            }
            
            updateContentFooter();
            
            // 隐藏加载状态
            hideLoadingState();
            
        }, 800); // 稍微延长显示时间让用户看到加载动画
        
    } catch (error) {
        console.error('加载博客数据失败:', error);
        showEmptyState('加载失败，请稍后再试');
    }
}

// 重写空状态显示函数
function showEmptyState(message) {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = 'block';
        const emptyText = emptyState.querySelector('.empty-text');
        if (emptyText) {
            emptyText.textContent = message;
        }
    }
    hideLoadingState();
}

// 增强版过滤文章函数
function filterPostsEnhanced(category, searchQuery = '') {
    let filtered = getAllPosts();
    
    // 按分类过滤
    if (category && category !== 'all') {
        filtered = filtered.filter(post => post.category === category);
    }
    
    // 按搜索词过滤
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    filteredPosts = filtered;
    generatePostsListEnhanced();
    
    // 更新统计信息
    updateSearchResults(filteredPosts.length, searchQuery);
}

// 重写搜索函数
function performSearchEnhanced(searchTerm) {
    const trimmedTerm = searchTerm.trim().toLowerCase();
    filterPostsEnhanced(currentCategory, trimmedTerm);
}

// 初始化增强功能
function initBlogEnhancements() {
    console.log('初始化博客增强功能...');
    
    // 添加CSS动画样式
    addCSSAnimations();
    
    initViewModeToggle();
    initSortFunction();
    initQuickActions();
    initCollectionActions();
    
    // 从本地存储恢复用户偏好
    restoreUserPreferences();
    
    console.log('博客增强功能初始化完成');
}

// 恢复用户偏好设置
function restoreUserPreferences() {
    // 恢复视图模式
    const savedViewMode = localStorage.getItem('blogViewMode');
    if (savedViewMode) {
        currentView = savedViewMode;
        const viewBtn = document.querySelector(`[data-view="${savedViewMode}"]`);
        if (viewBtn) {
            // 移除所有活动状态
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            // 设置当前按钮为活动
            viewBtn.classList.add('active');
            
            // 切换视图
            const gridView = document.getElementById('postsGrid');
            const listView = document.getElementById('postsList');
            if (savedViewMode === 'list') {
                if (gridView) gridView.style.display = 'none';
                if (listView) listView.style.display = 'block';
            } else {
                if (gridView) gridView.style.display = 'grid';
                if (listView) listView.style.display = 'none';
            }
        }
    }
    
    // 恢复排序模式
    const savedSortMode = localStorage.getItem('blogSortMode');
    if (savedSortMode) {
        currentSort = savedSortMode;
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = savedSortMode;
        }
    }
}

// 重写博客初始化内容函数
async function initBlogContentEnhanced() {
    try {
        // 显示加载状态
        showLoadingState();
        
        // 尝试加载数据
        let dataLoaded = false;
        
        // 首先尝试从JSON文件加载
        try {
            await loadPostsFromJSON();
            dataLoaded = true;
        } catch (error) {
            console.warn('从JSON加载失败，尝试其他方式');
        }
        
        // 如果JSON加载失败，尝试等待posts-data.js
        if (!dataLoaded && typeof waitForPostsData === 'function') {
            const dataReady = await waitForPostsData();
            if (dataReady) {
                dataLoaded = true;
            }
        }
        
        if (!dataLoaded) {
            console.warn('数据加载失败，使用示例数据');
        }
        
        // 加载文章数据
        loadBlogDataEnhanced();
        
        // 初始化增强功能
        initBlogEnhancements();
        
        // 监听分类过滤变化
        if (typeof updateCategoryFilters === 'function') {
            updateCategoryFilters();
        }
        
    } catch (error) {
        console.error('初始化博客内容失败:', error);
        showEmptyState('内容加载失败，请刷新重试');
    }
}

// 添加兼容性函数
function showNotification(message, type = 'info') {
    // 简单的通知实现
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 添加一些备用的辅助函数
function getAllPosts() {
    // 首先尝试使用已加载的数据
    if (typeof window.postsData !== 'undefined' && window.postsData.length > 0) {
        return window.postsData;
    }
    
    if (typeof currentPosts !== 'undefined' && currentPosts.length > 0) {
        return currentPosts;
    }
    
    // 尝试从posts-list.json异步加载数据
    if (typeof loadPostsFromJSON === 'function') {
        loadPostsFromJSON();
    }
    
    // 如果都没有，返回示例数据
    return getExamplePosts();
}

// 从posts-list.json加载数据
async function loadPostsFromJSON() {
    try {
        console.log('正在从posts-list.json加载数据...');
        const response = await fetch('./posts-list.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('原始数据:', data.length, '篇文章');
        
        // 直接使用加载的数据，不做转换
        window.postsData = data;
        currentPosts = data;
        
        console.log('✅ 成功从JSON文件加载了', window.postsData.length, '篇文章');
        
        // 打印前3篇文章的标题用于调试
        console.log('文章标题示例:', data.slice(0, 3).map(p => p.title));
        
        return window.postsData;
        
    } catch (error) {
        console.error('❌ 加载posts-list.json失败:', error);
        console.log('回退到示例数据');
        return getExamplePosts();
    }
}

function getExamplePosts() {
    return [
        {
            id: "java-learning",
            title: "Java学习之路：从入门到进阶", 
            description: "分享我的Java学习经验，从基础语法到高级特性的完整学习路线。",
            category: "java",
            categoryDisplayName: "Java",
            tags: ["Java", "学习路线", "编程"],
            publishedAt: "2025-01-21",
            readTime: "6 分钟阅读",
            views: 150,
            featured: true
        },
        {
            id: "first-post",
            title: "我的第一篇博客文章",
            description: "这是我的第一篇使用Markdown格式的博客文章，介绍如何使用这个博客系统。",
            category: "other",
            categoryDisplayName: "其他", 
            tags: ["入门", "博客", "Markdown"],
            publishedAt: "2025-01-20",
            readTime: "3 分钟阅读",
            views: 88,
            featured: false
        }
    ];
}

function getPostUrl(post) {
    // 如果传入的是post对象，直接使用
    if (typeof post === 'object' && post.filePath) {
        return `posts/${post.filePath}`;
    }
    
    // 如果传入的是postId字符串，查找对应的post
    if (typeof post === 'string') {
        const postId = post;
        const posts = getAllPosts();
        const foundPost = posts.find(p => p.id === postId || p.id.includes(postId));
        
        if (foundPost && foundPost.filePath) {
            return `posts/${foundPost.filePath}`;
        }
        
        // 回退方案
        return `posts/${postId}.html`;
    }
    
    return `posts/index.html`;
}

function getBookmarks() {
    const bookmarks = localStorage.getItem('blogBookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 生成文章卡片HTML
function generatePostCardHTML(post) {
    const bookmarks = getBookmarks();
    const isBookmarked = bookmarks.includes(post.id);
    const bookmarkIcon = isBookmarked ? 'fas' : 'far';
    
    return `
        <article class="post-card" data-category="${post.category}">
            <div class="post-meta">
                <span class="post-category">${post.categoryDisplayName}</span>
                <span class="post-date">${formatDate(post.publishedAt)}</span>
                <span class="post-read-time">${post.readTime}</span>
            </div>
            
            <h3 class="post-title">
                <a href="${getPostUrl(post)}">${post.title}</a>
            </h3>
            
            <p class="post-excerpt">${post.description}</p>
            
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="post-footer">
                <div class="post-stats">
                    <span class="post-views">
                        <i class="fas fa-eye"></i> ${formatNumber(post.views || 0)}
                    </span>
                </div>
                <div class="post-actions">
                    <button class="post-bookmark" title="收藏文章" data-post-id="${post.id}">
                        <i class="${bookmarkIcon} fa-bookmark"></i>
                    </button>
                    <a href="${getPostUrl(post)}" class="post-link">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </article>
    `;
}

// 添加CSS动画样式
function addCSSAnimations() {
    if (document.getElementById('blogEnhancedStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'blogEnhancedStyles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeInUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .post-card {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .notification {
            animation: slideIn 0.3s ease !important;
        }
    `;
    
    document.head.appendChild(style);
}

// 导出函数供其他文件使用
if (typeof window !== 'undefined') {
    window.initBlogContentEnhanced = initBlogContentEnhanced;
    window.generatePostsListEnhanced = generatePostsListEnhanced;
    window.filterPostsEnhanced = filterPostsEnhanced;
    window.performSearchEnhanced = performSearchEnhanced;
    window.initBlogEnhancements = initBlogEnhancements;
    window.showLoadingState = showLoadingState;
    window.hideLoadingState = hideLoadingState;
} 