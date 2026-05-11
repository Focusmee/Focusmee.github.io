# Blooming Logs

## 概念总方案：**海边白色唱片屋 × 向日葵唱片店叙事**

### 一句话定义

**Blooming Logs** 是一座靠海的白色唱片屋。 它外表明亮、干净、像一个海边建筑；内部却充满向日葵、老唱片、胶片照片、泥土气息、古怪小物和鲜艳色块。 它不是普通博客，而是一个 **可以进入和探索的个人艺术装置式网站**。

1. # 核心定位

## 你的网站不是“博客皮肤”

而是一个三层结构的个人空间：

### 第一层：情绪入口

用户进入时，先感受到：

-  鲜艳 
-  自由 
-  playful 
-  有点荒诞 
-  但审美是被控制过的 

### 第二层：空间叙事

用户不是“点导航栏看文章”， 而是通过 **物件** 进入内容：

-  唱片机 
-  向日葵花瓶 
-  照片墙 
-  窗边海景 
-  桌面电脑 
-  抽屉/纸箱/架子 

### 第三层：真正可长期写作的博客系统

首页艺术化，

 但文章页必须稳、清晰、可读、可维护。

1. # 世界观设定

## 网站空间设定

整体空间建议定为：

> **一座靠海的白色唱片屋** 屋外有蓝天、云、向日葵、泥土和蝴蝶； 屋内像一家你自己经营的奇怪小店： 一半是唱片店，一半是档案馆，一半是花房，一半是工作室。

它兼具四种感觉：

- **白色小屋**：提供整体建筑秩序 
- **唱片店**：提供内容入口和复古气质 
- **花房**：提供自然意象和生命力 
- **个人工作室**：承接博客、项目、技术、思考 

1. # 网站信息架构

我建议采用这种结构：

## 主导航

- **Home** 首页 / 空间入口 
- **Logs** 文章归档 
- **Collections** 分类集合 
- **Projects** 项目/作品 
- **About** 关于我 
- **Guestbook** 留言 / 互动页 

## 内容栏目建议

你说你是多类型混合，我建议分成 6 个主栏目：

### 1) **Notes**

生活随笔 / 日记 / 情绪 / 碎片记录

### 2) **Lab**

技术、AI、编程、实验项目记录

### 3) **Records**

音乐、专辑、播放列表、声音灵感

### 4) **Frames**

摄影、胶片、视觉观察、图像记录

### 5) **Garden**

灵感、自然观察、花、海、季节、感受

### 6) **Drawer**

旧稿、回看、抽屉感内容、被重新翻出来的纸片与笔记

### 命名收口决策

- `Archive` 只保留给 `/archive` 这个全站时间总归档页。
- 第六个内容栏目统一改名为 `Drawer`。
- `Drawer` 不是“比较旧的文章集合”，而是带“回看、翻找、再整理”编辑立场的栏目。

1. # 栏目与空间物件映射

这是整个网站最关键的部分。

 我给你一套很稳的映射方案：

| 空间物件                | 对应内容            | 交互方式                             |
| ----------------------- | ------------------- | ------------------------------------ |
| 唱片机 / 唱片架         | Records（音乐）     | 点击唱片切换不同音乐文章/专辑推荐    |
| 桌上的电脑 / CRT 显示器 | Lab（技术/项目）    | 屏幕亮起，进入技术文章列表           |
| 向日葵花瓶 / 花盆       | Garden / Notes      | 花朵轻微摆动，点击进入随笔与自然记录 |
| 照片墙 / 胶片相框       | Frames              | 点击不同照片进入摄影或图像笔记       |
| 抽屉 / 纸箱 / 收纳柜    | Drawer              | 拉开抽屉进入回看内容栏目             |
| 海边窗户 / 门口         | About               | 点击窗外或走向门口进入关于页         |
| 桌上的散落便签          | 随机文章 / 最近更新 | hover 后浮起，点击进入随机文章       |

1. # 首页完整体验设计

我建议首页不是完全自由乱逛，而是：

## 方案：**“引导式 3D 场景 + 热区交互”**

这是最适合 GitHub Pages 和长期维护的方案。

为什么不建议纯自由漫游？

 因为：

-  容易晕 
-  移动端很难做 
-  用户容易迷路 
-  维护成本高 

所以更好的方式是：

### 首页体验流程

## Step 1：开场

进入页面后先看到：

-  蓝天 
-  白云 
-  海面 
-  一座白色唱片屋 
-  周围几株夸张比例的向日葵 
-  蝴蝶轻微飞动 
-  标题 **Blooming Logs**

页面文案可像这样：

**Blooming Logs** *A white vinyl house by the sea, growing notes, noise, and sunflowers.*

中文副文案可选：

> 一座靠海的白色唱片屋，生长着日志、噪音和向日葵。

## Step 2：进入空间

点击 “Enter” 或滚轮下滑，镜头推进进入屋内。

## Step 3：屋内探索

用户在屋内看到主要物件，每个物件有轻微互动：

-  唱片缓慢旋转 
-  花轻摆 
-  云影掠过窗户 
-  照片轻轻晃动 
-  电脑屏幕有微弱呼吸光 
-  光标靠近某物件时出现名称和一句描述 

