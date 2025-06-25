# MCP 和 Function Call

## 困惑

1. 有哪些模型支持MCP？
2. 只有支持函数调用的模型才能使用MCP吗？
3. MCP能脱离LLM调用吗？

## 概念

- MCP是**协议**，是一套标准
- Function Call / Tool Call是模型的基本**能力**，可以返回格式化工具调用的能力

## 从调用流程角度



![image-20250412164919679](C:\Users\Jinju\AppData\Roaming\Typora\typora-user-images\image-20250412164919679.png)



是否使用MCP的区别发生在FunctionCall完成后

![image-20250414170310829](C:\Users\Jinju\blog\source\images\image-20250414170310829.png)

## 从开发者角度

- **无MCP**
  - Host作者制定工具的开发规范 (LobeChat / LibreChat)
  - 开发者根据规范给某一个Host开发工具
  - 不同Host之间插件生态不互通
- **有MCP**
  - Host作者根据MCP Client Spec开发客户端
  - 工具作者根据MCP Server Sepc开发工具服务端
  - 打通插件/工具生态

## 更多

MCP的能力不止调用工具

[MCP文档](https://modelcontextprotocol.io/introduction)



## 总结

Mcp只是LLM调用外部工具的一种协议

Function call是模型的能力它会以json的方式描述调用外部工具的参数和外部工具的名称







✅ 如何从零开始设置MCP服务器 ✅ 使用API获取实时天气数据 ✅ 将MCP服务器连接到Claude for Desktop ✅ 理解MCP如何使AI与外部数据互动 ✅ 实践演示以实现无缝集成