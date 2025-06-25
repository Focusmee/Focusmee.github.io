// 博客页面JavaScript

let currentPosts = [];
let filteredPosts = [];
let currentCategory = 'all';
let currentSearchQuery = '';

// 初始化博客内容
async function initBlogContent() {
    try {
        // 显示加载状态
        showLoadingState();
        
        // 确保数据已加载
        const dataReady = await waitForPostsData();
        if (!dataReady) {
            console.warn('数据未就绪，使用备用方案');
        }
        
        // 加载文章数据
        loadBlogData();
        
        // 监听分类过滤变化
        updateCategoryFilters();
        
    } catch (error) {
        console.error('初始化博客内容失败:', error);
        showEmptyState('内容加载失败，请刷新重试');
    }
}

// 等待文章数据加载完成
async function waitForPostsData() {
    let attempts = 0;
    const maxAttempts = 50; // 最多等待5秒
    
    while (attempts < maxAttempts) {
        if (typeof getAllPosts === 'function') {
            const posts = getAllPosts();
            if (posts && posts.length > 0) {
                console.log('文章数据已就绪，共', posts.length, '篇文章');
                return true;
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    console.warn('等待文章数据超时，使用备用数据');
    return false;
}

// 显示加载状态
function showLoadingState() {
    // 新版加载状态
    const loadingContainer = document.getElementById('loadingContainer');
    const featuredSpotlight = document.getElementById('featuredSpotlight');
    const postsCollection = document.getElementById('postsCollection');
    const contentFooter = document.getElementById('contentFooter');
    
    if (loadingContainer) {
        loadingContainer.style.display = 'block';
        if (featuredSpotlight) featuredSpotlight.style.display = 'none';
        if (postsCollection) postsCollection.style.display = 'none';
        if (contentFooter) contentFooter.style.display = 'none';
        return;
    }
    
    // 兼容旧版加载状态
    const loadingElement = document.querySelector('.loading-posts');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
}

// 加载博客数据
function loadBlogData() {
    try {
        // 从数据源获取文章
        currentPosts = getAllPosts();
        filteredPosts = [...currentPosts];
        
        console.log(`加载了 ${currentPosts.length} 篇文章`);
        
        // 立即生成页面内容
        generateBlogStats();
        generateFeaturedPost();
        generatePostsList();
        generateSidebar();
        generateCategoryFilterTabs();
        
        // 短暂延迟后显示内容，保证渲染完成
        setTimeout(() => {
            // 隐藏加载状态并显示内容
            const loadingContainer = document.getElementById('loadingContainer');
            const featuredSpotlight = document.getElementById('featuredSpotlight');
            const postsCollection = document.getElementById('postsCollection');
            const contentFooter = document.getElementById('contentFooter');
            
            if (loadingContainer) {
                // 新版布局
                loadingContainer.style.display = 'none';
                if (featuredSpotlight) featuredSpotlight.style.display = 'block';
                if (postsCollection) postsCollection.style.display = 'block';
                if (contentFooter) contentFooter.style.display = 'block';
                
                console.log('博客内容已显示');
            } else {
                // 兼容旧版布局
                const loadingElement = document.querySelector('.loading-posts');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            }
        }, 100); // 最小延迟，确保DOM渲染完成
        
    } catch (error) {
        console.error('加载博客数据失败:', error);
        showEmptyState('加载失败，请稍后再试');
    }
}

// 生成博客统计信息
function generateBlogStats() {
    const stats = getPostsStats();
    
    // 更新统计数字
    const totalPostsElement = document.getElementById('totalPosts');
    const totalViewsElement = document.getElementById('totalViews');
    const totalCategoriesElement = document.getElementById('totalCategories');
    
    if (totalPostsElement) totalPostsElement.textContent = stats.totalPosts;
    if (totalViewsElement) totalViewsElement.textContent = stats.totalViews;
    if (totalCategoriesElement) totalCategoriesElement.textContent = stats.totalCategories;
    
    // 添加数字计数动画
    animateCountUp(totalPostsElement, 0, stats.totalPosts, 1000);
    animateCountUp(totalViewsElement, 0, parseInt(stats.totalViews.replace('k', '')) * 100, 1200);
    animateCountUp(totalCategoriesElement, 0, stats.totalCategories, 800);
}

// 数字计数动画
function animateCountUp(element, start, end, duration) {
    if (!element) return;
    
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
            element.textContent = element.id === 'totalViews' ? formatNumber(end * 10) : Math.round(end);
        } else {
            element.textContent = element.id === 'totalViews' ? formatNumber(Math.round(current * 10)) : Math.round(current);
        }
    }, 16);
}

