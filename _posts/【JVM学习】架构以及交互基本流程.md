我将使用两种方式来展示JVM的主要架构：目录结构和Mermaid图。

1. **目录结构形式**：
```
JVM架构
├── 类加载子系统 (Class Loading Subsystem)
│   ├── 加载 (Loading)
│   │   ├── Bootstrap ClassLoader
│   │   ├── Extension ClassLoader
│   │   └── Application ClassLoader
│   ├── 链接 (Linking)
│   │   ├── 验证 (Verification)
│   │   ├── 准备 (Preparation)
│   │   └── 解析 (Resolution)
│   └── 初始化 (Initialization)
│
├── 运行时数据区 (Runtime Data Areas)
│   ├── 方法区 (Method Area) - 线程共享
│   │   ├── 类信息
│   │   ├── 常量
│   │   ├── 静态变量
│   │   └── JIT编译代码
│   ├── 堆区 (Heap) - 线程共享
│   │   ├── 新生代 (Young Generation)
│   │   │   ├── Eden区
│   │   │   ├── Survivor 0
│   │   │   └── Survivor 1
│   │   └── 老年代 (Old Generation)
│   ├── 栈区 (Stack) - 线程私有
│   │   └── 栈帧 (Stack Frame)
│   │       ├── 局部变量表
│   │       ├── 操作数栈
│   │       ├── 动态链接
│   │       └── 返回地址
│   ├── 程序计数器 (PC Register) - 线程私有
│   └── 本地方法栈 (Native Method Stack) - 线程私有
│
├── 执行引擎 (Execution Engine)
│   ├── 解释器 (Interpreter)
│   ├── JIT编译器 (JIT Compiler)
│   │   ├── 中间代码生成器
│   │   ├── 代码优化器
│   │   └── 目标代码生成器
│   └── 垃圾回收器 (Garbage Collector)
│       ├── Serial GC
│       ├── Parallel GC
│       ├── CMS GC
│       └── G1 GC
│
└── 本地方法接口 (Native Method Interface)
    └── 本地方法库 (Native Method Libraries)
```

2. **Mermaid图形式**：
```mermaid
graph TB
    JVM[JVM架构]
    
    %% 类加载子系统
    CLS[类加载子系统]
    L[加载]
    LK[链接]
    I[初始化]
    
    %% 运行时数据区
    RDA[运行时数据区]
    MA[方法区]
    HP[堆]
    STK[栈]
    PC[程序计数器]
    NMS[本地方法栈]
    
    %% 执行引擎
    EE[执行引擎]
    INT[解释器]
    JIT[JIT编译器]
    GC[垃圾回收器]
    
    %% 本地方法接口
    NMI[本地方法接口]
    NML[本地方法库]
    
    %% 连接关系
    JVM --> CLS
    JVM --> RDA
    JVM --> EE
    JVM --> NMI
    
    %% 类加载子系统详细
    CLS --> L
    CLS --> LK
    CLS --> I
    L --> BCL[Bootstrap ClassLoader]
    L --> ECL[Extension ClassLoader]
    L --> ACL[Application ClassLoader]
    LK --> V[验证]
    LK --> P[准备]
    LK --> R[解析]
    
    %% 运行时数据区详细
    RDA --> MA
    RDA --> HP
    RDA --> STK
    RDA --> PC
    RDA --> NMS
    
    HP --> YG[新生代]
    HP --> OG[老年代]
    YG --> Eden
    YG --> S0[Survivor 0]
    YG --> S1[Survivor 1]
    
    STK --> SF[栈帧]
    SF --> LVT[局部变量表]
    SF --> OS[操作数栈]
    SF --> DL[动态链接]
    SF --> RA[返回地址]
    
    %% 执行引擎详细
    EE --> INT
    EE --> JIT
    EE --> GC
    
    JIT --> ICG[中间代码生成器]
    JIT --> CO[代码优化器]
    JIT --> TCG[目标代码生成器]
    
    GC --> SGC[Serial GC]
    GC --> PGC[Parallel GC]
    GC --> CMS[CMS GC]
    GC --> G1[G1 GC]
    
    %% 本地方法接口详细
    NMI --> NML
```

3. **主要组件之间的交互流程**：

1. **类的生命周期**：
   - 源代码(.java) -> 字节码(.class) -> 类加载 -> 链接 -> 初始化 -> 使用 -> 卸载

2. **方法调用流程**：
   - 代码定位 -> 常量池查找 -> 方法区获取信息 -> 创建栈帧 -> 执行字节码

3. **内存管理流程**：
   - 对象创建 -> 新生代分配 -> 垃圾回收 -> 对象晋升 -> 老年代回收

4. **代码执行优化**：
   - 解释执行 -> 热点检测 -> JIT编译 -> 本地代码执行

这个架构展示了JVM的四个主要组件：
1. **类加载子系统**：负责加载、链接和初始化类
2. **运行时数据区**：管理JVM的内存结构
3. **执行引擎**：负责执行字节码和优化
4. **本地方法接口**：处理与本地代码的交互

每个组件都有其特定的职责，它们协同工作确保Java程序能够正确、高效地运行。这种模块化的设计使得JVM能够在不同平台上提供一致的执行环境，同时也便于优化和维护。