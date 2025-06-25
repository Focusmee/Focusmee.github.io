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
            toggleBtn.addEventListener('click', () => this.toggleToc());
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
    }

    toggleToc() {
        const tocContent = document.getElementById('toc-content');
        const toggleBtn = document.getElementById('toc-toggle');
        
        if (tocContent && toggleBtn) {
            const isCollapsed = tocContent.classList.contains('collapsed');
            
            if (isCollapsed) {
                tocContent.classList.remove('collapsed');
                toggleBtn.innerHTML = '<i class="toggle-icon">📖</i>';
                this.tocContainer.classList.remove('collapsed');
            } else {
                tocContent.classList.add('collapsed');
                toggleBtn.innerHTML = '<i class="toggle-icon">📚</i>';
                this.tocContainer.classList.add('collapsed');
            }
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