例如：

- **Records** — notes that sound like summer 
- **Lab** — where ideas break and bloom 
- **Garden** — soft things I noticed 
- **Frames** — film, fragments, frozen light 

## Step 4：点进内容页

点击物件后不是整个刷新，而是像“镜头靠近该物件”，然后切入对应栏目页面。

这会让整个站点更像一个完整装置，而不是多个割裂页面。

1. # 视觉风格系统

## 总体气质关键词

-  海边白房子 
-  向日葵 
-  泥土和阳光 
-  老唱片与胶片 
-  70s 复古 
-  怪诞卡通 
-  鲜艳但高级 
-  有玩具感 
-  不完美但有秩序 

## 推荐配色

建议用“明亮白基底 + 高饱和点色”。

### 基础色

- **奶油白**：#F8F5EF 
- **暖白墙面**：#FFF9F0 
- **深灰文字**：#232323 

### 主视觉色

- **向日葵黄**：#F5C400 
- **暖橙色**：#F28C28 
- **天蓝色**：#73C7F3 
- **海蓝色**：#3FA7D6 
- **粉色点缀**：#F5A3C7 
- **泥土棕**：#8C5A3C 
- **叶绿色**：#6FAF5D 

### 使用原则

-  背景尽量干净、亮 
-  鲜艳色用于标题、物件、hover 状态、按钮 
-  不要全页面高饱和铺满，不然会脏 

1. # 字体方向

你说想要那种类似 Tyler 式的感觉。 我建议不是“照着某一种具体字体去模仿”，而是采用 **三层字体结构**：

## 字体策略

1. ### 展示标题：粗、大、有海报感

用于：

-  首页大标题 
-  栏目名 
-  章节标题 

风格要点：

-  粗体 
-  有体积感 
-  有复古海报感 
-  带点玩味，不要太科技感 

1. ### 正文：干净、舒服、长期可读

用于文章正文。

 必须稳定，否则你以后会很痛苦。

1. ### 点缀字：手写感 / 贴纸感 / 标签感

用于：

-  小标签 
-  日期 
-  便签 
-  图像角标 
-  hover 小标题 

## 很适合你的排版风格

我推荐的是：

> **“粗体海报标题 + 清爽正文 + 手写式点缀标签”**

这样既能保留那种鲜艳自由的能量，

 又不会让整个博客难读。

1. # 页面设计方案

## A. 首页 Home

### 目标

让用户一下记住你。

### 必备模块

-  3D 场景入口 
-  Blooming Logs 标题 
-  一句世界观文案 
-  主要物件入口 
-  最新文章 / 最近更新 
-  一个随机入口按钮：**Play Something Random**

## B. 栏目页 Collections

每个栏目页不是普通列表，而是“从物件视角展开”。

例如：

### Records 页面

视觉元素：

-  平铺唱片封套 
-  唱片标签旋转 
-  每篇文章像一张唱片卡片 

### Garden 页面

视觉元素：

-  花、花瓣、泥土纹理 
-  文章卡片像植物标签 

### Lab 页面

视觉元素：

-  显示器、窗口、终端感的小元素 
-  但不要赛博风，要保留你整体世界观 

## C. 文章页 Post

这里一定要“收回来”。

### 文章页设计原则

-  背景干净 
-  行宽舒适 
-  字体可读 
-  保留少量风格化元素 
-  文章是主角，不是特效 

### 可保留的风格细节

-  顶部有一个小插图或物件图标 
-  标签像贴纸 
-  页脚有“下一篇像另一张唱片” 
-  阅读进度条像一根花茎或胶片条 

## D. About 页

About 页可以做成“窗边海景”。

内容可包括：

-  你是谁 
-  你写什么 
-  你喜欢什么 
-  为什么叫 Blooming Logs 
-  一张或一组你的风格照片/自画像式插图 
-  联系方式 / GitHub / 社媒 

## E. Guestbook 页

建议接入：

-  Giscus（基于 GitHub Discussions） 
-  或一个轻量留言板 

这样既有社区感，又适合 GitHub Pages。

1. # 动效与互动设计

你说希望“偏重、实验、像艺术装置”，

 那可以这样做：

## 首页互动层级

### 环境动态

-  云缓慢移动 
-  海轻微波动 
-  向日葵花头轻轻摆动 
-  蝴蝶随机飞行 
-  太阳光影变化 

### 物件动态

-  唱片缓慢旋转 
-  hover 时略微抬起 / 晃动 
-  照片轻轻摆动 
-  花盆微微放大 
-  CRT 屏幕发光 

### 镜头交互

-  鼠标移动带来轻微视差 
-  点击物件时镜头平滑推进 
-  页面切换不是硬跳转，而是有“靠近某个物件”的过渡 

### 声音系统（可选）

建议加一个右上角音频开关：

-  海浪声 
-  风声 
-  微弱唱片底噪 
-  点击唱片机时的“咔哒”音 

注意：一定要默认关闭，由用户开启。

1. # 技术栈方案（适合 GitHub Pages）

这里我给你的是 **最推荐方案**：

## 推荐技术栈

### **Astro + MDX +** **React** **+ React Three Fiber**