// 生成精选文章
function generateFeaturedPost() {
    const featuredPosts = getFeaturedPosts();
    const container = document.getElementById('featuredPostContainer');
    
    if (!container) return;
    
    if (featuredPosts.length === 0) {
        container.innerHTML = '<div class="no-featured">暂无精选文章</div>';
        return;
    }
    
    const featuredPost = featuredPosts[0];
    container.innerHTML = generateFeaturedPostHTML(featuredPost);
}

// 生成精选文章HTML
function generateFeaturedPostHTML(post) {
    const bookmarks = getBookmarks();
    const isBookmarked = bookmarks.includes(post.id);
    const bookmarkIcon = isBookmarked ? 'fas' : 'far';
    
    return `
        <article class="post-card featured" data-category="${post.category}" onclick="window.location.href='${getPostUrl(post.id)}'">
            <div class="post-image">
                <div class="post-image-placeholder">
                    <i class="fas fa-${getCategoryIcon(post.category)}"></i>
                </div>
                <div class="post-badge">精选</div>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${post.categoryDisplayName}</span>
                    <span class="post-date">${formatDate(post.publishedAt)}</span>
                    <span class="post-read-time">${post.readTime}</span>
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${post.description}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
                <div class="post-actions">
                    <a href="${getPostUrl(post.id)}" class="post-link primary">阅读全文</a>
                    <button class="post-bookmark" title="收藏文章" data-post-id="${post.id}">
                        <i class="${bookmarkIcon} fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

// 生成文章列表
function generatePostsList() {
    const container = document.getElementById('postsGrid');
    const postsCountElement = document.getElementById('postsCount');
    
    if (!container) return;
    
    console.log('生成文章列表，filteredPosts数量:', filteredPosts.length);
    
    // 过滤精选文章，避免重复显示
    const regularPosts = filteredPosts.filter(post => !post.featured);
    
    console.log('非精选文章数量:', regularPosts.length);
    
    // 如果没有文章或者没有数据，显示空状态
    if (filteredPosts.length === 0) {
        container.innerHTML = generateEmptyStateHTML();
        if (postsCountElement) postsCountElement.textContent = '0';
        return;
    }
    
    // 如果只有精选文章，也显示它们
    const postsToShow = regularPosts.length > 0 ? regularPosts : filteredPosts;
    
    // 生成文章HTML
    const postsHTML = postsToShow.map(post => generatePostCardHTML(post)).join('');
    
    // 如果文章数量少，添加占位符
    let finalHTML = postsHTML;
    if (postsToShow.length < 3) {
        const placeholderHTML = `
            <div class="post-placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-plus-circle"></i>
                    <h4>更多精彩内容即将到来</h4>
                    <p>我正在努力创作更多高质量的技术文章</p>
                    <a href="#newsletter" class="subscribe-link">订阅更新通知</a>
                </div>
            </div>
        `;
        finalHTML += placeholderHTML;
    }
    
    container.innerHTML = finalHTML;
    
    // 更新文章数量
    if (postsCountElement) {
        postsCountElement.textContent = postsToShow.length;
    }
    
    console.log('文章列表生成完成');
}

// 生成文章卡片HTML
function generatePostCardHTML(post) {
    const bookmarks = getBookmarks();
    const isBookmarked = bookmarks.includes(post.id);
    const bookmarkIcon = isBookmarked ? 'fas' : 'far';
    
    return `
        <article class="post-card" data-category="${post.category}" onclick="window.location.href='${getPostUrl(post.id)}'">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-category">${post.categoryDisplayName}</span>
                    <span class="post-date">${formatDate(post.publishedAt)}</span>
                    <span class="post-read-time">${post.readTime}</span>
                </div>
                <button class="post-bookmark" title="收藏文章" data-post-id="${post.id}">
                    <i class="${bookmarkIcon} fa-bookmark"></i>
                </button>
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.description}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="post-footer">
                <a href="${getPostUrl(post.id)}" class="post-link">阅读全文</a>
                <div class="post-stats">
                    <span class="post-views">
                        <i class="fas fa-eye"></i> ${formatNumber(post.views)}
                    </span>
                    <span class="post-likes">
                        <i class="fas fa-heart"></i> ${post.likes}
                    </span>
                </div>
            </div>
        </article>
    `;
}

// 生成空状态HTML
function generateEmptyStateHTML() {
    return `
        <div class="empty-posts">
            <i class="fas fa-search"></i>
            <h3>没有找到相关文章</h3>
            <p>尝试调整搜索关键词或分类筛选条件</p>
        </div>
    `;
}

// 生成侧边栏内容
function generateSidebar() {
    generatePopularPosts();
    generateCategoriesList();
    generateTagsCloud();
}

// 动态生成分类筛选标签
async function generateCategoryFilterTabs() {
    try {
        const categories = await categoryManager.loadCategoriesFromFileSystem();
        const container = document.getElementById('categoryFilterTabs');
        
        if (!container) return;
        
        // 保留"全部"标签，清空其他内容
        container.innerHTML = `
            <button class="filter-tab active" data-category="all">
                <span class="tab-content">
                    <span class="tab-emoji">📚</span>
                    <span class="tab-text">全部</span>
                </span>
            </button>
        `;
        
        // 分类emoji映射
        const categoryEmojis = {
            'java': '☕',
            'spring': '🌱', 
            'database': '🗄️',
            'distributed': '🌐',
            'iot': '🔌',
            'frontend': '💻',
            'backend': '⚙️',
            'algorithm': '🧮',
            'system': '🏗️',
            'ai-tools': '🤖',
            'golang': '🐹',
            'python': '🐍',
            'devops': '🚀',
            'blog': '📝',
            'project': '📋',
            'server': '🖥️',
            'gamedev': '🎮',
            'tools': '🔧',
            'other': '📄'
        };
        
        // 添加分类标签
        categories.forEach(category => {
            const tab = document.createElement('button');
            tab.className = 'filter-tab';
            tab.setAttribute('data-category', category.name);
            
            const emoji = categoryEmojis[category.name] || '📄';
            tab.innerHTML = `
                <span class="tab-content">
                    <span class="tab-emoji">${emoji}</span>
                    <span class="tab-text">${category.displayName}</span>
                </span>
            `;
            
            container.appendChild(tab);
        });
        
        // 重新绑定点击事件
        bindCategoryFilterEvents();
        
        console.log(`动态生成了 ${categories.length} 个分类筛选标签`);
        
    } catch (error) {
        console.error('生成分类筛选标签失败:', error);
    }
}

// 绑定分类筛选事件
function bindCategoryFilterEvents() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        // 移除之前的事件监听器
        tab.removeEventListener('click', tab._categoryClickHandler);
        
        // 创建新的事件处理器
        tab._categoryClickHandler = function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            console.log('点击分类标签:', category);
            
            // 调用分类过滤函数
            filterByCategory(category);
        };
        
        // 添加新的事件监听器
        tab.addEventListener('click', tab._categoryClickHandler);
    });
    
    console.log(`绑定了 ${filterTabs.length} 个分类筛选事件`);
}

// 生成热门文章
function generatePopularPosts() {
    const container = document.getElementById('popularPostsList');
    if (!container) return;
    
    const popularPosts = getPopularPosts();
    
    const html = popularPosts.map(post => `
        <article class="popular-post">
            <div class="popular-post-content">
                <h4><a href="${getPostUrl(post.id)}">${post.title}</a></h4>
                <div class="popular-post-meta">
                    <span class="post-views">${formatNumber(post.views)} 阅读</span>
                </div>
            </div>
        </article>
    `).join('');
    
    container.innerHTML = html;
}

// 生成分类列表
function generateCategoriesList() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    
    try {
        const stats = getPostsStats();
        if (!stats || !stats.categories) {
            console.warn('分类数据未准备好');
            return;
        }
        
        const categoriesHTML = stats.categories.map(category => `
            <a href="#" class="category-item" data-category="${category.name}">
                <span class="category-name">${category.displayName}</span>
                <span class="category-count">${category.count}</span>
            </a>
        `).join('');
        
        container.innerHTML = categoriesHTML;
    } catch (error) {
        console.error('生成分类列表失败:', error);
    }
}

// 생成标签云
function generateTagsCloud() {
    const container = document.getElementById('tagsCloud');
    if (!container) return;
    
    try {
        const tags = getAllTags();
        if (!tags || !Array.isArray(tags)) {
            console.warn('标签数据未准备好');
            return;
        }
        
        const tagsHTML = tags.slice(0, 12).map(tag => `
            <a href="#" class="tag-item" data-tag="${tag.name}">${tag.name}</a>
        `).join('');
        
        container.innerHTML = tagsHTML;
    } catch (error) {
        console.error('生成标签云失败:', error);
    }
}

// 获取分类图标
function getCategoryIcon(category) {
    const iconMap = {
        'java': 'code',
        'distributed': 'network-wired',
        'iot': 'microchip',
        'spring': 'leaf',
        'database': 'database',
        'other': 'file-alt'
    };
    return iconMap[category] || 'file-alt';
}

// 显示空状态
function showEmptyState(message) {
    const container = document.getElementById('postsGrid');
    if (container) {
        container.innerHTML = `
            <div class="empty-posts">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>加载失败</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// 更新分类过滤器
