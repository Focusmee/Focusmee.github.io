# 首页交互层重做清单

> 前提：Astro 静态输出 + GitHub Pages 部署；不改现有内容系统，只重做首页交互层。

## 可行性结论

- [x] 可行。当前项目已经是 `output: "static"`，构建产物进入 `dist`，适合 GitHub Pages。
- [x] 可行。首页可以通过 Astro 组件 + 局部 React island 承载 GSAP、ScrollTrigger 和少量 R3F，不需要服务端运行时。
- [x] 可行。现有 `src/data/collections.ts` 已有六个栏目元数据，可以继续作为热点入口数据源，不需要改 Content Collections。
- [x] 可行。现有 `/collections/[collection]`、文章页、RSS、sitemap、Giscus 等页面可以保持不变。
- [x] 已确认最终 GitHub Pages 形态：仓库为 `Focusmee/Focusmee.github.io`，属于用户主页仓库，默认 `BASE_PATH=/`。
- [x] 已确认允许新增前端依赖：`gsap`、`three`、`@react-three/fiber`、`@react-three/drei`，前提是构建产物能在 GitHub Pages 正常运行展示。

## GitHub Pages 约束

- [ ] 所有资源路径必须兼容 `import.meta.env.BASE_URL` 或 Astro `base`，不能写死根路径。
- [ ] 不能依赖 SSR、API route、Node 运行时、运行时文件写入、服务端 session。
- [ ] 首页交互必须在浏览器端渐进增强：JS 失败时仍能看到静态海报、栏目入口和后续内容。
- [ ] Three/R3F 只做局部高光物件，不能把首屏做成大型 3D 场景，避免 GitHub Pages 首屏加载过重。
- [ ] 外部字体、图片、音频如继续使用远端资源，需要接受网络不稳定风险；关键视觉资产优先放入 `public/` 或经 Vite 打包。
- [x] `npm run build` 必须通过；构建后用 `npm run preview` 验证静态路径。

## 不改范围

- [ ] 不改 `src/content.config.ts` 的内容集合 schema。
- [ ] 不迁移 `src/content/logs` 里的文章。
- [ ] 不改变六个栏目 id：`records`、`lab`、`garden`、`notes`、`frames`、`drawer`。
- [ ] 不重写文章页、合集页、归档页、Projects、About、Guestbook 的信息架构。
- [ ] 不把首页做成完整 3D 漫游。

## 现有首页模块梳理

当前首页入口在 `src/pages/index.astro`，结构是：`HeroScene`、精选文章、最近文章、合集地图、Phase 1 说明块。重做范围只落在首页顶部交互层和它内部的栏目热点表达，不触碰文章读取、栏目数据、内容集合和其他页面。

- [x] 替换 `HeroScene`：这是当前首页的主视觉入口，包含标题文案、静态小房子插画、`Enter the House`、随机文章按钮，以及一组静态栏目热点。新方案会把它替换为海边 city pop 唱片店海报、滚动推进、室内物件热点和局部 R3F 高光。
- [x] 保留精选文章模块：`RecentPosts` 第一次调用展示 `getFeaturedLogs(3)`，承担首页叙事结束后的内容承接，不改数据来源、不改文章卡片结构。
- [x] 保留最近文章模块：`RecentPosts` 第二次调用展示排除 featured 后的最近三篇文章，继续作为更新流入口。
- [x] 保留合集数据与栏目页：六个栏目继续来自 `src/data/collections.ts`，新首页热点只改变呈现方式，点击后仍进入现有 `/collections/...`。
- [x] 保留 `CollectionGrid` 作为后续内容模块：室内热点已经承担“空间地图”，但 `CollectionGrid` 仍适合作为动画结束后的传统可读导航和无 JS fallback 补强。后续实现时可以调整标题文案，避免和室内热点重复。
- [x] 暂不改 `BaseLayout`、全局导航、页脚、文章页、合集页、RSS、sitemap、Giscus。
- [x] 标记 Phase 1 说明块为可移除/可改写：当前 `split-grid` 里的 Phase 1 文案是项目阶段说明，不属于最终首页世界观。新首页落地时建议删除，或改成更自然的站点介绍块；这不影响内容系统。

## 目标体验

