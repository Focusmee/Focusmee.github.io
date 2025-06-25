// 阅读工具栏功能
class ReadingToolbar {
    constructor() {
        this.toolbar = document.getElementById('readingToolbar');
        this.isExpanded = false;
        this.isDragging = false;
        this.currentFontSize = 16;
        this.isDarkMode = false;
        
        if (!this.toolbar) return;
        
        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupToggle();
        this.setupFontSizeControls();
        this.setupThemeToggle();
        this.setupProgressTracking();
        this.setupShareFeature();
        this.setupPrintFeature();
        this.loadUserPreferences();
        this.positionToolbar();
    }

    // 设置拖拽功能
    setupDragAndDrop() {
        const handle = this.toolbar.querySelector('.toolbar-handle');
        let startX, startY, initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = this.toolbar.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            handle.style.cursor = 'grabbing';
            
            document.addEventListener('mousemove', this.handleDrag);
            document.addEventListener('mouseup', this.handleDragEnd);
        });

        // 触摸设备支持
        handle.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            const rect = this.toolbar.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            document.addEventListener('touchmove', this.handleTouchDrag);
            document.addEventListener('touchend', this.handleDragEnd);
        });

        this.handleDrag = (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            this.updatePosition(initialX + deltaX, initialY + deltaY);
        };

        this.handleTouchDrag = (e) => {
            if (!this.isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            this.updatePosition(initialX + deltaX, initialY + deltaY);
        };

        this.handleDragEnd = () => {
            this.isDragging = false;
            handle.style.cursor = 'grab';
            
            document.removeEventListener('mousemove', this.handleDrag);
            document.removeEventListener('mouseup', this.handleDragEnd);
            document.removeEventListener('touchmove', this.handleTouchDrag);
            document.removeEventListener('touchend', this.handleDragEnd);
            
            this.savePosition();
        };
    }

    // 更新工具栏位置
    updatePosition(x, y) {
        // 限制在视窗范围内
        const maxX = window.innerWidth - this.toolbar.offsetWidth;
        const maxY = window.innerHeight - this.toolbar.offsetHeight;
        
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        this.toolbar.style.left = x + 'px';
        this.toolbar.style.top = y + 'px';
        this.toolbar.style.right = 'auto';
        this.toolbar.style.bottom = 'auto';
    }

    // 设置工具栏初始位置
    positionToolbar() {
        const savedPosition = localStorage.getItem('readingToolbarPosition');
        
        if (savedPosition) {
            const { x, y } = JSON.parse(savedPosition);
            this.updatePosition(x, y);
        } else {
            // 默认位置：右侧中间
            const x = window.innerWidth - 300;
            const y = window.innerHeight / 2 - 200;
            this.updatePosition(x, y);
        }
    }

    // 保存位置
    savePosition() {
        const rect = this.toolbar.getBoundingClientRect();
        const position = {
            x: rect.left,
            y: rect.top
        };
        localStorage.setItem('readingToolbarPosition', JSON.stringify(position));
    }

    // 设置展开/收起功能
    setupToggle() {
        const toggleBtn = this.toolbar.querySelector('.toolbar-toggle');
        const content = this.toolbar.querySelector('.toolbar-content');
        
        toggleBtn.addEventListener('click', () => {
            this.isExpanded = !this.isExpanded;
            
            if (this.isExpanded) {
                content.classList.add('expanded');
                toggleBtn.querySelector('i').className = 'fas fa-chevron-right';
                this.toolbar.classList.add('expanded');
            } else {
                content.classList.remove('expanded');
                toggleBtn.querySelector('i').className = 'fas fa-chevron-left';
                this.toolbar.classList.remove('expanded');
            }
            
            localStorage.setItem('readingToolbarExpanded', this.isExpanded);
        });
    }

    // 设置字体大小控制
    setupFontSizeControls() {
        const decreaseBtn = this.toolbar.querySelector('[data-action="decrease"]');
        const increaseBtn = this.toolbar.querySelector('[data-action="increase"]');
        const sizeDisplay = this.toolbar.querySelector('.font-size-display');
        
        decreaseBtn.addEventListener('click', () => {
            if (this.currentFontSize > 12) {
                this.currentFontSize -= 1;
                this.updateFontSize();
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            if (this.currentFontSize < 24) {
                this.currentFontSize += 1;
                this.updateFontSize();
            }
        });
    }

    // 更新字体大小
    updateFontSize() {
        const content = document.querySelector('.post-content');
        const sizeDisplay = this.toolbar.querySelector('.font-size-display');
        
        if (content) {
            content.style.fontSize = this.currentFontSize + 'px';
            content.style.lineHeight = (this.currentFontSize * 1.6) + 'px';
        }
        
        sizeDisplay.textContent = this.currentFontSize + 'px';
        localStorage.setItem('readingFontSize', this.currentFontSize);
    }

    // 设置主题切换
    setupThemeToggle() {
        const themeToggle = this.toolbar.querySelector('#themeToggle');
        
        themeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            
            if (this.isDarkMode) {
                document.body.classList.add('dark-mode');
                themeToggle.querySelector('i').className = 'fas fa-sun';
                themeToggle.querySelector('span').textContent = '浅色模式';
            } else {
                document.body.classList.remove('dark-mode');
                themeToggle.querySelector('i').className = 'fas fa-moon';
                themeToggle.querySelector('span').textContent = '深色模式';
            }
            
            localStorage.setItem('readingDarkMode', this.isDarkMode);
        });
    }

    // 设置阅读进度追踪
    setupProgressTracking() {
        const percentageDisplay = this.toolbar.querySelector('#readingPercentage');
        const progressFillMini = this.toolbar.querySelector('.progress-fill-mini');
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            
            percentageDisplay.textContent = Math.round(scrolled) + '%';
            progressFillMini.style.width = scrolled + '%';
        });
    }

    // 设置分享功能
    setupShareFeature() {
        const shareBtn = this.toolbar.querySelector('#shareBtn');
        
        shareBtn.addEventListener('click', () => {
            this.showShareModal();
        });
    }

    // 显示分享模态框
    showShareModal() {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3>分享这篇文章</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="share-options">
                    <button class="share-option" data-platform="copy">
                        <i class="fas fa-link"></i>
                        复制链接
                    </button>
                    <button class="share-option" data-platform="weibo">
                        <i class="fab fa-weibo"></i>
                        微博
                    </button>
                    <button class="share-option" data-platform="qq">
                        <i class="fab fa-qq"></i>
                        QQ空间
                    </button>
                    <button class="share-option" data-platform="wechat">
                        <i class="fab fa-weixin"></i>
                        微信
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 关闭模态框
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // 分享选项点击事件
        modal.querySelectorAll('.share-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const platform = e.currentTarget.dataset.platform;
                this.handleShare(platform);
                document.body.removeChild(modal);
            });
        });
    }

    // 处理分享
    async handleShare(platform) {
        const title = document.title;
        const url = window.location.href;
        
        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    this.showToast('链接已复制到剪贴板');
                } catch (error) {
                    console.error('复制失败:', error);
                    this.showToast('复制失败，请手动复制');
                }
                break;
            case 'weibo':
                const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                window.open(weiboUrl, '_blank');
                break;
            case 'qq':
                const qqUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                window.open(qqUrl, '_blank');
                break;
            case 'wechat':
                this.showToast('请复制链接到微信分享');
                await navigator.clipboard.writeText(url);
                break;
        }
    }

    // 设置打印功能
    setupPrintFeature() {
        const printBtn = this.toolbar.querySelector('#printBtn');
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 显示提示信息
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'reading-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 加载用户偏好设置
    loadUserPreferences() {
        // 字体大小
        const savedFontSize = localStorage.getItem('readingFontSize');
        if (savedFontSize) {
            this.currentFontSize = parseInt(savedFontSize);
            this.updateFontSize();
        }
        
        // 深色模式
        const savedDarkMode = localStorage.getItem('readingDarkMode');
        if (savedDarkMode === 'true') {
            this.isDarkMode = true;
            document.body.classList.add('dark-mode');
            const themeToggle = this.toolbar.querySelector('#themeToggle');
            themeToggle.querySelector('i').className = 'fas fa-sun';
            themeToggle.querySelector('span').textContent = '浅色模式';
        }
        
        // 展开状态
        const savedExpanded = localStorage.getItem('readingToolbarExpanded');
        if (savedExpanded === 'true') {
            this.isExpanded = true;
            const content = this.toolbar.querySelector('.toolbar-content');
            const toggleBtn = this.toolbar.querySelector('.toolbar-toggle');
            content.classList.add('expanded');
            toggleBtn.querySelector('i').className = 'fas fa-chevron-right';
            this.toolbar.classList.add('expanded');
        }
    }

    // 响应式处理
    handleResize() {
        // 确保工具栏不会超出视窗
        const rect = this.toolbar.getBoundingClientRect();
        const maxX = window.innerWidth - this.toolbar.offsetWidth;
        const maxY = window.innerHeight - this.toolbar.offsetHeight;
        
        if (rect.left > maxX || rect.top > maxY) {
            this.updatePosition(
                Math.min(rect.left, maxX),
                Math.min(rect.top, maxY)
            );
        }
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否为文章页面
    if (document.querySelector('.post-content')) {
        window.readingToolbar = new ReadingToolbar();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            if (window.readingToolbar) {
                window.readingToolbar.handleResize();
            }
        });
    }
}); 