function updateCategoryFilters() {
    // 初始化分类过滤器事件监听
    setTimeout(() => {
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                if (category) {
                    filterByCategory(category);
                }
            });
        });
    }, 600); // 等待侧边栏生成完成
}

// 移除重复的初始化监听器，避免冲突

// 博客过滤功能
function initBlogFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const postCards = document.querySelectorAll('.post-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // 更新活动标签
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 过滤文章
            filterPosts(category, postCards);
        });
    });
}

// 过滤文章函数
function filterPosts(category, postCards) {
    currentCategory = category;
    
    // 根据当前搜索和分类过滤文章
    if (currentSearchQuery) {
        filteredPosts = searchPosts(currentSearchQuery);
    } else {
        filteredPosts = getPostsByCategory(category);
    }
    
    // 重新生成文章列表
    generatePostsList();
    
    // 更新分类统计
    updateFilterResults(filteredPosts.filter(post => !post.featured).length, category);
}

// 博客搜索功能
function initBlogSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        // 添加防抖处理
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value;
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(searchTerm);
            }, 300); // 300ms 防抖
        });
        
        // 支持 Enter 键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                clearTimeout(searchTimeout);
                performSearch(this.value);
            }
        });
    }
}

// 搜索文章函数  
function performSearch(searchTerm) {
    currentSearchQuery = searchTerm.toLowerCase().trim();
    
    if (currentSearchQuery === '') {
        // 清空搜索，恢复当前分类的所有文章
        filteredPosts = getPostsByCategory(currentCategory);
    } else {
        // 在当前分类中搜索
        const categoryPosts = getPostsByCategory(currentCategory);
        filteredPosts = categoryPosts.filter(post => 
            post.title.toLowerCase().includes(currentSearchQuery) ||
            post.description.toLowerCase().includes(currentSearchQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(currentSearchQuery))
        );
        
        // 如果有搜索词，重置分类为全部
        if (currentSearchQuery !== '') {
            currentCategory = 'all';
            const filterTabs = document.querySelectorAll('.filter-tab');
            filterTabs.forEach(tab => tab.classList.remove('active'));
            const allTab = document.querySelector('.filter-tab[data-category="all"]');
            if (allTab) allTab.classList.add('active');
        }
    }
    
    // 重新生成文章列表
    generatePostsList();
    
    // 更新搜索统计
    updateSearchResults(filteredPosts.filter(post => !post.featured).length, currentSearchQuery);
}