- [x] 首屏外景：完整唱片店海报出现，海面轻微闪动，云层慢漂，花与棕榈树形成前景层次。
- [ ] 滚动开始：店铺区域 pin 住，镜头从远景推向门口。
- [ ] 视差推进：海面、前景花束、棕榈叶、云层按不同速度移动。
- [x] 门口过渡：玻璃反光扫过，室内物件可见度上升，招牌和雨棚透视感增强。
- [x] 室内地图：六个栏目变成六个店内物件热点，而不是普通菜单。
- [ ] 聚焦物件：hover 或 click 后展示栏目介绍，重点物件有轻量 R3F 高光或旋转细节。
- [x] 内容延续：交互叙事结束后无缝进入现有 Featured、Recent、Collections 等首页模块。

## 信息架构映射

- [x] `Records`：门口唱片架，作为最亮入口。
- [x] `Lab`：店内 CRT / 工作台。
- [x] `Garden`：窗边盆栽与向日葵。
- [x] `Notes`：前台便签或收银台纸条。
- [x] `Frames`：右侧海报墙或照片墙。
- [x] `Drawer`：柜台下抽屉，作为偏隐藏入口。

## 图层拆分

- [x] 背景层：天空渐变、太阳、海平线、海面条纹。
- [x] 远景层：帆船、海面亮线、低频云层。
- [x] 主体层：店铺外墙、招牌、雨棚、玻璃门、橱窗、台阶。
- [x] 中景叙事层：门口唱片架、右侧海报、店内吊灯、窗内陈设。
- [x] 前景层：向日葵、棕榈树、地面投影。
- [x] 特效层：玻璃扫光、海面 shimmer、空气粒子、聚焦局部光晕。

## City Pop 静态海报细节

- [x] 天空增加高饱和蓝色渐变、太阳条纹、太阳环、低频云层和海平线泛光。
- [x] 海面增加多层水平色带、亮线、sparkle、帆船硬边阴影和薄荷绿夏日反光。
- [x] 店铺增加外墙切面、招牌细线、小字、雨棚阴影、玻璃反射、门把手、门槛和台阶分缝。
- [x] 室内增加唱片架封面、CRT 工作台、窗内海景、吊灯、唱片陈设、柜台便签和抽屉。
- [x] 右侧海报增加 city pop 夕阳、棕榈、海浪和硬边投影。
- [x] 前景增加更多向日葵、棕榈叶、路桩、人行道砖缝和地面投影。
- [x] 前景向日葵和棕榈树改为内联 SVG 贴图式素材，参考上传图的多层花瓣、叶脉、棕榈叶簇和硬边插画投影效果。
- [x] 向日葵改为更高饱和的黄色、粉色阴影与薄荷绿叶片，数量增加并用多种大小、倾斜和层级形成更密集的花丛。
- [x] 样式继续封装在首页唱片店专用组件与 `src/styles/home-record-store.css` 中，不修改全局 tokens、layout、文章或合集组件。

## 滚动分镜

- [ ] `0.00 - 0.18`：外景稳定展示，只保留轻微呼吸感。
- [ ] `0.18 - 0.42`：海面、花、棕榈、云开始视差，建立景深。
- [ ] `0.42 - 0.72`：镜头推进到门口，玻璃反光增强，室内可见度上升。
- [ ] `0.72 - 1.00`：外景让位给室内地图，焦点从店切到六个物件入口。
- [ ] 室内阶段之后不再强推滚动动画，改成用户主导 hover/click 探索。

## 建议文件清单

- [x] 新建 `src/components/home/RecordStoreHero.astro`：首页首屏外壳、静态 fallback、文案和插槽。
- [ ] 新建 `src/components/home/RecordStorePoster.tsx`：可交互唱片店海报 React island。
- [ ] 新建 `src/components/home/RecordStoreHotspots.tsx`：六个栏目物件热点和详情面板。
- [ ] 新建 `src/components/home/VinylHighlight.tsx`：R3F 局部黑胶高光物件。
- [x] 新建 `src/components/home/homeHotspots.ts`：把现有 `collections` 转成首页热点坐标和物件配置。
- [x] 新建 `src/styles/home-record-store.css` 或组件内样式：首页交互层专用样式。
- [x] 修改 `src/pages/index.astro`：用新首页交互层替换当前 `HeroScene`，保留后续内容模块。
- [ ] 可选保留 `src/components/scene/HeroScene.astro`：作为旧版备份或移动端 fallback。
- [x] 修改 `package.json`：新增 `gsap`、`three`、`@react-three/fiber`、`@react-three/drei`。
- [x] 修改 `package-lock.json`：随依赖安装自动更新。
- [ ] 可选新增 `public/assets/home/`：存放后续拆分出来的贴图、海报纹理、音频或位图资产。

