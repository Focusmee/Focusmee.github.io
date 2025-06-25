# 【Unity学习】Unity开发规范

# Unity操作指南

## 基础操作规范

### 1. 场景操作
- 创建新场景：
  1. 在Project窗口中右键 → Create → Scene
  2. 将新场景保存到 `Assets/Scenes` 目录下
  3. 在Build Settings中添加场景（File → Build Settings）

### 2. 预制体(Prefab)操作
- 创建预制体：
  1. 在Hierarchy窗口中创建/设计好游戏对象
  2. 将对象拖拽到Project窗口的 `Assets/Prefabs` 目录中
  3. 预制体会显示为蓝色，表示创建成功

### 3. 脚本添加
- 添加新脚本：
  1. 在Project窗口中右键 → Create → C# Script
  2. 将脚本保存到对应的 `Assets/Script/[模块名]` 目录下
  3. 将脚本拖拽到Hierarchy中的目标游戏对象上
  4. 在Inspector中设置脚本的公共变量

### 4. 组件操作
- 添加组件：
  1. 选中游戏对象
  2. 在Inspector窗口点击"Add Component"
  3. 搜索并选择需要的组件
  4. 在Inspector中配置组件参数

## 常见功能实现指南

### 1. 角色移动功能
```csharp
// 在 Assets/Script/Player/PlayerMovement.cs 中实现
public class PlayerMovement : MonoBehaviour
{
    public float moveSpeed = 5f;
    private Rigidbody2D rb;

    void Start()
    {
        // 获取刚体组件
        rb = GetComponent<Rigidbody2D>();
    }
}
```
实现步骤：
1. 创建角色游戏对象（Hierarchy → 2D Object → Sprite）
2. 添加Rigidbody2D组件（Inspector → Add Component → Rigidbody2D）
3. 添加Collider2D组件（Inspector → Add Component → Box Collider 2D）
4. 创建并添加移动脚本
5. 在Inspector中设置moveSpeed值

### 2. 动画系统设置
实现步骤：
1. 创建动画文件夹：`Assets/Animations/[角色名]`
2. 导入精灵图：
   - 将图片文件放入 `Assets/Sprites` 目录
   - 选择图片，在Inspector中设置：
     - Texture Type: Sprite (2D and UI)
     - Sprite Mode: Multiple (如果是精灵图集)
3. 创建动画器：
   - 选中角色，添加Animator组件
   - 在Project窗口创建Animator Controller
   - 将Controller拖拽到角色的Animator组件上

### 3. UI系统实现
实现步骤：
1. 创建Canvas：
   - Hierarchy → UI → Canvas
   - 确保有EventSystem
2. 添加UI元素：
   - 在Canvas下右键 → UI → 选择需要的UI元素
3. 创建UI脚本：
   - 在 `Assets/Script/UI` 目录下创建脚本
   - 将脚本挂载到对应UI元素上

### 4. 场景切换
实现步骤：
1. 确保所有场景都在Build Settings中
2. 创建切换脚本：
```csharp
// 在 Assets/Script/Transition/SceneLoader.cs 中实现
public class SceneLoader : MonoBehaviour
{
    public void LoadScene(string sceneName)
    {
        SceneManager.LoadScene(sceneName);
    }
}
```
3. 在UI按钮上添加点击事件：
   - 选择按钮
   - 在Inspector中找到Button组件
   - 点击 "+" 添加OnClick事件
   - 拖拽包含SceneLoader脚本的对象
   - 选择LoadScene函数

## 调试技巧
1. 使用Debug.Log()输出信息：
   - 在Console窗口查看输出
   - 使用不同颜色区分日志级别：
     ```csharp
     Debug.Log("普通信息");
     Debug.LogWarning("警告信息");
     Debug.LogError("错误信息");
     ```
2. 使用Scene视图工具：
   - 使用Gizmos可视化碰撞器和路径
   - 使用Scene窗口顶部的2D/3D切换按钮

## 性能优化建议
1. 使用对象池而不是频繁创建销毁对象
2. 合理使用协程(Coroutine)处理延时任务
3. 避免在Update中进行复杂计算

请在开发时参考此指南，确保按步骤实现功能。如有疑问，可以查看Unity官方文档或咨询有经验的开发者。