// 更新文章统计
function updatePostStats() {
    const visiblePosts = document.querySelectorAll('.post-card:not(.hidden)');
    const totalPostsElement = document.getElementById('totalPosts');
    
    if (totalPostsElement) {
        totalPostsElement.textContent = visiblePosts.length;
    }
}

// 订阅表单处理
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // 这里可以添加实际的订阅逻辑
                showNotification('订阅成功！感谢您的关注', 'success');
                emailInput.value = '';
            } else {
                showNotification('请输入有效的邮箱地址', 'error');
            }
        });
    }
}

// 邮箱验证
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 博客页面动画
function initBlogAnimations() {
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll(
        '.blog-header-content, .filter-container, .post-card, .newsletter-content'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// 显示通知（复用主页的函数）
function showNotification(message, type) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // ESC 清空搜索
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    }
});

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    // 初始化文章统计
    updatePostStats();
    
    // 添加键盘导航支持
    initKeyboardNavigation();
});

// 键盘导航
function initKeyboardNavigation() {
    const postCards = document.querySelectorAll('.post-card');
    let currentIndex = -1;
    
    document.addEventListener('keydown', function(e) {
        // 如果搜索框获得焦点，不处理导航
        if (document.activeElement.id === 'searchInput') {
            return;
        }
        
        // 方向键导航
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const visibleCards = Array.from(postCards).filter(card => 
                !card.classList.contains('hidden') && card.style.display !== 'none'
            );
            
            if (visibleCards.length === 0) return;
            
            if (e.key === 'ArrowDown') {
                currentIndex = Math.min(currentIndex + 1, visibleCards.length - 1);
            } else {
                currentIndex = Math.max(currentIndex - 1, 0);
            }
            
            // 移除之前的焦点
            visibleCards.forEach(card => card.classList.remove('keyboard-focus'));
            
            // 添加当前焦点
            if (currentIndex >= 0) {
                const currentCard = visibleCards[currentIndex];
                currentCard.classList.add('keyboard-focus');
                currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Enter 键打开文章
        if (e.key === 'Enter' && currentIndex >= 0) {
            const visibleCards = Array.from(postCards).filter(card => 
                !card.classList.contains('hidden') && card.style.display !== 'none'
            );
            
            if (visibleCards[currentIndex]) {
                const link = visibleCards[currentIndex].querySelector('.post-link');
                if (link) {
                    link.click();
                }
            }
        }
    });
}

// 添加键盘焦点样式
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .post-card.keyboard-focus {
        outline: 3px solid var(--secondary-color);
        outline-offset: 2px;
    }
    
    .blog-header-content,
    .filter-container,
    .post-card,
    .newsletter-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .blog-header-content.animate-in,
    .filter-container.animate-in,
    .post-card.animate-in,
    .newsletter-content.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(keyboardStyle);

// 初始化文章交互功能
function initPostInteractions() {
    // 使用事件委托处理动态生成的元素
    
    // 处理收藏按钮点击
    document.addEventListener('click', function(e) {
        if (e.target.closest('.post-bookmark')) {
            e.stopPropagation();
            const btn = e.target.closest('.post-bookmark');
            toggleBookmark(btn);
        }
        
        // 处理文章链接点击
        if (e.target.closest('.post-link')) {
            e.stopPropagation();
            // 链接会自然导航，无需额外处理
        }
        
        // 处理分类点击
        if (e.target.closest('.category-item')) {
            e.preventDefault();
            const item = e.target.closest('.category-item');
            const category = item.dataset.category;
            if (category) {
                filterByCategory(category);
            }
        }
        
        // 处理标签点击
        if (e.target.closest('.tag-item')) {
            e.preventDefault();
            const tag = e.target.closest('.tag-item');
            const tagText = tag.textContent.toLowerCase();
            filterByTag(tagText);
        }
    });
}

// 收藏按钮切换
function toggleBookmark(btn) {
    const icon = btn.querySelector('i');
    const postId = btn.dataset.postId;
    const isBookmarked = icon.classList.contains('fas');
    
    if (isBookmarked) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('已取消收藏', 'info');
        removeFromBookmarks(postId);
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('已添加到收藏', 'success');
        addToBookmarks(postId);
    }
}