## 实施任务

- [x] 1. 梳理现有首页：确认哪些模块保留、哪些只替换视觉入口。
- [x] 2. 安装动画和 3D 依赖，确认 Astro 静态构建兼容。
- [x] 3. 搭建静态海报结构：先用 HTML/SVG/CSS 完成外景分层，不接滚动动画。
- [x] 4. 完成响应式布局：桌面是海报式唱片店，移动端降级为可滑动大物件地图。
- [ ] 5. 接入 GSAP + ScrollTrigger：实现 pin、progress timeline、视差、玻璃扫光、室内显现。
- [ ] 6. 接入热点状态：hover、focus、click 都能切换当前栏目详情。
- [x] 7. 接入路由跳转：点击物件进入对应 `/collections/...` 页面，路径走 `withBase`。
- [ ] 8. 接入 R3F 局部高光：只用于黑胶、CRT 屏幕或玻璃反光中的一个到两个物件。
- [x] 9. 做可访问性：键盘可聚焦、按钮有可读 label、`prefers-reduced-motion` 下关闭滚动叙事动画。
- [ ] 10. 做性能控制：R3F 懒加载，Canvas 尺寸受控，低性能设备使用 CSS/SVG fallback。
- [x] 11. 与现有内容模块拼接：滚动叙事结束后自然进入 Featured、Recent、Collections。
- [x] 12. 本地验证：`npm run check`、`npm run build`、`npm run preview`。
- [ ] 13. 浏览器验证：桌面、平板、手机宽度下检查首屏、pin 区域、热点、后续内容是否重叠。
- [ ] 14. GitHub Pages 验证：确认 `BASE_PATH` 下静态资源、路由、RSS、sitemap 不破。

## 验收标准

- [x] 首页首屏第一眼就是海边 city pop 唱片店，而不是普通博客 hero。
- [ ] 滚动推进的主角是 SVG/HTML 分层海报，Three/R3F 只作为点睛效果。
- [ ] 六个栏目在室内阶段作为物件热点出现，且仍然链接到现有栏目页。
- [x] JS 关闭或动画失败时，首页仍能展示静态海报和六个栏目入口。
- [x] `prefers-reduced-motion: reduce` 用户不会被强制滚动动画打扰。
- [ ] Lighthouse 不出现明显的首屏阻塞问题。
- [x] `npm run build` 通过，`dist` 可直接由 GitHub Pages 托管。

## 风险与处理

- [ ] 风险：GSAP pin 与 Astro 页面转场冲突。处理：首页 island 初始化时清理 ScrollTrigger，路由切换前后重新注册。
- [ ] 风险：移动端滚动 pin 体验笨重。处理：移动端禁用 pin，改为横向或纵向物件地图。
- [ ] 风险：R3F 增加包体。处理：只懒加载局部组件，必要时第一版先用 CSS 光效替代。
- [ ] 风险：SVG/HTML 分层过多导致维护困难。处理：按背景、远景、主体、中景、前景、特效拆组件。
- [ ] 风险：GitHub Pages 子路径资源丢失。处理：所有链接和资产统一走 Astro import、`public` 绝对基路径或 `withBase`。

## 第一阶段最小交付

- [x] 替换当前首页 hero 为静态分层唱片店海报。
- [x] 保留现有 Featured、Recent、Collections 内容模块。
- [x] 六个栏目变成店内物件热点。
- [x] 完成桌面和移动端基础响应式。
- [x] 完成 GitHub Pages 静态构建验证。

## 第二阶段增强交付

- [ ] 加 GSAP pin 和滚动推进。
- [ ] 加玻璃扫光、海面 shimmer、云层慢漂、花和棕榈视差。
- [ ] 加热点详情面板与键盘交互。
- [x] 加 `prefers-reduced-motion` 降级。

## 第三阶段点睛交付

- [ ] 给 Records 黑胶或 Lab CRT 加 R3F 局部高光。
- [ ] 加空气粒子或局部光晕，但保持低密度。
- [ ] 做最终性能和 GitHub Pages 子路径验收。
