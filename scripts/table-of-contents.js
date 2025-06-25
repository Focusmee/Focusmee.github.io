// 文章目录功能
class TableOfContents {
    constructor() {
        this.tocContainer = null;
        this.tocList = null;
        this.headings = [];
        this.isVisible = false;
        this.activeIndex = -1;
        this.init();
    }

    init() {
        this.createTocContainer();
        this.collectHeadings();
        if (this.headings.length > 0) {
            this.generateToc();
            this.bindEvents();
            this.updateActiveHeading();
        } else {
            this.hideToc();
        }
    }

    createTocContainer() {
        // 创建目录容器
        const tocHTML = `
            <div class="toc-container" id="toc-container">
                <div class="toc-header">
                    <h3 class="toc-title">
                        <i class="toc-icon">📖</i>
                        目录
                        <button class="toc-toggle" id="toc-toggle">
                            <i class="toggle-icon">📖</i>
                        </button>
                    </h3>
                </div>
                <div class="toc-content" id="toc-content">
                    <ul class="toc-list" id="toc-list"></ul>
                </div>
                <div class="toc-progress">
                    <div class="toc-progress-bar" id="toc-progress-bar"></div>
                </div>
            </div>
        `;

        // 插入到文章容器中
        const postContainer = document.querySelector('.post-container');
        if (postContainer) {
            postContainer.insertAdjacentHTML('afterbegin', tocHTML);
            this.tocContainer = document.getElementById('toc-container');
            this.tocList = document.getElementById('toc-list');
        }
    }

    collectHeadings() {
        // 收集文章中的标题
        const postContent = document.querySelector('.post-content');
        if (!postContent) return;

        const headingSelectors = 'h1, h2, h3, h4, h5, h6';
        const headingElements = postContent.querySelectorAll(headingSelectors);
        
        this.headings = Array.from(headingElements).map((heading, index) => {
            // 为标题添加ID（如果没有的话）
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
            
            return {
                element: heading,
                id: heading.id,
                text: heading.textContent.trim(),
                level: parseInt(heading.tagName.charAt(1)),
                offsetTop: 0 // 稍后计算
            };
        });

        // 计算偏移量
        this.updateHeadingOffsets();
    }

    updateHeadingOffsets() {
        this.headings.forEach(heading => {
            heading.offsetTop = heading.element.offsetTop;
        });
    }

    generateToc() {
        if (!this.tocList || this.headings.length === 0) return;

        let tocHTML = '';
        
        this.headings.forEach((heading, index) => {
            const levelClass = `toc-level-${heading.level}`;
            const isActive = index === this.activeIndex ? 'active' : '';
            
            tocHTML += `
                <li class="toc-item ${levelClass} ${isActive}" data-index="${index}">
                    <a href="#${heading.id}" class="toc-link" data-target="${heading.id}">
                        <span class="toc-bullet">•</span>
                        <span class="toc-text">${heading.text}</span>
                    </a>
                </li>
            `;
        });

        this.tocList.innerHTML = tocHTML;
        this.isVisible = true;
    }

