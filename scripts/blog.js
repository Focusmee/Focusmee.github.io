// 博客页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 初始化博客功能
    initBlogFilter();
    initBlogSearch();
    initNewsletterForm();
    initBlogAnimations();
});

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
    postCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('show');
            card.classList.remove('hidden');
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
            card.classList.remove('show');
        }
    });
    
    // 更新统计信息
    updatePostStats();
}

// 博客搜索功能
function initBlogSearch() {
    const searchInput = document.getElementById('searchInput');
    const postCards = document.querySelectorAll('.post-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            searchPosts(searchTerm, postCards);
        });
    }
}

// 搜索文章函数
function searchPosts(searchTerm, postCards) {
    postCards.forEach(card => {
        const title = card.querySelector('.post-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.post-tag'))
            .map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const content = `${title} ${excerpt} ${tags}`;
        
        if (searchTerm === '' || content.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('show');
            card.classList.remove('hidden');
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
            card.classList.remove('show');
        }
    });
    
    // 重置过滤器标签
    if (searchTerm !== '') {
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('.filter-tab[data-category="all"]').classList.add('active');
    }
    
    // 更新统计信息
    updatePostStats();
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