这是最适合你这个项目的。

## 为什么选它

### Astro

-  很适合做内容型站点 
-  静态输出非常适合 GitHub Pages 
-  性能好 
-  Markdown / MDX 写博客很舒服 

### React

-  用来承接复杂互动组件 

### React Three Fiber（Three.js 的 React 封装）

-  适合做你的 3D 场景 
-  可维护性比原生 Three.js 更高 

### MDX

-  以后写文章方便 
-  可以在文章里嵌组件 

## 配套工具建议

- **Tailwind** **CSS** 或 SCSS：样式系统 
- **GSAP**：镜头推进、页面切换动画 
- **Framer Motion**：一些普通 UI 动画 
- **Pagefind**：站内搜索 
- **Giscus**：评论 
- **RSS**：博客订阅 
- **Astro Content Collections**：文章管理 
- **Lenis**（可选）：平滑滚动 

1. # 技术架构建议

## 内容组织

```Plain
src/
  content/
    notes/
    lab/
    records/
    frames/
    garden/
    drawer/
  components/
    scene/
    ui/
    cards/
    post/
  pages/
    index.astro
    logs.astro
    collections/
    about.astro
    projects.astro
```

## 首页结构建议

首页可以拆成：

- `HeroScene`：3D 海边白色唱片屋 
- `SceneHotspots`：物件热点 
- `RecentPosts`：最新文章 
- `RandomEntry`：随机文章入口 
- `FooterMarquee`：滚动式短句 / 标签 

1. # 性能与兼容性策略

因为你想做偏重 3D，

 这一部分非常重要。

## 我强烈建议：

### 桌面端：完整版体验

-  3D 场景 
-  丰富动效 
-  过渡动画 
-  声音可选 

### 移动端：简化版体验

-  保留视觉语言 
-  3D 场景简化为轻交互或预渲染图 
-  减少实时 3D 负担 
-  保证阅读和导航优先 

## 性能原则

-  模型尽量简化、低面数 
-  贴图压缩 
-  首屏只加载必要内容 
-  3D 场景按需加载 
-  文章页不要塞重 3D 

1. # 建设节奏：最合理的开发路线

我不建议你一上来就做满配。

 最好的路线是：

## Phase 1：MVP（先跑起来）

目标：先让网站可用、可写、可部署。

包含：

-  品牌视觉定调 
-  首页静态 / 轻 3D 版本 
-  栏目页 
-  文章页 
-  About 页 
-  GitHub Pages 部署 
-  Markdown 写作体系 

## Phase 2：空间化升级

加入：

-  海边白色唱片屋场景 
-  物件热区交互 
-  镜头推进过渡 
-  花、云、海、蝴蝶动效 

## Phase 3：艺术装置感增强

加入：

-  声音系统 
-  彩蛋 
-  更丰富的页面转场 
-  动态时间变化（早晨/黄昏） 
-  更精细的视觉细节 

1. # 一套完整的视觉/文案语气

## 网站标题

**Blooming Logs**

## 英文副标题

**A white vinyl house by the sea, growing notes, noise, and sunflowers.**

## 中文副文案可选

-  靠海而生，向光记录。 
-  一座开着向日葵的白色唱片屋。 
-  在海风、泥土和噪音里种下日志。 
-  这里存放花、唱片、代码和碎片化的生活。 

## 页面语气建议

整体文案不要太正式，

 应该像：

-  有点俏皮 
-  有点诗意 
-  有点自嘲 
-  但不装腔 

例如按钮文案可以写：

- **Enter the House**
- **Play a Record**
- **Open the Drawer**
- **Pick a Flower**
- **See What’s Blooming**
- **Read Something Strange**

1. # 这套方案的最终结论

## 最终推荐定义

你的站点应该是：

> 一个以 **“海边白色唱片屋”** 为整体世界观、 以 **“向日葵唱片店式物件叙事”** 为导航方式、 以 **“艺术装置感首页 + 克制好读的文章页”** 为产品结构的个人网站。

这套方案最适合你，因为它同时满足：

-  有鲜明人格 
-  有自然与花的生命感 
-  有复古与音乐气质 
-  有实验交互 
-  能长期写博客 
-  适合 GitHub Pages 
-  可逐步迭代，不会一开始就做崩

# Blooming Logs 首页线框图

## 首页核心概念

首页不是传统博客首页，而是一个“进入式空间”。

它的结构是：

> 海边外景 → 白色唱片屋入口 → 屋内物件导航 → 最新内容 → 归档入口

视觉上是一个靠海的白色唱片屋，内容入口藏在物件里。用户不只是“点击菜单”，而是在一个私人空间里探索。

1. # 首页整体信息流

## 第一屏：海边白色唱片屋入口

### 视觉内容

屏幕中央偏下是一座白色唱片屋。

周围元素：

-  蓝天 
-  白云 
-  海平面 
-  向日葵 
-  泥土小径 
-  蝴蝶 
-  漂浮的老唱片 
-  巨大的标题 **Blooming Logs**

### 页面结构草图