// 添加到收藏
function addToBookmarks(postId) {
    let bookmarks = getBookmarks();
    if (!bookmarks.includes(postId)) {
        bookmarks.push(postId);
        localStorage.setItem('blogBookmarks', JSON.stringify(bookmarks));
    }
}

// 从收藏中移除
function removeFromBookmarks(postId) {
    let bookmarks = getBookmarks();
    bookmarks = bookmarks.filter(id => id !== postId);
    localStorage.setItem('blogBookmarks', JSON.stringify(bookmarks));
}

// 获取收藏列表
function getBookmarks() {
    try {
        return JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
    } catch {
        return [];
    }
}

// 按分类过滤
function filterByCategory(category) {
    console.log('过滤分类:', category);
    
    // 更新当前分类
    currentCategory = category;
    
    // 清空搜索
    currentSearchQuery = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 更新分类标签状态
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
    
    // 过滤文章
    if (category === 'all') {
        filteredPosts = [...currentPosts];
    } else {
        filteredPosts = currentPosts.filter(post => post.category === category);
    }
    
    console.log(`过滤后的文章数量: ${filteredPosts.length}`);
    
    // 重新生成文章列表
    generatePostsList();
    
    // 更新统计信息
    updateFilterResults(filteredPosts.filter(post => !post.featured).length, category);
    
    // 关闭侧边栏
    const sidebar = document.getElementById('categorySidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 滚动到文章区域
    const blogContent = document.querySelector('.blog-content');
    if (blogContent) {
        blogContent.scrollIntoView({ behavior: 'smooth' });
    }
}

// 按标签过滤
function filterByTag(tagText) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = tagText;
        performSearch(tagText);
    }
    
    // 滚动到文章区域
    const blogContent = document.querySelector('.blog-content');
    if (blogContent) {
        blogContent.scrollIntoView({ behavior: 'smooth' });
    }
}

