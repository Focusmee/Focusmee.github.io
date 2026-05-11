export type Language = "zh" | "en";

export const DEFAULT_LANGUAGE: Language = "zh";
export const LANGUAGE_STORAGE_KEY = "blooming-language";

export const uiTranslations: Record<Language, Record<string, string>> = {
  zh: {
    "skip.content": "跳到正文",
    "language.switcherLabel": "语言切换",
    "language.zh": "中",
    "language.en": "EN",
    "site.tagline": "一座靠海的白色唱片屋，生长着日志、噪音和向日葵。",
    "brand.note": "白色唱片屋与长期写作空间",
    "nav.primary": "主导航",
    "nav.home": "首页",
    "nav.logs": "日志",
    "nav.collections": "栏目",
    "nav.projects": "项目",
    "nav.about": "关于",
    "nav.guestbook": "留言",
    "footer.logs": "日志",
    "footer.collections": "栏目",
    "footer.about": "关于",

    "home.hero.eyebrow": "Blooming Logs 呈现",
    "home.hero.copy":
      "一座靠海的白色唱片屋，生长着日志、噪音和向日葵。走进 Seaside Records，在不同架子之间翻找文章、项目和日常片段。",
    "home.hero.random": "随机播放一篇",
    "home.featured.eyebrow": "前厅精选",
    "home.featured.title": "架上的三篇",
    "home.featured.lede":
      "几篇适合作为入口的文章，先从这里听见这个站的声音。",
    "home.recent.eyebrow": "最近上架",
    "home.recent.title": "正在生长",
    "home.recent.lede":
      "新的日志会在这里出现，保留一点时间顺序，也保留一点偶然。",
    "home.collections.eyebrow": "店内地图",
    "home.collections.title": "六个架子，六种入口。",
    "home.collections.lede":
      "按主题进入不同角落：唱片、实验、花园、便签、相框和抽屉。",
    "home.about.eyebrow": "关于这座唱片屋",
    "home.about.title": "先安放内容，再让空间慢慢发光。",
    "home.about.lede":
      "Blooming Logs 是我的个人博客和项目展示空间。这里会继续收集系统实验、写作片段、声音、照片和一些慢慢生长的观察。",
    "home.about.readyKicker": "现在可以读",
    "home.about.ready": "日志、项目、栏目、归档与 RSS",
    "home.about.nextKicker": "慢慢更新",
    "home.about.next":
      "更稳定的写作节奏、更多真实内容和更细致的首页交互",

    "store.map.eyebrow": "店内角落",
    "store.map.title": "每个架子都有自己的路。",
    "store.map.lede":
      "按心情走进某个角落：唱片、实验、花园、便签、相框或抽屉。",
    "store.dialog.trigger": "和 Seaside Records 向导对话",
    "store.dialog.label": "Seaside Records 向导",
    "store.dialog.line": "欢迎进来。想先打开哪一个架子？",
    "store.dialog.aboutTitle": "关于",
    "store.dialog.aboutDetail": "谁在照看这座海边档案屋",
    "store.door.enter": "进入 Seaside Records 室内",
    "retro.terminal": "Seaside Records 终端",
    "retro.loading": "加载中",
    "retro.pressStart": "PRESS START",

    "collections.records.title": "唱片",
    "collections.records.description": "音乐、专辑、歌单和声音笔记",
    "collections.records.object": "唱片架",
    "collections.records.blurb": "像夏天一样响起的笔记",
    "collections.lab.title": "实验室",
    "collections.lab.description": "代码、AI、实验和破损的想法",
    "collections.lab.object": "CRT 工作台",
    "collections.lab.blurb": "想法破裂又开花的地方",
    "collections.garden.title": "花园",
    "collections.garden.description": "向日葵、季节和柔软的观察",
    "collections.garden.object": "窗边植物",
    "collections.garden.blurb": "我注意到的缓慢事物",
    "collections.notes.title": "便签",
    "collections.notes.description": "个人日志、碎片和日常想法",
    "collections.notes.object": "桌面便签",
    "collections.notes.blurb": "仍然值得留下的小纸片",
    "collections.frames.title": "相框",
    "collections.frames.description": "胶片、照片和视觉碎片",
    "collections.frames.object": "照片墙",
    "collections.frames.blurb": "光、画面和被定格的片段",
    "collections.drawer.title": "抽屉",
    "collections.drawer.description": "重访、旧纸页和被救回的草稿",
    "collections.drawer.object": "柜台抽屉",
    "collections.drawer.blurb": "重新拉开的旧纸页",
    "collections.count": "{count} 篇",
    "collections.emptyCount": "待上架",
    "collections.latest": "最新",
    "collections.enter": "进入 {title} →",

    "logs.eyebrow": "日志",
    "logs.title": "架上的所有笔记。",
    "logs.lede":
      "按时间浏览每一篇公开日志，也可以从六个栏目进入不同角落。",
    "logs.archiveTag": "打开归档时间线",
    "archive.eyebrow": "归档",
    "archive.title": "按时间打开整座屋子。",
    "archive.lede":
      "这里保存所有公开日志的时间线；如果想按主题走，可以回到六个栏目。",
    "collections.page.eyebrow": "栏目",
    "collections.page.title": "六个架子，一张地图。",
    "collections.page.lede":
      "按主题进入不同角落；如果想按时间浏览，可以打开归档。",
    "collections.page.archive": "打开归档时间线",
    "collection.empty.title": "这个架子还在等待第一篇。",
    "collection.empty.copy": "新的日志放进来后，会自动出现在这里。",

    "post.minRead": "{minutes} 分钟阅读",
    "post.tags": "标签",
    "post.back": "返回日志",
    "post.discussTitle": "讨论这篇日志",
    "post.discussDescription": "评论会同步到 GitHub Discussions。",
    "post.navigation": "文章导航",
    "post.newer": "更新一篇",
    "post.older": "更早一篇",
    "post.noNewer": "已经到最前面了",
    "post.noOlder": "抽屉的尽头在这里",

    "projects.eyebrow": "项目",
    "projects.title": "公开构建、系统实验和持续照料的作品。",
    "projects.lede":
      "这里不是按时间排列的简历，而是一些仍然值得被打开、被解释、被继续打磨的项目。",
    "projects.github.eyebrow": "开源项目",
    "projects.github.title": "公开仓库",
    "projects.github.lede":
      "这些项目可以直接打开仓库查看代码、状态和更新记录。部分卡片会同步公开 GitHub 信息。",
    "projects.github.syncKicker": "卡片包含",
    "projects.github.syncText": "仓库链接、主要语言、星标和更新时间",
    "projects.github.manualKicker": "说明保留",
    "projects.github.manualText": "为什么做、为什么重要、它在我的工作线上代表什么",
    "projects.manual.eyebrow": "精选工作",
    "projects.manual.title": "需要更多背景的系统。",
    "projects.manual.lede":
      "有些项目不能只靠仓库链接理解。这里保留研究背景、执行机制和系统判断。",
    "projects.manual.reasonKicker": "为什么手写",
    "projects.manual.reasonText": "背景、职责和系统取舍，比仓库入口更重要。",
    "projects.manual.holdsKicker": "这里包含",
    "projects.manual.holdsText": "Agent 执行系统、实时交互链路、脑机接口与复杂系统协作经验",
    "projects.primaryLanguage": "主要语言：{language}",
    "projects.stars": "{count} 星标",
    "projects.updatedPrefix": "更新于",
    "projects.updated": "更新于 {date}",
    "projects.viewRepo": "查看仓库",
    "projects.openSite": "打开站点",
    "projects.stack": "技术栈",

    "projects.item.bloomingLogs.title": "Blooming Logs",
    "projects.item.bloomingLogs.status": "长期项目",
    "projects.item.bloomingLogs.description":
      "我的个人博客与长期写作空间。它既是内容系统，也是我整理 Agent、写作、观察与实验节奏的方式。",
    "projects.item.bikeSystem.title": "方正共享单车系统",
    "projects.item.bikeSystem.status": "竞赛项目",
    "projects.item.bikeSystem.description":
      "面向用户端、管理员端与设备端的数据互通系统，重点在设备通信、状态识别、消息补发与实时数据可视化。",
    "projects.item.farmingGame.title": "模拟经营农场游戏",
    "projects.item.farmingGame.status": "毕业设计",
    "projects.item.farmingGame.description":
      "基于 Unity 与 C# 的 2D 模拟经营游戏，围绕角色控制、种植、交易、NPC 行为与系统扩展性展开。",
    "projects.item.agentWorkflow.title": "AI Agent 工作流编排平台",
    "projects.item.agentWorkflow.status": "精选工作",
    "projects.item.agentWorkflow.description":
      "我主要参与后端执行系统的设计与实现，把前端 DSL 转换为可执行流程，并围绕执行链、节点路由、并行执行与上下文透传完成系统闭环。",
    "projects.item.agentWorkflow.highlight1":
      "设计统一节点执行器，封装变量管理、超时与重试机制，支持 LLM 与插件节点扩展。",
    "projects.item.agentWorkflow.highlight2":
      "基于 SSE 做执行过程流式回传，提升可观测性与交互体验。",
    "projects.item.agentWorkflow.highlight3":
      "结合线程池实现并行执行引擎和上下文透传方案，保证多分支异步场景下的链路一致性。",
    "projects.item.bciVehicle.title": "基于 SSVEP 脑机接口的自动驾驶小车控制系统",
    "projects.item.bciVehicle.status": "获奖系统",
    "projects.item.bciVehicle.description":
      "这是一个把脑电信号识别、实时通信、状态控制和前端反馈连接起来的系统。我参与设计并实现通过 SSVEP 信号控制自动驾驶小车的完整链路。",
    "projects.item.bciVehicle.highlight1":
      "通过采集不同频率闪烁目标诱发的 SSVEP 信号识别用户意图，实现小车精确导航。",
    "projects.item.bciVehicle.highlight2":
      "使用 MQTT 完成小车与后端的实时通信，并通过 WebSocket 向前端推送状态信息。",
    "projects.item.bciVehicle.highlight3":
      "结合状态机与冗余过滤策略提高指令稳定性与系统容错能力，最终获得国家级竞赛二、三等奖。",

    "guestbook.eyebrow": "留言",
    "guestbook.title": "在这里留下一张便签。",
    "guestbook.lede":
      "想说的话、读后的回声、路过的问候，都可以留在这里。",
    "guestbook.commentsTitle": "留下便签",
    "guestbook.commentsDescription": "留言区由 GitHub Discussions 承载。",
    "comments.eyebrow": "留言",
    "comments.placeholderTitle": "留言板暂时休息中。",
    "comments.placeholderCopy": "等评论服务开启后，这里会出现留言入口。",

    "about.eyebrow": "这里住着谁？",
    "about.title": "在 Agent、系统和柔软观察之间建东西的人。",
    "about.p1":
      "我目前在广州大学攻读硕士学位，正在持续学习和研究 Agent 与移动安全。",
    "about.p2":
      "Blooming Logs 对我来说，不只是一个存放文章的博客，也不只是一个展示项目的页面。它更像一个长期使用的个人工作台。",
    "about.p3":
      "我会在这里记录自己对 Agent 系统、工作流执行、语音与多模态交互、系统状态管理、并发与上下文传递这些问题的理解，也会保留一些关于季节、声音、照片、窗口、海风和日常观察的内容。",
    "about.p4":
      "本科阶段，我主要围绕 Java 后端开发、系统设计和工程实践积累经验，也持续使用 AI 工具辅助开发与学习。我更在意的是一个系统能不能真正稳定地跑起来。",
    "about.p5":
      "我参与过物联网通信系统、脑机接口应用、自动驾驶控制、模拟经营游戏、AI Agent 工作流编排平台等项目与竞赛。它们背后都在回答相似的问题：复杂系统如何稳定执行，人与系统如何自然协作。",
    "about.p6":
      "在这些经历之外，我也一直在意写作本身。这里既会有 Lab 里的系统与实验，也会有 Notes 里的想法、Garden 里的缓慢观察、Frames 里的视觉片段。",
    "about.currentFocus": "当前方向",
    "about.currentFocusValue": "广州大学硕士在读",
    "about.focusLine": "研究方向：Agent / 移动安全",
    "about.technicalKeywords": "技术关键词",
    "about.selectedHonors": "部分荣誉",
    "about.honor1": "第20届全国大学生信息安全与对抗技术竞赛决赛 BCI 脑机接口应用赛道二等奖（国家级）",
    "about.honor2": "第20届全国大学生信息安全与对抗技术竞赛决赛 自动驾驶任务赛道三等奖（国家级）",
    "about.honor3": "第七届湖南省大学生物联网应用创新设计竞赛二等奖",
    "about.honor4": "湘潭市优秀毕业生，以及多项奖学金与学生骨干荣誉",
    "about.siteHolds": "这个站收纳什么",
    "about.siteHoldsLine":
      "Agent、系统、写作、声音、照片、缓慢观察，以及一个人长期在意的问题。",
    "about.contact": "联系",
    "about.phone": "Phone",
    "about.email": "Email",
    "about.github": "GitHub"
  },
  en: {
    "skip.content": "Skip to content",
    "language.switcherLabel": "Language",
    "language.zh": "中",
    "language.en": "EN",
    "site.tagline": "A white vinyl house by the sea, growing notes, noise, and sunflowers.",
    "brand.note": "white vinyl house by the sea",
    "nav.primary": "Primary navigation",
    "nav.home": "Home",
    "nav.logs": "Logs",
    "nav.collections": "Collections",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.guestbook": "Guestbook",
    "footer.logs": "Logs",
    "footer.collections": "Collections",
    "footer.about": "About",

    "home.hero.eyebrow": "Blooming Logs presents",
    "home.hero.copy":
      "A white vinyl house by the sea, growing notes, noise, and sunflowers. Step into Seaside Records to browse essays, projects, and daily fragments across the shelves.",
    "home.hero.random": "Play something random",
    "home.featured.eyebrow": "Curated for the front room",
    "home.featured.title": "Featured on the shelf",
    "home.featured.lede":
      "A few pieces that make good entrances into the sound of this site.",
    "home.recent.eyebrow": "Recently picked from the shelf",
    "home.recent.title": "What is blooming",
    "home.recent.lede":
      "New logs appear here with a little chronology and a little chance.",
    "home.collections.eyebrow": "Collections map",
    "home.collections.title": "Six shelves, six ways in.",
    "home.collections.lede":
      "Enter by theme: records, experiments, garden notes, scraps, frames, and drawers.",
    "home.about.eyebrow": "About the house",
    "home.about.title": "First the writing, then the glow.",
    "home.about.lede":
      "Blooming Logs is my personal blog and project showcase, gathering systems work, writing fragments, sound, photos, and slow observations.",
    "home.about.readyKicker": "Ready to read",
    "home.about.ready": "Logs, projects, collections, archive, and RSS",
    "home.about.nextKicker": "Growing next",
    "home.about.next":
      "A steadier writing rhythm, more real content, and more carefully tuned homepage interactions",

    "store.map.eyebrow": "Inside the store",
    "store.map.title": "Every shelf has its own path.",
    "store.map.lede":
      "Follow a mood into records, experiments, garden notes, scraps, frames, or the drawer.",
    "store.dialog.trigger": "Talk to the Seaside Records guide",
    "store.dialog.label": "Seaside Records guide",
    "store.dialog.line": "Welcome in. Which shelf should I open for you?",
    "store.dialog.aboutTitle": "About",
    "store.dialog.aboutDetail": "who keeps this seaside archive open",
    "store.door.enter": "Enter Seaside Records interior",
    "retro.terminal": "Seaside Records terminal",
    "retro.loading": "Loading",
    "retro.pressStart": "PRESS START",

    "collections.records.title": "Records",
    "collections.records.description": "music, albums, playlists, and sound notes",
    "collections.records.object": "record shelf",
    "collections.records.blurb": "notes that sound like summer",
    "collections.lab.title": "Lab",
    "collections.lab.description": "code, AI, experiments, and broken ideas",
    "collections.lab.object": "CRT workbench",
    "collections.lab.blurb": "where ideas break and bloom",
    "collections.garden.title": "Garden",
    "collections.garden.description": "sunflowers, seasons, soft observations",
    "collections.garden.object": "window plant",
    "collections.garden.blurb": "soft things I noticed",
    "collections.notes.title": "Notes",
    "collections.notes.description": "personal logs, fragments, and daily thoughts",
    "collections.notes.object": "desk notes",
    "collections.notes.blurb": "small scraps that still matter",
    "collections.frames.title": "Frames",
    "collections.frames.description": "film, photos, and visual fragments",
    "collections.frames.object": "photo wall",
    "collections.frames.blurb": "film, fragments, frozen light",
    "collections.drawer.title": "Drawer",
    "collections.drawer.description": "revisits, old papers, and rescued drafts",
    "collections.drawer.object": "drawer",
    "collections.drawer.blurb": "old paper, brought back out",
    "collections.count": "{count} logs",
    "collections.emptyCount": "seedling",
    "collections.latest": "Latest",
    "collections.enter": "Enter {title} →",

    "logs.eyebrow": "Logs",
    "logs.title": "All notes on the shelf.",
    "logs.lede":
      "Browse every published log by time, or step into one of the six collections.",
    "logs.archiveTag": "Open archive timeline",
    "archive.eyebrow": "Archive",
    "archive.title": "The whole house, by time.",
    "archive.lede":
      "This is the timeline for every published log. For themes, return to the six collections.",
    "collections.page.eyebrow": "Collections",
    "collections.page.title": "A small map of the house.",
    "collections.page.lede":
      "Enter by theme, or open the archive if you want everything by date.",
    "collections.page.archive": "Open archive timeline",
    "collection.empty.title": "This shelf is still being arranged.",
    "collection.empty.copy": "New logs will appear here once they are placed on this shelf.",

    "post.minRead": "{minutes} min read",
    "post.tags": "Tags",
    "post.back": "Back to Logs",
    "post.discussTitle": "Discuss this log",
    "post.discussDescription": "Comments sync to GitHub Discussions.",
    "post.navigation": "Post navigation",
    "post.newer": "Newer",
    "post.older": "Older",
    "post.noNewer": "Already at the newest log",
    "post.noOlder": "The drawer ends here",

    "projects.eyebrow": "Projects",
    "projects.title": "Public builds, selected systems, ongoing work.",
    "projects.lede":
      "This is not a chronological resume, but a set of projects worth opening, explaining, and continuing to refine.",
    "projects.github.eyebrow": "Open source",
    "projects.github.title": "Public repositories",
    "projects.github.lede":
      "These projects can be opened directly for code, status, and update history. Some cards include public GitHub information.",
    "projects.github.syncKicker": "Cards include",
    "projects.github.syncText": "Repo links, primary language, stars, and last updated time",
    "projects.github.manualKicker": "Notes preserve",
    "projects.github.manualText": "Why it exists, why it matters, and what it represents in my work",
    "projects.manual.eyebrow": "Selected work",
    "projects.manual.title": "Systems that need more than a repo link.",
    "projects.manual.lede":
      "Some projects need more background than a repository can provide. This section keeps the context, mechanisms, and system judgment visible.",
    "projects.manual.reasonKicker": "Why these stay manual",
    "projects.manual.reasonText": "Background, responsibility, and system tradeoffs matter more than the repository entry point.",
    "projects.manual.holdsKicker": "What this section holds",
    "projects.manual.holdsText": "Agent execution systems, real-time interaction paths, BCI work, and complex system collaboration",
    "projects.primaryLanguage": "Primary language: {language}",
    "projects.stars": "{count} stars",
    "projects.updatedPrefix": "Updated",
    "projects.updated": "Updated {date}",
    "projects.viewRepo": "View repo",
    "projects.openSite": "Open site",
    "projects.stack": "Stack",

    "projects.item.bloomingLogs.title": "Blooming Logs",
    "projects.item.bloomingLogs.status": "living project",
    "projects.item.bloomingLogs.description":
      "My personal blog and long-term writing space, used to organize agent work, writing, observations, and experiments.",
    "projects.item.bikeSystem.title": "Shared Bicycle Management System",
    "projects.item.bikeSystem.status": "competition build",
    "projects.item.bikeSystem.description":
      "A data-connected system for users, administrators, and devices, focused on device communication, status recognition, message retrying, and real-time visualization.",
    "projects.item.farmingGame.title": "Farming Simulation Game",
    "projects.item.farmingGame.status": "graduation project",
    "projects.item.farmingGame.description":
      "A Unity and C# 2D simulation game covering character control, planting, trading, NPC behavior, and extensible game systems.",
    "projects.item.agentWorkflow.title": "AI Agent Workflow Orchestration Platform",
    "projects.item.agentWorkflow.status": "selected work",
    "projects.item.agentWorkflow.description":
      "I worked mainly on the backend execution system, turning frontend DSL into executable flows and closing the loop around execution chains, node routing, parallel execution, and context passing.",
    "projects.item.agentWorkflow.highlight1":
      "Designed a unified node executor with variable management, timeout, retry, and support for LLM and plugin nodes.",
    "projects.item.agentWorkflow.highlight2":
      "Used SSE to stream execution progress back to the frontend and improve observability.",
    "projects.item.agentWorkflow.highlight3":
      "Built parallel execution and context passing with thread pools to keep multi-branch async flows consistent.",
    "projects.item.bciVehicle.title": "SSVEP BCI Autonomous Vehicle Control System",
    "projects.item.bciVehicle.status": "award-winning system",
    "projects.item.bciVehicle.description":
      "A system connecting EEG signal recognition, real-time communication, control state, and frontend feedback. I helped design and implement the full SSVEP-based vehicle control path.",
    "projects.item.bciVehicle.highlight1":
      "Recognized user intent from SSVEP signals induced by flickering targets at different frequencies for precise vehicle navigation.",
    "projects.item.bciVehicle.highlight2":
      "Used MQTT for real-time vehicle communication and WebSocket for frontend status updates.",
    "projects.item.bciVehicle.highlight3":
      "Improved command stability and fault tolerance with a state machine and redundant filtering, winning national second and third prizes.",

    "guestbook.eyebrow": "Guestbook",
    "guestbook.title": "Leave a small note here.",
    "guestbook.lede":
      "Messages, echoes after reading, and quiet hellos can all live here.",
    "guestbook.commentsTitle": "Leave a note",
    "guestbook.commentsDescription": "The guestbook is powered by GitHub Discussions.",
    "comments.eyebrow": "Comments",
    "comments.placeholderTitle": "The guestbook is resting for now.",
    "comments.placeholderCopy": "When comments are enabled, the note box will appear here.",

    "about.eyebrow": "Who lives here?",
    "about.title": "A builder between agents, systems, and soft observations.",
    "about.p1":
      "I am currently pursuing a master's degree at Guangzhou University, with ongoing focus on agents and mobile security.",
    "about.p2":
      "Blooming Logs is not only a place to store articles or showcase projects. It is closer to a long-term personal workbench.",
    "about.p3":
      "I use it to record what I learn about agent systems, workflow execution, voice and multimodal interaction, state management, concurrency, and context passing, while also keeping notes on seasons, sound, photos, windows, sea wind, and daily observation.",
    "about.p4":
      "During my undergraduate years, I built experience around Java backend development, system design, and engineering practice, and I keep using AI tools to support development and learning. What matters most to me is whether a system can run steadily in real use.",
    "about.p5":
      "I have worked on IoT communication systems, brain-computer interface applications, autonomous control, a farming simulation game, and an AI agent workflow orchestration platform. Under the surface, they ask similar questions: how complex systems execute reliably, and how people and systems collaborate naturally.",
    "about.p6":
      "Beyond those experiences, I care about writing itself. This site holds Lab experiments, Notes fragments, Garden observations, and Frames visual pieces together.",
    "about.currentFocus": "Current Focus",
    "about.currentFocusValue": "Graduate student at Guangzhou University",
    "about.focusLine": "Research focus: Agent / Mobile Security",
    "about.technicalKeywords": "Technical Keywords",
    "about.selectedHonors": "Selected Honors",
    "about.honor1":
      "Second Prize, BCI Brain-Computer Interface track, 20th National College Student Information Security and Confrontation Technology Competition finals",
    "about.honor2":
      "Third Prize, Autonomous Driving task track, 20th National College Student Information Security and Confrontation Technology Competition finals",
    "about.honor3":
      "Second Prize, 7th Hunan College Student IoT Application Innovation Design Competition",
    "about.honor4":
      "Outstanding Graduate of Xiangtan, with multiple scholarships and student leadership honors",
    "about.siteHolds": "What This Site Holds",
    "about.siteHoldsLine":
      "Agents, systems, writing, sound, photos, slow observation, and the questions I keep returning to.",
    "about.contact": "Contact",
    "about.phone": "Phone",
    "about.email": "Email",
    "about.github": "GitHub"
  }
};

export function getUiText(key: string, language: Language = DEFAULT_LANGUAGE) {
  return uiTranslations[language]?.[key] ?? uiTranslations.en[key] ?? key;
}