```Plain
┌─────────────────────────────────────────────┐
│  top nav: Blooming Logs / Logs / About / ... │
├─────────────────────────────────────────────┤
│                                             │
│        ☁        ☁                           │
│                                             │
│              BLOOMING LOGS                  │
│    A white vinyl house by the sea,           │
│    growing notes, noise, and sunflowers.     │
│                                             │
│              [ Enter the House ]             │
│                                             │
│        🌻      白色唱片屋       🌻            │
│              ~~~~~~~~~ 海 ~~~~~~~~~          │
│                                             │
└─────────────────────────────────────────────┘
```

### 交互

-  鼠标移动时，云、标题、房子、向日葵产生轻微视差。 
-  唱片缓慢旋转。 
-  向日葵轻轻摆动。 
-  点击 **Enter the House** 后，镜头推进到屋内。 
-  移动端不做复杂 3D 漫游，只保留轻量视差和入口动画。 

## 第二屏：屋内物件导航

这是首页最重要的区域。

用户进入白色唱片屋后，看到一个 3D/伪 3D 的室内场景。室内物件对应不同栏目。

### 页面结构草图

```Plain
┌─────────────────────────────────────────────┐
│               inside the house              │
├─────────────────────────────────────────────┤
│                                             │
│  照片墙 Frames        海边窗户 About          │
│  ┌───────┐             ┌──────────┐          │
│  │photo  │             │   sea    │          │
│  └───────┘             └──────────┘          │
│                                             │
│     唱片架 Records        CRT电脑 Lab         │
│     ◎ ◎ ◎ ◎ ◎             ┌──────┐           │
│                            │ code │           │
│  向日葵花瓶 Garden/Notes   └──────┘           │
│       🌻 🌻 🌻                              │
│                                             │
│          抽屉 Drawer / Random Notes          │
│             ┌─────────────┐                  │
│             │  drawer     │                  │
│             └─────────────┘                  │
│                                             │
└─────────────────────────────────────────────┘
```

### 物件与栏目映射

```Plain
唱片机 / 唱片架     → Records
CRT 显示器 / 电脑    → Lab
向日葵花瓶 / 花盆    → Garden + Notes
照片墙 / 胶片相框    → Frames
窗户 / 门口          → About
抽屉 / 纸箱          → Drawer
桌面便签             → Random Post
```

### 每个物件的 hover 状态

#### 唱片架

显示：

```Plain
Records
music, albums, sound notes
[Play a Record]
```

动效：

-  唱片轻微弹出 
-  当前 hover 的唱片开始旋转 
-  背景出现一点唱片噪点纹理 

#### CRT 电脑

显示：

```Plain
Lab
code, AI, experiments
[Boot the Lab]
```

动效：

-  屏幕亮起 
-  出现绿色/橙色的光标闪烁 
-  屏幕上短暂显示 `blooming_logs.exe`

#### 向日葵花瓶

显示：

```Plain
Garden
soft things I noticed
[Pick a Flower]
```

动效：

-  花朵朝鼠标方向轻转 
-  花瓣轻微掉落 
-  背后出现暖黄色光晕 

#### 照片墙

显示：

```Plain
Frames
film, fragments, frozen light
[Open the Wall]
```

动效：

-  照片像被风吹动 
-  hover 的相片轻微放大 
-  胶片边框出现 

#### 海边窗户

显示：

```Plain
About
who lives here?
[Look Outside]
```

动效：

-  窗外海浪轻动 
-  云影经过 
-  光线变亮 

#### 抽屉

显示：

```Plain
Drawer
revisits, old papers, rescued drafts
[Open the Drawer]
```

动效：

-  抽屉拉开一点 
-  便签、纸片浮出来 
-  可触发一个随机文章入口 

## 第三屏：最近更新

这里要让网站回到“博客”的功能性。

### 页面结构草图

```Plain
┌─────────────────────────────────────────────┐
│              What’s Blooming                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Garden     │ │ Lab        │ │ Records  │ │
│  │ 标题        │ │ 标题        │ │ 标题      │ │
│  │ 日期/标签    │ │ 日期/标签    │ │ 日期/标签  │ │
│  └────────────┘ └────────────┘ └──────────┘ │
│                                             │
│        [ Read all logs ]  [ Random note ]    │
│                                             │
└─────────────────────────────────────────────┘
```

### 内容

展示最近 3–6 篇文章。

每张卡片建议包含：

-  栏目标签 
-  标题 
-  摘要 
-  日期 
-  心情色 / 季节标签 
-  小图标，比如唱片、花、胶片、电脑 

### 卡片风格

卡片不要太商务。建议像：

-  唱片贴纸 
-  植物标签 
-  胶片便签 
-  抽屉里的纸片 

## 第四屏：收藏入口 / 分类入口

### 页面结构草图

```Plain
┌─────────────────────────────────────────────┐
│              Collections                    │
├─────────────────────────────────────────────┤
│                                             │
│  Records     Lab      Garden                │
│  Frames      Notes    Drawer                │
│                                             │
│  每个分类是一个大色块 + 物件图标              │
│                                             │
└─────────────────────────────────────────────┘
```

### 作用

这是给不想玩 3D 的用户准备的清晰入口。

用户可以从这里直接进入栏目，不依赖场景探索。