// 初始化加载更多按钮
function initLoadMoreBtn() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreInfo = document.querySelector('.load-more-info');
    
    if (loadMoreBtn && loadMoreInfo) {
        // 默认隐藏加载更多按钮，显示完成信息
        loadMoreBtn.style.display = 'none';
        loadMoreInfo.style.display = 'block';
        
        loadMoreBtn.addEventListener('click', function() {
            // 如果有更多文章数据，可以在这里实现分页加载
            this.innerHTML = '<span class="btn-text">加载中...</span><i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            setTimeout(() => {
                this.style.display = 'none';
                loadMoreInfo.style.display = 'block';
                showNotification('已显示所有文章', 'info');
            }, 1000);
        });
    }
}

// 更新搜索结果统计
function updateSearchResults(count, searchTerm) {
    const postsCountElement = document.getElementById('postsCount');
    
    if (postsCountElement) {
        if (searchTerm && searchTerm.trim() !== '') {
            postsCountElement.textContent = count;
            postsCountElement.parentElement.innerHTML = `找到 <span id="postsCount">${count}</span> 篇相关文章`;
        } else {
            postsCountElement.textContent = count;
            postsCountElement.parentElement.innerHTML = `共 <span id="postsCount">${count}</span> 篇文章`;
        }
    }
}

// 更新过滤结果统计
function updateFilterResults(count, category) {
    const postsCountElement = document.getElementById('postsCount');
    
    if (postsCountElement) {
        if (category !== 'all') {
            postsCountElement.textContent = count;
            const categoryName = getCategoryDisplayName(category);
            postsCountElement.parentElement.innerHTML = `${categoryName}分类下共 <span id="postsCount">${count}</span> 篇文章`;
        } else {
            postsCountElement.textContent = count;
            postsCountElement.parentElement.innerHTML = `共 <span id="postsCount">${count}</span> 篇文章`;
        }
    }
}

