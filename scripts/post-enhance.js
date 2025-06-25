// 文章详情页面增强功能
class PostEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addReadingProgress();
        this.generateTableOfContents();
        this.addRelatedPosts();
        this.enhanceCodeBlocks();
        this.addCopyCodeButtons();
        this.addScrollToTop();
        this.calculateReadingTime();
    }

    // 添加阅读进度条
    addReadingProgress() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';
        progressContainer.innerHTML = `
            <div class="reading-progress">
                <div class="progress-fill"></div>
            </div>
        `;
        
        document.body.appendChild(progressContainer);
        
        window.addEventListener('scroll', () => {
            this.updateReadingProgress();
        });
    }

    updateReadingProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = scrolled + '%';
        }
    }

    // 生成文章目录
    generateTableOfContents() {
        const content = document.querySelector('.post-content');
        if (!content) return;

        const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) return;

        const tocContainer = document.createElement('div');
        tocContainer.className = 'table-of-contents';
        tocContainer.innerHTML = `
            <div class="toc-header">
                <h3>📖 文章目录</h3>
            </div>
            <ul class="toc-list"></ul>
        `;

        const tocList = tocContainer.querySelector('.toc-list');
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            const id = `heading-${index}`;
            const text = heading.textContent.trim();
            
            heading.id = id;
            
            const listItem = document.createElement('li');
            listItem.className = `toc-level-${level}`;
            listItem.innerHTML = `<a href="#${id}" class="toc-link">${text}</a>`;
            
            const link = listItem.querySelector('.toc-link');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            tocList.appendChild(listItem);
        });

        const postHeader = document.querySelector('.post-header');
        if (postHeader) {
            postHeader.after(tocContainer);
        }
    }

    // 计算阅读时间
    calculateReadingTime() {
        const content = document.querySelector('.post-content');
        if (!content) return;
        
        const text = content.textContent || content.innerText || '';
        const wordsPerMinute = 200;
        const words = text.length / 2;
        const minutes = Math.ceil(words / wordsPerMinute);
        
        const readingTimeElements = document.querySelectorAll('.reading-time, .post-read-time');
        readingTimeElements.forEach(element => {
            element.textContent = `预计阅读 ${minutes} 分钟`;
        });
    }

    // 增强代码块
    enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach((codeBlock, index) => {
            const pre = codeBlock.parentElement;
            this.addCopyButton(pre, codeBlock);
        });
    }

    // 添加复制按钮
    addCopyButton(pre, codeBlock) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = `📋 复制`;
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyButton.innerHTML = `✅ 已复制`;
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.innerHTML = `📋 复制`;
                    copyButton.classList.remove('copied');
                }, 2000);
                
            } catch (error) {
                console.error('复制失败:', error);
            }
        });
        
        pre.appendChild(copyButton);
    }

    // 添加复制代码按钮（统一方法）
    addCopyCodeButtons() {
        // 这个方法在enhanceCodeBlocks中已经实现
    }

    // 添加回到顶部按钮
    addScrollToTop() {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.title = '回到顶部';
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollTopBtn);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
    }

    // 添加相关文章推荐
    async addRelatedPosts() {
        // 暂时使用静态推荐
        const relatedSection = document.createElement('section');
        relatedSection.className = 'related-posts';
        relatedSection.innerHTML = `
            <h3>📚 相关文章推荐</h3>
            <div class="related-posts-grid">
                <a href="blog.html" class="related-post-card">
                    <h4>查看更多文章</h4>
                    <p>探索更多技术内容和学习心得</p>
                </a>
            </div>
        `;

        const postContent = document.querySelector('.post-content');
        if (postContent) {
            postContent.after(relatedSection);
        }
    }

    // 添加图片懒加载
    addImageLazyLoading() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                img.classList.add('lazy');
                imageObserver.observe(img);
            }
        });
    }

    // 添加文章分享功能
    addShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-buttons';
        shareContainer.innerHTML = `
            <h4>分享这篇文章</h4>
            <div class="share-links">
                <button class="share-btn" data-platform="copy">
                    <span class="share-icon">🔗</span>
                    <span class="share-text">复制链接</span>
                </button>
                <button class="share-btn" data-platform="weibo">
                    <span class="share-icon">📱</span>
                    <span class="share-text">微博</span>
                </button>
                <button class="share-btn" data-platform="qq">
                    <span class="share-icon">💬</span>
                    <span class="share-text">QQ空间</span>
                </button>
            </div>
        `;
        
        // 添加分享事件
        shareContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.share-btn');
            if (!btn) return;
            
            const platform = btn.dataset.platform;
            const title = document.title;
            const url = window.location.href;
            
            this.handleShare(platform, title, url);
        });
        
        // 插入到相关文章前
        const relatedPosts = document.querySelector('.related-posts');
        if (relatedPosts) {
            relatedPosts.before(shareContainer);
        }
    }

    // 处理分享
    async handleShare(platform, title, url) {
        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    this.showToast('链接已复制到剪贴板');
                } catch (error) {
                    console.error('复制失败:', error);
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
        }
    }

    // 显示提示信息
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
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
}

// 检查是否为文章页面
function isPostPage() {
    return window.location.pathname.includes('/posts/') || 
           document.querySelector('.post-content') !== null;
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    if (isPostPage()) {
        window.postEnhancer = new PostEnhancer();
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostEnhancer;
} 