## 第五屏：页脚 Footer

页脚可以做得有个人风格。

```Plain
┌─────────────────────────────────────────────┐
│ Blooming Logs                               │
│ A white vinyl house by the sea.             │
│                                             │
│ GitHub / RSS / Email / Guestbook            │
│                                             │
│ marquee: sunflowers / records / sea / logs  │
└─────────────────────────────────────────────┘
```

可以加一个横向滚动字幕：

```Plain
SUNFLOWERS · SEA WIND · OLD RECORDS · CODE · FILM · SMALL NOTES ·
```

# 首页完整交互脚本

## 用户进入

```Plain
页面加载
↓
云和海开始轻微运动
↓
标题 Blooming Logs 出现
↓
白色唱片屋浮现
↓
用户点击 Enter the House
↓
镜头推进进入屋内
↓
出现六个主要物件
↓
用户 hover 物件，看到栏目说明
↓
点击物件
↓
镜头靠近该物件
↓
进入对应栏目页
```

# 首页组件拆分

建议首页拆成这些组件：

```Plain
HomePage
├── SiteNav
├── HeroScene
│   ├── Sky
│   ├── Sea
│   ├── WhiteVinylHouse
│   ├── Sunflowers
│   ├── FloatingRecords
│   └── Butterflies
├── EnterTransition
├── InteriorScene
│   ├── RecordShelfHotspot
│   ├── ComputerHotspot
│   ├── SunflowerVaseHotspot
│   ├── PhotoWallHotspot
│   ├── WindowHotspot
│   └── DrawerHotspot
├── RecentPosts
├── CollectionsGrid
└── SiteFooter
```

# 全站页面结构

## 总体路由

```Plain
/
首页，3D 白色唱片屋入口

/logs
所有文章列表

/logs/[slug]
单篇文章页

/collections
栏目集合页

/collections/notes
生活随笔

/collections/lab
技术、AI、编程、实验

/collections/records
音乐、专辑、声音灵感

/collections/frames
摄影、胶片、视觉记录

/collections/garden
自然、花、海、观察

/archive
归档页

/projects
项目/作品集

/about
关于我

/guestbook
留言板

/tags/[tag]
标签聚合页

/search
搜索页

/rss.xml
RSS 订阅
```

# 页面职责说明

## `/`

首页。

 负责建立网站人格，不负责承载所有文章内容。

包含：

-  3D/互动入口 
-  物件导航 
-  最新文章 
-  分类入口 
-  随机文章 

## `/logs`

完整文章列表。

功能：

-  按时间排序 
-  支持栏目筛选 
-  支持标签筛选 
-  支持搜索入口 
-  支持按年份归档 

布局可以像“唱片箱”或“抽屉索引”。

## `/logs/[slug]`

文章详情页。

文章页必须克制。

建议结构：

```Plain
┌────────────────────────────┐
│ 返回 Logs / 当前栏目标签     │
│                            │
│ 文章标题                    │
│ 日期 / 标签 / 阅读时间       │
│                            │
│ 摘要                        │
│                            │
│ 正文                        │
│                            │
│ 上一篇 / 下一篇              │
│ 相关标签                    │
└────────────────────────────┘
```

文章页可保留轻微装饰：

-  顶部小唱片或向日葵图标 
-  阅读进度条像花茎 
-  标签像贴纸 
-  页脚出现 “play another log” 

## `/collections`

栏目集合页。

更像一个地图。

```Plain
Records
Lab
Garden
Notes
Frames
Drawer
```

每个栏目对应一个大卡片，带：

-  栏目说明 
-  代表物件 
-  最近文章 
-  进入按钮 

## `/collections/records`

音乐栏目。

视觉语言：

-  唱片 
-  封套 
-  胶片颗粒 
-  70s 配色 

适合文章类型：

-  专辑感想 
-  播放列表 
-  音乐灵感 
-  声音日记 

## `/collections/lab`

技术与实验栏目。

视觉语言：

-  CRT 电脑 
-  终端窗口 
-  实验台 
-  贴纸 
-  代码片段 

注意不要做成冷冰冰的赛博风。它应该仍然属于白色唱片屋内部。

适合文章类型：

-  Java / 并发 / 后端 
-  AI 工具 
-  个人项目 
-  技术踩坑 
-  学习路线 

## `/collections/garden`

自然与观察栏目。

视觉语言：

-  向日葵 
-  泥土 
-  植物标签 
-  海风 
-  云 

适合文章类型：

-  自然观察 
-  季节记录 
-  生活感受 
-  慢速思考 

## `/collections/frames`

摄影与图像栏目。

视觉语言：

-  胶片相框 
-  照片墙 
-  拍立得 
-  光斑 
-  扫描纸张 

适合文章类型：

-  摄影 
-  视觉收藏 
-  设计灵感 
-  图像笔记 

## `/archive`

归档页。

它是全站时间索引，不属于六个内容栏目之一。

视觉上像一个打开的抽屉。

支持：

-  按年份 
-  按月份 
-  按栏目 
-  按标签 
-  随机文章 

## `/projects`

项目页。

用于展示：

-  编程项目 
-  设计项目 
-  AI 项目 
-  实验网页 
-  未来可能的作品集 