// 更新文章计数
function updatePostsCount() {
    const postsCountElement = document.getElementById('postsCount');
    if (postsCountElement && filteredPosts) {
        const count = filteredPosts.filter(post => !post.featured).length;
        postsCountElement.textContent = count;
    }
}

// 获取分类显示名称
function getCategoryDisplayName(category) {
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

// 添加平滑滚动到锚点
function smoothScrollToAnchor(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('博客页面初始化开始...');
    
    try {
        // 首先初始化文章数据
        console.log('开始初始化文章数据...');
        await initPostsData();
        
        // 等待数据加载完成后初始化博客内容
        console.log('开始初始化博客内容...');
        await initBlogContent();
        
        // 初始化搜索功能
        initBlogSearch();
        
        // 初始化过滤功能
        initBlogFilter();
        
        // 初始化邮件订阅功能
        initNewsletterForm();
        
        // 初始化动画效果
        initBlogAnimations();
        
        // 初始化键盘导航
        initKeyboardNavigation();
        
        // 初始化文章交互功能
        initPostInteractions();
        
        // 初始化加载更多按钮
        initLoadMoreBtn();
        
        // 初始化侧边栏功能
        initCategorySidebar();
        
        // 初始化快速操作栏
        initQuickActions();
        
        // 初始化增强功能
        if (typeof initBlogEnhancements === 'function') {
            initBlogEnhancements();
        }
        
        console.log('博客页面初始化完成！');
        
    } catch (error) {
        console.error('博客页面初始化失败:', error);
        showEmptyState('页面初始化失败，请刷新重试');
    }
});

// 初始化分类侧边栏功能
function initCategorySidebar() {
    const sidebar = document.getElementById('categorySidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const categoryToggleBtn = document.getElementById('categoryToggleBtn');
    
    if (!sidebar) return;
    
    // 显示侧边栏
    function showSidebar() {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 更新侧边栏统计数据
        updateSidebarStats();
    }
    
    // 隐藏侧边栏
    function hideSidebar() {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 绑定事件监听器
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', showSidebar);
    }
    
    if (categoryToggleBtn) {
        categoryToggleBtn.addEventListener('click', showSidebar);
    }
    
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', hideSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', hideSidebar);
    }
    
    // ESC键关闭侧边栏
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            hideSidebar();
        }
    });
    
    console.log('分类侧边栏功能初始化完成');
}

// 更新侧边栏统计数据
function updateSidebarStats() {
    const sidebarTotalPosts = document.getElementById('sidebarTotalPosts');
    const sidebarTotalCategories = document.getElementById('sidebarTotalCategories');
    
    if (sidebarTotalPosts) {
        sidebarTotalPosts.textContent = filteredPosts.length;
    }
    
    if (sidebarTotalCategories) {
        const categories = [...new Set(currentPosts.map(post => post.category))];
        sidebarTotalCategories.textContent = categories.length;
    }
}

// 初始化快速操作栏
function initQuickActions() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const randomPostBtn = document.getElementById('randomPostBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    // 回到顶部
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 随机文章
    if (randomPostBtn) {
        randomPostBtn.addEventListener('click', function() {
            if (currentPosts.length > 0) {
                const randomIndex = Math.floor(Math.random() * currentPosts.length);
                const randomPost = currentPosts[randomIndex];
                window.location.href = getPostUrl(randomPost.id);
            }
        });
    }
    
    // 分享页面
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            } else {
                // 复制链接到剪贴板
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('链接已复制到剪贴板', 'success');
                }).catch(() => {
                    showNotification('复制失败，请手动复制', 'error');
                });
            }
        });
    }
    
    // 显示/隐藏回到顶部按钮
    window.addEventListener('scroll', function() {
        if (scrollTopBtn) {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        }
    });
    
    console.log('快速操作栏功能初始化完成');
} 