    bindEvents() {
        // 目录切换按钮事件
        const toggleBtn = document.getElementById('toc-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleToc();
            });
        }

        // 目录容器点击事件（用于悬浮球状态下的点击）
        if (this.tocContainer) {
            this.tocContainer.addEventListener('click', (e) => {
                // 如果是collapsed状态且点击的是容器本身，则展开目录
                if (this.tocContainer.classList.contains('collapsed') && 
                    e.target === this.tocContainer || 
                    e.target.closest('.toc-header')) {
                    e.stopPropagation();
                    this.toggleToc();
                }
            });
        }

        // 目录链接点击事件
        this.tocList.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('.toc-link');
            if (link) {
                const targetId = link.dataset.target;
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            }
        });

        // 滚动事件
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.updateActiveHeading();
                this.updateProgress();
            }, 10);
        });

        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            this.updateHeadingOffsets();
        });

        // 移动端触摸事件
        this.addMobileSupport();
        
        // 添加拖拽功能
        this.addDragSupport();
    }

    toggleToc() {
        const tocContent = document.getElementById('toc-content');
        const toggleBtn = document.getElementById('toc-toggle');
        
        if (tocContent && toggleBtn) {
            const isCollapsed = tocContent.classList.contains('collapsed');
            
            if (isCollapsed) {
                // 展开目录
                tocContent.classList.remove('collapsed');
                toggleBtn.innerHTML = '<i class="toggle-icon">📖</i>';
                this.tocContainer.classList.remove('collapsed');
                
                // 恢复到原始位置
                this.restoreOriginalPosition();
            } else {
                // 收起目录
                tocContent.classList.add('collapsed');
                toggleBtn.innerHTML = '<i class="toggle-icon">📚</i>';
                this.tocContainer.classList.add('collapsed');
                
                // 如果有保存的位置，恢复到那个位置
                this.restoreTocPosition();
            }
        }
    }

    // 恢复到原始位置
    restoreOriginalPosition() {
        if (this.tocContainer) {
            // 清除拖拽设置的位置样式，恢复CSS默认定位
            this.tocContainer.style.position = '';
            this.tocContainer.style.left = '';
            this.tocContainer.style.top = '';
            this.tocContainer.style.right = '';
            this.tocContainer.style.transform = '';
        }
    }

    updateActiveHeading() {
        if (this.headings.length === 0) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offset = 100; // 偏移量，提前高亮

        let activeIndex = -1;
        
        // 找到当前应该高亮的标题
        for (let i = this.headings.length - 1; i >= 0; i--) {
            if (scrollTop >= this.headings[i].offsetTop - offset) {
                activeIndex = i;
                break;
            }
        }

        // 更新高亮状态
        if (activeIndex !== this.activeIndex) {
            this.activeIndex = activeIndex;
            
            // 移除所有活动状态
            this.tocList.querySelectorAll('.toc-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // 添加当前活动状态
            if (activeIndex >= 0) {
                const activeItem = this.tocList.querySelector(`[data-index="${activeIndex}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                    this.scrollTocToActive(activeItem);
                }
            }
        }
    }

    scrollTocToActive(activeItem) {
        const tocContent = document.getElementById('toc-content');
        if (!tocContent || !activeItem) return;

        const tocRect = tocContent.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        
        if (itemRect.top < tocRect.top || itemRect.bottom > tocRect.bottom) {
            const scrollTop = activeItem.offsetTop - tocContent.offsetTop - tocRect.height / 2;
            tocContent.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('toc-progress-bar');
        if (!progressBar) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrollTop / documentHeight) * 100, 100);
        
        progressBar.style.width = `${progress}%`;
    }

    smoothScrollTo(element) {
        const offset = 80; // 考虑固定导航栏的高度
        const targetPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    hideToc() {
        if (this.tocContainer) {
            this.tocContainer.style.display = 'none';
        }
    }

    addMobileSupport() {
        // 移动端支持
        if (window.innerWidth <= 768) {
            this.tocContainer?.classList.add('mobile');
            
            // 移动端默认收起目录
            const tocContent = document.getElementById('toc-content');
            if (tocContent) {
                tocContent.classList.add('collapsed');
                this.tocContainer.classList.add('collapsed');
            }
        }
    }

    // 公共方法：重新初始化（用于动态内容更新）
    refresh() {
        this.collectHeadings();
        if (this.headings.length > 0) {
            this.generateToc();
            this.updateActiveHeading();
        }
    }

    // 添加拖拽支持
    addDragSupport() {
        if (!this.tocContainer) return;

        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let containerStartX = 0;
        let containerStartY = 0;

        // 鼠标按下事件
        const handleMouseDown = (e) => {
            // 只有在collapsed状态下才允许拖拽
            if (!this.tocContainer.classList.contains('collapsed')) return;
            
            // 确保点击的是目录容器或其头部区域
            if (e.target === this.tocContainer || e.target.closest('.toc-header')) {
                isDragging = true;
                
                // 记录开始拖拽时的鼠标位置
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                // 获取容器当前位置
                const rect = this.tocContainer.getBoundingClientRect();
                containerStartX = rect.left;
                containerStartY = rect.top;
                
                // 设置拖拽状态样式
                this.tocContainer.style.cursor = 'grabbing';
                this.tocContainer.style.userSelect = 'none';
                this.tocContainer.style.transition = 'none'; // 禁用过渡动画
                this.tocContainer.classList.add('dragging'); // 添加拖拽视觉反馈
                
                // 防止文本选择和其他默认行为
                e.preventDefault();
                e.stopPropagation();
            }
        };

        // 鼠标移动事件
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            // 计算鼠标移动的距离
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            // 计算新的位置
            let newX = containerStartX + deltaX;
            let newY = containerStartY + deltaY;
            
            // 限制拖拽范围，确保不超出视窗
            const containerWidth = this.tocContainer.offsetWidth;
            const containerHeight = this.tocContainer.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // 限制水平位置
            newX = Math.max(10, Math.min(newX, viewportWidth - containerWidth - 10));
            // 限制垂直位置
            newY = Math.max(10, Math.min(newY, viewportHeight - containerHeight - 10));
            
            // 应用新位置
            this.tocContainer.style.position = 'fixed';
            this.tocContainer.style.left = newX + 'px';
            this.tocContainer.style.top = newY + 'px';
            this.tocContainer.style.right = 'auto'; // 清除right定位
            this.tocContainer.style.transform = 'none'; // 清除transform
            
            e.preventDefault();
        };

        // 鼠标释放事件
        const handleMouseUp = (e) => {
            if (isDragging) {
                isDragging = false;
                
                // 恢复样式
                this.tocContainer.style.cursor = '';
                this.tocContainer.style.userSelect = '';
                this.tocContainer.style.transition = ''; // 恢复过渡动画
                this.tocContainer.classList.remove('dragging'); // 移除拖拽视觉反馈
                
                // 保存当前位置到localStorage，下次加载时恢复
                const rect = this.tocContainer.getBoundingClientRect();
                localStorage.setItem('tocPosition', JSON.stringify({
                    left: rect.left,
                    top: rect.top
                }));
            }
        };

        // 绑定事件
        this.tocContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // 触摸事件支持（移动端）
        const handleTouchStart = (e) => {
            if (!this.tocContainer.classList.contains('collapsed')) return;
            
            if (e.target === this.tocContainer || e.target.closest('.toc-header')) {
                const touch = e.touches[0];
                isDragging = true;
                
                dragStartX = touch.clientX;
                dragStartY = touch.clientY;
                
                const rect = this.tocContainer.getBoundingClientRect();
                containerStartX = rect.left;
                containerStartY = rect.top;
                
                this.tocContainer.style.transition = 'none';
                this.tocContainer.classList.add('dragging'); // 添加拖拽视觉反馈
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - dragStartX;
            const deltaY = touch.clientY - dragStartY;
            
            let newX = containerStartX + deltaX;
            let newY = containerStartY + deltaY;
            
            const containerWidth = this.tocContainer.offsetWidth;
            const containerHeight = this.tocContainer.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            newX = Math.max(10, Math.min(newX, viewportWidth - containerWidth - 10));
            newY = Math.max(10, Math.min(newY, viewportHeight - containerHeight - 10));
            
            this.tocContainer.style.position = 'fixed';
            this.tocContainer.style.left = newX + 'px';
            this.tocContainer.style.top = newY + 'px';
            this.tocContainer.style.right = 'auto';
            this.tocContainer.style.transform = 'none';
            
            e.preventDefault();
        };

        const handleTouchEnd = (e) => {
            if (isDragging) {
                isDragging = false;
                this.tocContainer.style.transition = '';
                this.tocContainer.classList.remove('dragging'); // 移除拖拽视觉反馈
                
                const rect = this.tocContainer.getBoundingClientRect();
                localStorage.setItem('tocPosition', JSON.stringify({
                    left: rect.left,
                    top: rect.top
                }));
            }
        };

        // 绑定触摸事件
        this.tocContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        // 恢复上次保存的位置
        this.restoreTocPosition();
    }

    // 恢复目录位置
    restoreTocPosition() {
        const savedPosition = localStorage.getItem('tocPosition');
        if (savedPosition) {
            try {
                const position = JSON.parse(savedPosition);
                
                // 验证位置是否在有效范围内
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                if (position.left >= 0 && position.left < viewportWidth - 100 &&
                    position.top >= 0 && position.top < viewportHeight - 100) {
                    
                    this.tocContainer.style.position = 'fixed';
                    this.tocContainer.style.left = position.left + 'px';
                    this.tocContainer.style.top = position.top + 'px';
                    this.tocContainer.style.right = 'auto';
                    this.tocContainer.style.transform = 'none';
                }
            } catch (e) {
                // 如果解析失败，忽略保存的位置
                console.warn('Failed to restore TOC position:', e);
            }
        }
    }
}

// 页面加载完成后初始化目录
document.addEventListener('DOMContentLoaded', function() {
    // 延迟一点初始化，确保所有内容都已渲染
    setTimeout(() => {
        window.tableOfContents = new TableOfContents();
    }, 100);
});

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableOfContents;
} 