每个项目卡片包含：

-  项目名 
-  简介 
-  技术栈 
-  GitHub 链接 
-  Demo 链接 
-  项目状态 

## `/about`

关于页。

建议做成“窗边海景”。

内容结构：

```Plain
Who lives here?
为什么叫 Blooming Logs
我写什么
我喜欢什么
我的工具
我的链接
```

可以写得不太正式，像店主介绍。

## `/guestbook`

留言页。

推荐使用 Giscus，基于 GitHub Discussions。

它适合 GitHub Pages，不需要后端。

# 内容模型设计

使用 Astro Content Collections 管理文章。

## 文章 Frontmatter 建议

每篇文章使用 `.md` 或 `.mdx`。

```Plain
---
title: "一篇文章标题"
description: "文章摘要"
pubDate: 2026-05-01
updatedDate: 2026-05-01
category: "lab"
tags: ["Java", "Concurrency", "Notes"]
mood: "sunny"
season: "spring"
cover: "/images/covers/example.jpg"
draft: false
---
```

## category 可选值

```Plain
notes
lab
records
frames
garden
drawer
```

## mood 可选值

```Plain
sunny
weird
soft
noisy
blue
muddy
bright
```

mood 可以影响文章卡片的颜色和图标。

例如：

```Plain
sunny  → 暖黄色
blue   → 天蓝色
weird  → 粉色 + 橙色
muddy  → 泥土棕
soft   → 奶油白
noisy  → 黑白唱片纹理
```

# 视觉系统蓝图

## 配色变量

建议在 CSS 中定义：

```Plain
:root {
  --cream: #f8f5ef;
  --warm-white: #fff9f0;
  --ink: #232323;

  --sunflower: #f5c400;
  --orange: #f28c28;
  --sky: #73c7f3;
  --sea: #3fa7d6;
  --pink: #f5a3c7;
  --mud: #8c5a3c;
  --leaf: #6faf5d;
}
```

## 字体系统

建议三类字体：

```Plain
Display Font
用于 Blooming Logs、栏目名、大标题。
要求：粗、复古、海报感、有一点怪。

Body Font
用于文章正文。
要求：清晰、耐读、中文英文都舒服。

Accent Font
用于标签、便签、按钮、小字。
要求：有手写或贴纸感。
```

## 字体使用规则

```Plain
首页大标题：Display Font
栏目标题：Display Font
正文：Body Font
按钮 / tag / 日期：Accent Font 或 Body Font 小变体
代码：Monospace Font
```

中文正文建议保持清晰，不要为了风格牺牲可读性。

# 技术实现蓝图

## 推荐技术栈

```Plain
Astro
MDX
React
React Three Fiber
Three.js
Tailwind CSS 或 SCSS
GSAP
Framer Motion
Pagefind
Giscus
GitHub Pages
```

## 各技术职责

```Plain
Astro
负责站点结构、静态生成、文章系统、路由。

MDX
负责长期写博客，可在文章里嵌交互组件。

React
负责复杂交互组件。

React Three Fiber
负责首页 3D 场景。

Three.js
底层 3D 能力。

GSAP
负责镜头推进、场景转场、复杂时间线动画。

Framer Motion
负责普通 UI 动效，比如卡片、按钮、弹窗。

Pagefind
负责静态站内搜索。

Giscus
负责评论/留言。

GitHub Pages
负责免费部署。
```

# 项目目录结构

建议如下：

```Plain
blooming-logs/
├── public/
│   ├── images/
│   │   ├── covers/
│   │   ├── textures/
│   │   └── icons/
│   ├── models/
│   │   ├── vinyl-house.glb
│   │   ├── record-player.glb
│   │   ├── sunflower.glb
│   │   └── butterfly.glb
│   ├── audio/
│   │   ├── sea.mp3
│   │   ├── wind.mp3
│   │   └── vinyl-noise.mp3
│   └── favicon.svg
│
├── src/
│   ├── content/
│   │   ├── logs/
│   │   │   ├── first-post.md
│   │   │   └── second-post.mdx
│   │   └── config.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro
│   │   │   ├── PostLayout.astro
│   │   │   └── CollectionLayout.astro
│   │   │
│   │   ├── scene/
│   │   │   ├── HomeScene.tsx
│   │   │   ├── ExteriorScene.tsx
│   │   │   ├── InteriorScene.tsx
│   │   │   ├── Hotspot.tsx
│   │   │   ├── Sunflowers.tsx
│   │   │   ├── Sea.tsx
│   │   │   ├── Clouds.tsx
│   │   │   └── Butterflies.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── SiteNav.astro
│   │   │   ├── SiteFooter.astro
│   │   │   ├── Button.astro
│   │   │   ├── Tag.astro
│   │   │   └── Marquee.astro
│   │   │
│   │   ├── posts/
│   │   │   ├── PostCard.astro
│   │   │   ├── PostList.astro
│   │   │   ├── RecentPosts.astro
│   │   │   └── ReadingProgress.tsx
│   │   │
│   │   └── collections/
│   │       ├── CollectionCard.astro
│   │       └── CollectionGrid.astro
│   │
│   ├── data/
│   │   ├── collections.ts
│   │   └── navigation.ts
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── logs/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── collections/
│   │   │   ├── index.astro
│   │   │   ├── notes.astro
│   │   │   ├── lab.astro
│   │   │   ├── records.astro
│   │   │   ├── frames.astro
│   │   │   ├── garden.astro
│   │   │   └── drawer.astro
│   │   ├── archive.astro
│   │   ├── projects.astro
│   │   ├── about.astro
│   │   ├── guestbook.astro
│   │   └── rss.xml.ts
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.css
│   │   └── prose.css
│   │
│   └── utils/
│       ├── posts.ts
│       ├── categories.ts
│       └── random.ts
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

# 内容集合配置

```
src/content/config.ts
import { defineCollection, z } from "astro:content";

