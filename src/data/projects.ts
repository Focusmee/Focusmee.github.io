export type GitHubProjectConfig = {
  repo: string;
  title: string;
  status: string;
  description: string;
  stack: string;
  accent: string;
};

export type ManualProject = {
  title: string;
  status: string;
  period: string;
  accent: string;
  stack: string;
  description: string;
  highlights: string[];
};

export const githubProjects: GitHubProjectConfig[] = [
  {
    repo: "Focusmee.github.io",
    title: "Blooming Logs",
    status: "living project",
    description:
      "我的个人博客与长期写作空间。它既是内容系统，也是我整理 Agent、写作、观察与实验节奏的方式。",
    stack: "Astro, MDX, React",
    accent: "pink"
  },
  {
    repo: "iot-vehicle-management",
    title: "方正共享单车系统",
    status: "competition build",
    description:
      "面向用户端、管理员端与设备端的数据互通系统，重点在设备通信、状态识别、消息补发与实时数据可视化。",
    stack: "Java, Spring Boot, MQTT, MySQL, uCharts",
    accent: "leaf"
  },
  {
    repo: "Farming-Game",
    title: "模拟经营农场游戏",
    status: "graduation project",
    description:
      "基于 Unity 与 C# 的 2D 模拟经营游戏，围绕角色控制、种植、交易、NPC 行为与系统扩展性展开。",
    stack: "Unity, C#, A*, FSM, ScriptableObject",
    accent: "sunflower"
  }
];

export const manualProjects: ManualProject[] = [
  {
    title: "AI Agent 工作流编排平台",
    status: "selected work",
    period: "2026.02 - 2026.03",
    accent: "sky",
    stack: "Spring Boot, SSE, Thread Pool, Workflow Engine",
    description:
      "我主要参与后端执行系统的设计与实现，把前端 DSL 转换为可执行流程，并围绕执行链、节点路由、并行执行与上下文透传完成系统闭环。",
    highlights: [
      "设计统一节点执行器，封装变量管理、超时与重试机制，支持 LLM 与插件节点扩展。",
      "基于 SSE 做执行过程流式回传，提升可观测性与交互体验。",
      "结合线程池实现并行执行引擎和上下文透传方案，保证多分支异步场景下的链路一致性。"
    ]
  },
  {
    title: "基于 SSVEP 脑机接口的自动驾驶小车控制系统",
    status: "award-winning system",
    period: "2023.11 - 2023.12",
    accent: "orange",
    stack: "EEG, MQTT, WebSocket, State Machine",
    description:
      "这是一个把脑电信号识别、实时通信、状态控制和前端反馈连接起来的系统。我参与设计并实现通过 SSVEP 信号控制自动驾驶小车的完整链路。",
    highlights: [
      "通过采集不同频率闪烁目标诱发的 SSVEP 信号识别用户意图，实现小车精确导航。",
      "使用 MQTT 完成小车与后端的实时通信，并通过 WebSocket 向前端推送状态信息。",
      "结合状态机与冗余过滤策略提高指令稳定性与系统容错能力，最终获得国家级竞赛二、三等奖。"
    ]
  }
];
