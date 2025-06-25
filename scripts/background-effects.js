// 背景动态效果管理器
class BackgroundEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initHeroEffects();
        this.initAboutEffects();
        this.initBlogEffects();
        this.initMouseInteraction();
    }

    // Hero区域效果 - 浮动粒子和交互网格
    initHeroEffects() {
        const heroSection = document.querySelector('.hero');
        const particlesContainer = document.querySelector('.floating-particles');
        const meshContainer = document.querySelector('.interactive-mesh');

        if (!heroSection || !particlesContainer || !meshContainer) return;

        // 创建浮动粒子
        this.createFloatingParticles(particlesContainer);
        
        // 创建交互网格
        this.createInteractiveMesh(meshContainer);
    }

    // About区域效果 - 渐变球体和波浪线
    initAboutEffects() {
        const aboutSection = document.querySelector('.about');
        const orbsContainer = document.querySelector('.gradient-orbs');
        const wavesContainer = document.querySelector('.wave-lines');

        if (!aboutSection || !orbsContainer || !wavesContainer) return;

        // 创建渐变球体
        this.createGradientOrbs(orbsContainer);
        
        // 创建波浪线
        this.createWaveLines(wavesContainer);
    }

    // Blog区域效果 - 浮动元素和渐变叠层
    initBlogEffects() {
        const blogSection = document.querySelector('.blog');
        const floatingContainer = document.querySelector('.floating-elements');
        const gradientOverlay = document.querySelector('.gradient-overlay');

        if (!blogSection || !floatingContainer || !gradientOverlay) return;

        // 创建浮动装饰元素
        this.createBlogFloatingElements(floatingContainer);
        
        // 初始化渐变叠层动画
        this.initGradientOverlay(gradientOverlay);
    }

    // 创建浮动粒子
    createFloatingParticles(container) {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机位置和大小
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                opacity: 0.6;
                animation: float ${duration}s linear infinite ${delay}s;
                pointer-events: none;
            `;

            container.appendChild(particle);
        }
    }

    // 创建交互网格
    createInteractiveMesh(container) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);

        let mouseX = 0;
        let mouseY = 0;
        let nodes = [];

        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            this.initNodes(nodes, canvas.width, canvas.height);
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 更新和绘制节点
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                // 边界反弹
                if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
                if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

                // 鼠标交互
                const dx = mouseX - node.x;
                const dy = mouseY - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    node.x -= dx * 0.02;
                    node.y -= dy * 0.02;
                }

                // 绘制节点
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
                ctx.fill();

                // 绘制连线
                nodes.forEach((otherNode, j) => {
                    if (i !== j) {
                        const dx2 = node.x - otherNode.x;
                        const dy2 = node.y - otherNode.y;
                        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (distance2 < 100) {
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(otherNode.x, otherNode.y);
                            ctx.strokeStyle = `rgba(102, 126, 234, ${0.3 - distance2 / 300})`;
                            ctx.stroke();
                        }
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        // 鼠标移动监听
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // 初始化网格节点
    initNodes(nodes, width, height) {
        nodes.length = 0;
        const nodeCount = 30;

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    // 创建渐变球体
    createGradientOrbs(container) {
        const orbCount = 6;
        
        for (let i = 0; i < orbCount; i++) {
            const orb = document.createElement('div');
            orb.className = 'gradient-orb';
            
            const size = Math.random() * 200 + 100;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 15 + 20;
            const delay = Math.random() * 5;

            orb.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: pulse ${duration}s ease-in-out infinite ${delay}s;
                pointer-events: none;
                filter: blur(1px);
            `;

            container.appendChild(orb);
        }
    }

    // 创建波浪线
    createWaveLines(container) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.3;
        `;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', 'url(#waveGradient)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');

        // 创建渐变定义
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'waveGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#667eea');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#764ba2');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
        svg.appendChild(path);
        container.appendChild(svg);

        // 动画波浪
        let time = 0;
        const animateWave = () => {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            let d = `M 0 ${height / 2}`;
            for (let x = 0; x <= width; x += 10) {
                const y = height / 2 + Math.sin((x + time) * 0.01) * 30;
                d += ` L ${x} ${y}`;
            }
            
            path.setAttribute('d', d);
            time += 2;
            requestAnimationFrame(animateWave);
        };

        animateWave();
    }

    // 鼠标交互初始化
    initMouseInteraction() {
        const heroSection = document.querySelector('.hero');
        const aboutSection = document.querySelector('.about');

        // Hero区域鼠标跟随效果
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                heroSection.style.setProperty('--mouse-x', x);
                heroSection.style.setProperty('--mouse-y', y);
            });
        }

        // About区域视差效果
        if (aboutSection) {
            aboutSection.addEventListener('mousemove', (e) => {
                const rect = aboutSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const orbs = aboutSection.querySelectorAll('.gradient-orb');
                orbs.forEach((orb, index) => {
                    const intensity = (index + 1) * 0.5;
                    orb.style.transform = `translate(${x * intensity * 20}px, ${y * intensity * 20}px)`;
                });
            });
        }
    }

    // 创建博客浮动装饰元素
    createBlogFloatingElements(container) {
        const elementCount = 8;
        
        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.className = 'floating-decoration';
            
            const size = Math.random() * 30 + 20;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 8 + 12;
            const delay = Math.random() * 3;
            const rotationSpeed = Math.random() * 360 + 180;

            element.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(52, 152, 219, 0.08));
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: floatMove ${duration}s ease-in-out infinite ${delay}s,
                          rotate ${rotationSpeed}s linear infinite;
                pointer-events: none;
                filter: blur(0.5px);
            `;

            container.appendChild(element);
        }

        // 添加一些方形装饰元素
        for (let i = 0; i < 4; i++) {
            const square = document.createElement('div');
            square.className = 'floating-square';
            
            const size = Math.random() * 15 + 10;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 10 + 15;
            const delay = Math.random() * 4;

            square.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(74, 144, 226, 0.05);
                left: ${x}%;
                top: ${y}%;
                animation: floatMove ${duration}s ease-in-out infinite ${delay}s;
                pointer-events: none;
                transform: rotate(45deg);
            `;

            container.appendChild(square);
        }
    }

    // 初始化渐变叠层动画
    initGradientOverlay(overlay) {
        let animationFrame;
        let time = 0;

        const animate = () => {
            time += 0.01;
            
            // 创建动态渐变效果
            const gradient1X = 30 + Math.sin(time) * 10;
            const gradient1Y = 70 + Math.cos(time * 0.7) * 15;
            const gradient2X = 80 + Math.cos(time * 0.5) * 20;
            const gradient2Y = 20 + Math.sin(time * 0.8) * 10;

            overlay.style.background = `
                radial-gradient(circle at ${gradient1X}% ${gradient1Y}%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
                radial-gradient(circle at ${gradient2X}% ${gradient2Y}%, rgba(52, 152, 219, 0.08) 0%, transparent 50%)
            `;

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        // 在页面卸载时清理动画
        window.addEventListener('beforeunload', () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        });
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    .hero-bg-animation,
    .about-bg-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    }

    .hero {
        position: relative;
    }

    .about {
        position: relative;
    }

    .hero-container,
    .about .container {
        position: relative;
        z-index: 1;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.2;
        }
    }

    .interactive-mesh canvas {
        width: 100%;
        height: 100%;
    }

    .section-subtitle {
        margin-top: 0.5rem;
        color: #666;
        font-size: 1.1rem;
    }

    .blog-more {
        text-align: center;
        margin-top: 3rem;
    }

    .btn-outline {
        display: inline-block;
        padding: 12px 30px;
        border: 2px solid #667eea;
        color: #667eea;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn-outline:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        .floating-particles .particle {
            display: none;
        }
        
        .gradient-orb {
            opacity: 0.5 !important;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化背景效果
document.addEventListener('DOMContentLoaded', function() {
    new BackgroundEffects();
}); 