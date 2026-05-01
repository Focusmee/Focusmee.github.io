# Blooming Logs TODO

## 项目目标

- [ ] 打造一个“海边白色唱片屋 × 向日葵唱片店叙事”的个人博客
- [ ] 保持“首页艺术化，文章页稳定可读”的产品结构
- [ ] 以 GitHub Pages 为部署目标，先可写、后可玩、再逐步增强交互

## Phase 0：基础决策

- [x] 确认部署方式：`username.github.io`、项目子路径部署，还是自定义域名
- [x] 确认主导航结构：`Home / Logs / Collections / Projects / About / Guestbook`
- [x] 确认 6 个内容栏目：`Notes / Lab / Records / Frames / Garden / Archive`
- [x] 确认首页主标题、副标题和中英文文案语气
- [x] 确认栏目与空间物件映射关系
- [x] 确认配色 token：奶油白、暖白、深灰、向日葵黄、海蓝、泥土棕、叶绿、粉色点缀
- [x] 确认字体策略：展示标题、正文、点缀字三层结构
- [x] 确认移动端策略：不强行复刻桌面 3D，优先可读性和导航

## Phase 1：MVP 博客骨架

### 1. 项目初始化

- [x] 初始化 `Astro` 项目
- [x] 接入 `MDX`
- [x] 接入 `React`
- [x] 配置基础目录结构：`pages / components / content / styles / data / utils`
- [x] 配置站点基础信息：`site`、`base`、favicon、metadata

### 2. 内容系统

- [x] 配置 `Astro Content Collections`
- [x] 建立文章 frontmatter 规范：`title / description / pubDate / updatedDate / category / tags / mood / season / cover / draft`
- [x] 建立栏目枚举：`notes / lab / records / frames / garden / archive`
- [x] 建立 mood 枚举：`sunny / weird / soft / noisy / blue / muddy / bright`
- [x] 建立文章工具函数：排序、筛选、相关文章、随机文章

### 3. 全局布局与样式

- [x] 搭建 `BaseLayout`
- [x] 搭建全局导航和页脚
- [x] 建立 CSS token：颜色、字号、间距、阴影、圆角
- [x] 建立正文排版样式
- [x] 建立按钮、标签、卡片等基础 UI 组件

### 4. 页面搭建

- [x] 完成首页第一版
- [x] 完成 `/logs` 文章列表页
- [x] 完成 `/logs/[slug]` 文章详情页
- [x] 完成 `/collections` 栏目总览页
- [x] 完成 `/collections/notes`
- [x] 完成 `/collections/lab`
- [x] 完成 `/collections/records`
- [x] 完成 `/collections/frames`
- [x] 完成 `/collections/garden`
- [x] 完成 `/archive`
- [x] 完成 `/projects`
- [x] 完成 `/about`
- [x] 完成 `/guestbook` 占位页

### 5. 首页 MVP 模块

- [x] 完成首页标题区：`Blooming Logs`
- [x] 完成首页副标题：`A white vinyl house by the sea, growing notes, noise, and sunflowers.`
- [x] 完成海边白色唱片屋的静态或轻交互主视觉
- [x] 完成六个物件入口卡片
- [x] 完成 `Recent Posts` 模块
- [x] 完成 `Random Post` 入口按钮
- [ ] 完成首页到栏目页的基础过渡效果

### 6. 写作与内容填充

- [x] 新建 3 到 5 篇种子文章，验证内容模型可用
- [x] 为每篇文章补齐 frontmatter
- [ ] 确认标签体系不要过度发散
- [ ] 准备首页展示用的精选文章

### 7. 部署与验证

- [x] 配置 GitHub Pages 构建与部署
- [x] 添加 GitHub Actions 工作流
- [x] 本地验证构建产物
- [x] 验证静态资源路径在目标部署方式下正常
- [x] 验证首页、文章页、栏目页在移动端可用

## Phase 2：首页视觉化升级

### 1. 首页世界观强化

- [x] 完成“海边白色唱片屋”首屏视觉升级
- [ ] 补充蓝天、白云、海面、向日葵、泥土小径、蝴蝶等元素
- [ ] 增加轻微视差效果
- [x] 增加 Enter 动线，让首页更像“进入空间”