const logs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      "notes",
      "lab",
      "records",
      "frames",
      "garden",
      "drawer",
    ]),
    tags: z.array(z.string()).default([]),
    mood: z.enum([
      "sunny",
      "weird",
      "soft",
      "noisy",
      "blue",
      "muddy",
      "bright",
    ]).default("sunny"),
    season: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  logs,
};
```

# 栏目数据配置

```
src/data/collections.ts
export const collections = [
  {
    id: "records",
    title: "Records",
    description: "music, albums, playlists, and sound notes",
    object: "record shelf",
    href: "/collections/records",
    color: "orange",
  },
  {
    id: "lab",
    title: "Lab",
    description: "code, AI, experiments, and broken ideas",
    object: "CRT computer",
    href: "/collections/lab",
    color: "sky",
  },
  {
    id: "garden",
    title: "Garden",
    description: "sunflowers, seasons, soft observations",
    object: "sunflower vase",
    href: "/collections/garden",
    color: "sunflower",
  },
  {
    id: "notes",
    title: "Notes",
    description: "personal logs, fragments, daily thoughts",
    object: "desk notes",
    href: "/collections/notes",
    color: "pink",
  },
  {
    id: "frames",
    title: "Frames",
    description: "film, photos, visual fragments",
    object: "photo wall",
    href: "/collections/frames",
    color: "sea",
  },
  {
    id: "drawer",
    title: "Drawer",
    description: "revisits, old papers, rescued drafts",
    object: "drawer",
    href: "/collections/drawer",
    color: "mud",
  },
];
```

# 首页实现结构

```
src/pages/index.astro
---
import BaseLayout from "../components/layout/BaseLayout.astro";
import SiteNav from "../components/ui/SiteNav.astro";
import SiteFooter from "../components/ui/SiteFooter.astro";
import RecentPosts from "../components/posts/RecentPosts.astro";
import CollectionGrid from "../components/collections/CollectionGrid.astro";
import HomeScene from "../components/scene/HomeScene";
---

<BaseLayout title="Blooming Logs">
  <SiteNav />

  <main>
    <section class="home-scene">
      <HomeScene client:only="react" />
    </section>

    <section class="intro">
      <p>
        A white vinyl house by the sea, growing notes, noise,
        and sunflowers.
      </p>
    </section>

    <RecentPosts />

    <CollectionGrid />
  </main>

  <SiteFooter />
</BaseLayout>
```

# 3D 场景实现方案

## 场景层级

```
HomeScene.tsx
Canvas
├── Camera
├── Lights
├── ExteriorScene
│   ├── Sky
│   ├── Sea
│   ├── WhiteVinylHouse
│   ├── Sunflowers
│   ├── FloatingRecords
│   └── Butterflies
├── InteriorScene
│   ├── RecordShelfHotspot
│   ├── ComputerHotspot
│   ├── SunflowerVaseHotspot
│   ├── PhotoWallHotspot
│   ├── WindowHotspot
│   └── DrawerHotspot
└── Html UI overlays
```

## 推荐实现策略

第一版不要急着建复杂模型。

MVP 可以用：

-  简单几何体建白房子 
-  平面贴图做唱片 
-  简化花朵模型 
-  CSS/HTML 做热点标签 
-  后续再替换成 `.glb` 模型 

这样你能更快跑起来。

# 首页 3D 状态机

需要管理几个状态：

```Plain
type SceneMode = "exterior" | "entering" | "interior";

type HotspotId =
  | "records"
  | "lab"
  | "garden"
  | "notes"
  | "frames"
  | "about"
  | "drawer";
```

基本逻辑：

```Plain
exterior
用户看到白色唱片屋

entering
点击 Enter 后镜头推进

interior
显示屋内物件，允许点击栏目
```

# 热区组件设计

```
Hotspot.tsx
type HotspotProps = {
  id: string;
  title: string;
  description: string;
  href: string;
  position: [number, number, number];
};