### 2. 物件叙事强化

- [ ] 为 Records 设计唱片机/唱片架视觉
- [ ] 为 Lab 设计 CRT 电脑视觉
- [ ] 为 Garden/Notes 设计向日葵花瓶视觉
- [ ] 为 Frames 设计照片墙/胶片相框视觉
- [ ] 为 Archive 设计抽屉/纸箱视觉
- [ ] 为 About 设计窗边海景入口

### 3. 栏目页视觉语言

- [ ] Records 页做成唱片封套/唱片卡风格
- [ ] Lab 页加入终端、屏幕、实验台元素，但避免赛博风过重
- [ ] Garden 页加入花、泥土、植物标签视觉
- [ ] Frames 页加入胶片、拍立得、照片墙元素
- [ ] Archive 页做成抽屉索引/旧纸张归档风格

### 4. 文章页细节

- [ ] 为文章页添加小型物件图标或插图
- [x] 为文章标签设计贴纸感样式
- [ ] 加入阅读进度条
- [x] 优化上一篇 / 下一篇导航

### 5. 移动端适配

- [ ] 将桌面首页体验整理为移动端轻量版本
- [ ] 在移动端使用大物件卡片代替复杂空间漫游
- [ ] 优化触屏 hover 替代方案

## Phase 3：3D 场景与空间交互

### 1. 技术接入

- [ ] 接入 `Three.js`
- [ ] 接入 `React Three Fiber`
- [ ] 评估是否接入 `GSAP`
- [ ] 评估是否接入 `Framer Motion`

### 2. 场景拆分

- [ ] 创建 `HomeScene`
- [ ] 创建 `ExteriorScene`
- [ ] 创建 `InteriorScene`
- [ ] 创建 `Hotspot` 组件
- [ ] 创建天空、海面、向日葵、蝴蝶等基础子组件

### 3. 首页 3D 状态机

- [ ] 定义状态：`exterior / entering / interior`
- [ ] 完成 `Enter the House` 镜头推进
- [ ] 完成屋内物件热区 hover 状态
- [ ] 完成物件点击后跳转到对应栏目

### 4. 场景资源

- [ ] 第一版先用简单几何体搭建白房子
- [ ] 第一版先用平面贴图和简化模型完成唱片、花朵、相框
- [ ] 后续评估是否替换为 `.glb` 模型
- [ ] 准备贴图、纹理、插图等视觉资源

### 5. 性能优化

- [ ] 控制模型面数
- [ ] 压缩贴图和音频资源
- [ ] 首屏只加载必要内容
- [ ] 3D 模块按需加载
- [ ] 为低性能设备提供降级方案

## Phase 4：功能增强与艺术装置感

### 1. 社区与内容功能

- [x] 接入 `Giscus` 作为 `/guestbook`
- [x] 评估是否在文章页底部也启用评论
- [ ] 接入 `Pagefind` 做站内搜索
- [x] 生成 RSS
- [x] 添加 sitemap

### 2. 互动增强

- [x] 为最近文章卡片增加 hover 动效
- [ ] 为随机文章入口增加更明显的玩法感
- [ ] 增加页面转场动画
- [ ] 增加便签、抽屉、唱片等微交互

### 3. 音频与氛围

- [ ] 增加右上角声音开关，默认关闭
- [ ] 准备海浪声、风声、微弱唱片底噪
- [ ] 评估点击物件时的交互音效

### 4. 个性化增强

- [ ] 增加蝴蝶随机轨迹
- [ ] 增加花瓣飘落
- [ ] 增加日夜或黄昏模式
- [ ] 增加隐藏彩蛋

## 暂缓项

- [ ] 暂不做完整自由漫游式 3D
- [ ] 暂不做大型复杂 3D 模型
- [ ] 暂不做高级物理互动
- [ ] 暂不做默认开启的声音系统

## 第一版完成标准

- [x] 能稳定写 Markdown/MDX 文章
- [x] 能展示首页、栏目页、文章页、About、Projects
- [ ] 能在 GitHub Pages 正常部署
- [x] 首页已经具备 Blooming Logs 的基本气质
- [x] 文章阅读体验稳定、清晰、不被特效干扰