export function Hotspot({
  title,
  description,
  href,
  position,
}: HotspotProps) {
  return (
    <group position={position}>
      {/* 3D invisible target */}
      {/* HTML label */}
      <Html center>
        <a className="hotspot" href={href}>
          <strong>{title}</strong>
          <span>{description}</span>
        </a>
      </Html>
    </group>
  );
}
```

# 页面转场方案

推荐：

## MVP 阶段

点击物件后直接跳转到对应页面。

 加一个 CSS transition 即可。

## 第二阶段

点击物件后：

```Plain
hover object
↓
click
↓
camera moves toward object
↓
fade to warm white
↓
route change
```

可用 GSAP 控制相机位置。

# 搜索方案

推荐 Pagefind。

原因：

-  静态站点友好 
-  适合 GitHub Pages 
-  不需要后端 
-  可以索引 Markdown 文章 

页面：

```Plain
/search
```

搜索结果样式可以做成“抽屉里的索引卡”。

# 评论 / 留言方案

推荐 Giscus。

用法：

- `/guestbook` 作为留言板 
-  每篇文章底部也可以启用评论 
-  基于 GitHub Discussions 
-  不需要数据库 

# GitHub Pages 部署方案

## Astro 配置

```
astro.config.mjs
```

如果你的仓库名是：

```Plain
username.github.io
```

则一般不需要设置 `base`。

如果你的仓库名是：

```Plain
blooming-logs
```

并部署到：

```Plain
username.github.io/blooming-logs/
```

则需要：

```Plain
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://username.github.io",
  base: "/blooming-logs",
  integrations: [react(), mdx(), sitemap()],
  output: "static",
});
```

如果你用自定义域名，比如：

```Plain
bloominglogs.com
```

则：

```Plain
export default defineConfig({
  site: "https://bloominglogs.com",
  integrations: [react(), mdx(), sitemap()],
  output: "static",
});
```

# GitHub Actions 部署

```
.github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

# 开发优先级

不要一开始就做完整 3D 大场景。建议按下面顺序推进。

## Phase 1：博客骨架

目标：网站能写、能看、能部署。

完成：

```Plain
Astro 初始化
MDX 支持
文章系统
首页静态版
Logs 列表页
文章详情页
About 页
基础样式
GitHub Pages 部署
```

## Phase 2：首页视觉化

目标：形成 Blooming Logs 的世界观。

完成：

```Plain
海边白色唱片屋首屏
向日葵 / 海 / 云 / 唱片视觉
物件入口卡片
最近文章
分类入口
```

这时可以先不用真正 3D，使用 CSS + SVG + 轻量 Canvas 也可以。

## Phase 3：3D 场景

目标：把首页变成可探索空间。

完成：

```Plain
React Three Fiber Canvas
外景场景
屋内场景
热点物件
镜头推进
hover 动效
```

## Phase 4：艺术装置增强

目标：做出个人风格。

完成：

```Plain
声音开关
蝴蝶随机飞行
唱片噪点
页面转场
随机文章
隐藏彩蛋
日夜/黄昏模式
```

# MVP 版本具体范围

第一版建议只做这些：

```Plain
首页：
- 标题
- 海边白色唱片屋视觉
- 六个物件入口
- 最近文章
- 分类入口

文章：
- Markdown/MDX 写作
- 文章列表
- 文章详情页
- 标签
- 分类

功能：
- About
- Projects
- RSS
- GitHub Pages 部署
```

暂时不做：

```Plain
完整自由漫游
复杂声音系统
大型 3D 模型
高级物理互动
```

这样你不会因为一开始目标太大而卡住。

# 推荐的首页第一版布局

最实际的第一版可以是“伪 3D + 部分 Three.js”。

```Plain
第一屏：
3D Canvas 展示白色唱片屋外景

第二屏：
使用 HTML/CSS 做室内物件导航
但视觉上模拟 3D 空间

第三屏：
最近文章

第四屏：
分类入口

第五屏：
Footer
```

优点：

-  开发难度可控 
-  页面性能更好 
-  可以先把内容系统跑起来 
-  后续逐渐替换为真正 3D 

# 交互细节清单

## 必做

```Plain
Enter the House 点击推进
物件 hover 显示说明
点击物件进入栏目
最近文章卡片 hover 动效
随机文章按钮
移动端简化场景
```

## 可选

```Plain
海浪声开关
唱片噪音
花瓣飘落
蝴蝶轨迹
日夜变化
隐藏彩蛋
```

# 移动端策略

移动端不要强行复制桌面 3D。

建议移动端变成：

```Plain
顶部：Blooming Logs 标题
中间：白色唱片屋插画 / 简化 3D
下面：六个大物件卡片
再下面：最近文章
```

移动端结构：

```Plain
Hero
↓
Enter / Intro
↓
Object Cards
↓
Recent Posts
↓
Collections
```

这样可用性会好很多。

# 最终设计规格总结

## 网站身份

```Plain
Blooming Logs
一个靠海的白色唱片屋。
一个放着向日葵、唱片、胶片、代码和生活碎片的个人空间。
```

## 页面结构

```Plain
首页负责记忆点
栏目页负责分类
文章页负责阅读
归档页负责检索
About 页负责人格
Projects 页负责作品展示
Guestbook 负责互动
```

## 技术路线

```Plain
Astro 做骨架
MDX 做内容
React Three Fiber 做 3D
GSAP 做镜头动画
Pagefind 做搜索
Giscus 做评论
GitHub Pages 做部署
```

## 开发原则

```Plain
先博客，后装置。
先可写，后可玩。
首页可以疯，文章页必须稳。
3D 是入口，不是负担。
```
