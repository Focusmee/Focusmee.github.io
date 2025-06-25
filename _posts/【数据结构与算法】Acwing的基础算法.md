---
title:Acwing的基础算法
---

![image-20231227203029359](D:\typora笔记\基础算法.assets\image-20231227203029359.png)



#### 快速排序

```c++
void quick_sort(int q[], int l, int r)
{
    if (l >= r) return;

    int i = l - 1, j = r + 1, x = q[l + r >> 1];
    while (i < j)
    {
        do i ++ ; while (q[i] < x);
        do j -- ; while (q[j] > x);
        if (i < j) swap(q[i], q[j]);
    }
    quick_sort(q, l, j), quick_sort(q, j + 1, r);
}
```

注意一下边界问题

[(48条消息) 【算法学习笔记】8：快速排序中的边界问题_LauZyHou的博客-CSDN博客_快速排序边界问题](https://blog.csdn.net/SHU15121856/article/details/109839618)



#### 高精度乘法

t=0;

循环到A.size()||t

本位 C~n~=（A[n]*B+t~n-1~）%10

给下一位进位 t~n+1~=（A[n]*B）/10

#### 前缀和与差分

前缀和是输出原序列中从第 l个数到第 r个数的和（求出某个区间的和）

差分是将序列中某个区间 `[l,r] `之间的每个数加上一个数。

​	差分关键：

```
void insert(int l,int r,int c){
    a[l]+=c;
    a[r+1]-=c;
}
```

先把每个数字放进去，使得数组a的每个前缀和仍为0

后在插入区间内求出前缀和就完成在区间加上一个数

#### 二进制算法

1. 第n位是1还是0 x>>n&1

2. 取得末端第一个是1以及后面的位

   例子：比如 5 101 得到的是1 8 1000 得到的是1000

   lowbit就是x&-x -x为~x+1（-x为x取反然后+1）

   可以通过lowbit知道数字二进制形式有多少个1

#### 单链表：

一般用邻接表 存储树和图

#### 双链表：

优化某些问题 e[N]表示某个值 ne[N]表示某个点的next指针 通过下标关联起来 空结点ne用-1表示

#### 栈：

```
// tt表示栈顶
int stk[N], tt = 0;

// 向栈顶插入一个数
stk[ ++ tt] = x;

// 从栈顶弹出一个数
tt -- ;

// 栈顶的值
stk[tt];

// 判断栈是否为空
if (tt > 0)
{

}
```

#### 普通队列：

```
// hh 表示队头，tt表示队尾
int q[N], hh = 0, tt = -1;

// 向队尾插入一个数
q[ ++ tt] = x;

// 从队头弹出一个数
hh ++ ;

// 队头的值
q[hh];

// 判断队列是否为空
if (hh <= tt)
{

}
```

#### 循环队列：

```
// hh 表示队头，tt表示队尾的后一个位置
int q[N], hh = 0, tt = 0;

// 向队尾插入一个数
q[tt ++ ] = x;
if (tt == N) tt = 0;

// 从队头弹出一个数
hh ++ ;
if (hh == N) hh = 0;

// 队头的值
q[hh];

// 判断队列是否为空
if (hh != tt)
{

}
```

#### 单调栈：

```
常见模型：找出每个数左边离它最近的比它大/小的数
int tt = 0;
for (int i = 1; i <= n; i ++ )
{
    while (tt && check(stk[tt], i)) tt -- ;
    stk[ ++ tt] = i;
}
```

#### 单调队列：

1. 用普通队列该怎么做
2. 将队列中的没有用的元素删掉->具有了单调性
3. 可以用O(1)时间从队头/队尾取出最值

```
if (i - k + 1 > q[hh]) ++ hh;                  // 若队首出窗口，hh加1
while (hh <= tt && a[i] <= a[q[tt]]) -- tt;    // 若队尾不单调，tt减1，保证了队头为最小
q[++ tt] = i;                                  // 下标加到队尾，这个元素在后面左窗口缩小的时候可能会成为窗口最凶安置
if (i + 1 >= k) printf("%d ", a[q[hh]]);       // 输出结果
```

![image-20230603224710262](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230603224710262.png)

![image-20230603224827020](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230603224827020.png)

```
常见模型：找出滑动窗口中的最大值/最小值
int hh = 0, tt = -1;
for (int i = 0; i < n; i ++ )
{
    while (hh <= tt && check_out(q[hh])) hh ++ ;  // 判断队头是否滑出窗口
    while (hh <= tt && check(q[tt], i)) tt -- ;
    q[ ++ tt] = i;
}
```

#### KMP算法

i和j比较，同则next[i]=++j

不同则j看前一个next跳转到新的位置再进行i和j比较

字符串的next数组：

```
for(int i=1,j=0;i<n;i++)
    {
        while(j&&a[i]!=a[j])
        {
            j=next[j-1];
        }
        if(a[i]==a[j])
        {
            next[i]=j+1;
            j++;
        }
        if(j==0) next[i]=0,j++;
    }
```

对比模式串：

```
for(int i=0,j=0;i<=m;i++)
    {
          while(j&&a[j]!=b[i]) j=next[j-1];
          if(b[i]==a[j]) 
          {
              j++;
          }
          if(j==n)
          {
              j=next[j-1];
              printf("%d ",i-n+1);
          }
 }
```

#### Tire树

需要变量：`int son[N][26],cnt[N],id`

高效地存储和查找字符串

集合的数据结构

每一个出现的结点都会有唯一一个编号idx（也即rxc说的指针）
不是按层数来编的，是按出现的先后顺序编的

idx是先把idx自增1再赋值给`son[p][u]`，而idx是先自增1再赋值给`son[p][u]`，二者的区别在于，习惯于根节点的编号为0，而存储每一个单词下标是从1开始的，idx++相当于第一个值赋值给了根节点，理解一下这里

```
int son[N][26], cnt[N], idx;
// 0号点既是根节点，又是空节点
// son[][]存储树中每个节点的子节点
// cnt[]存储以每个节点结尾的单词数量

// 插入一个字符串
void insert(char *str)
{
    int p = 0;
    for (int i = 0; str[i]; i ++ )
    {
        int u = str[i] - 'a';
        if (!son[p][u]) son[p][u] = ++ idx;
        p = son[p][u];
    }
    cnt[p] ++ ;
}

// 查询字符串出现的次数
int query(char *str)
{
    int p = 0;
    for (int i = 0; str[i]; i ++ )
    {
        int u = str[i] - 'a';
        if (!son[p][u]) return 0;
        p = son[p][u];
    }
    return cnt[p];
}
```

```
#include<iostream>
#include<string.h>
using namespace std;
const int N = 100010;
int son[N][26],cnt[N],idx;//son[p][u]表示该串下一个字母的位置，cnt负责标记，表示这个树的路径（字符串）的次数
void insert(char* s)
{
    int p=0;
    for(int i=0;s[i];i++)
    {
        int u=s[i]-'a';
        if(!son[p][u]) son[p][u]=++idx;
        //son[p][u]=idx就是把下一个结点的位置存在当前的son[p][u]里,if就是判断是否这个结点有孩子
        //比如之前插入了abc，再插入ab的时候就会判断，如果有就不需要继续插入了，就直接顺延
        p=son[p][u];
    }
    cnt[p]++;
}
int query(char* s)
{
    int p=0;
    for(int i=0;s[i];i++)
    {
        int u=s[i]-'a';
        if(!son[p][u]) return 0;
        p=son[p][u];
    }
    return cnt[p];
}
int main()
{
    int n;
    char op[2];
    char s[N];
    scanf("%d",&n);
    for(int i=0;i<n;i++)
    {
        scanf("%s%s",op,s);

        if(op[0]=='I')
        {
            insert(s);
        }
        if(op[0]=='Q')
        {t
            printf("%d\n",query(s));
        }
    }
    
}
```



#### 并查集：

[AcWing 836. 基础_并查集_合并集合java_python_c++ - AcWing](https://www.acwing.com/solution/content/33345/)

```
int find(int x)
    {
        if(p[x]==x) return x;
        return p[x]=find(p[x]);
    }
```

**合并**

把一个集合的根指向另一个集合的根

```
void unionset(int x,int y){

fa[find(x)]=find(y);

}
```

**按秩合并（启发式合并）**

实际一般用不到，因为路径压缩已经做的够优秀了



把小集合的根指向大集合的根

```
//记录并初始化子树的大小为1
vector<int>siz(N,1);
void unionset(int x,int y){
	x=find(x),y=find(y);
	if(x==y) return;
	if(siz[x]>siz[y]) swap(x,y);
	fa[x]=y;
	siz[y]+=siz[x];
}
```



p[N] 中 每一个··节点表示当前节点所指向的父节点

快速支持以下操作

1. 将两个集合合并
2. 询问两个元素是否在一个集合当中

基本原理：每个集合用一棵树来表示。树根的编号就是整个集合的编号。每个结点存储它的父节点，p[x]表示x的父节点

问题1：如何判断树根：`if(p[x]==x)`

问题2：如何求x的集合编号：`while(p[x]!=x) x=p[x];`

问题3：如何合并两个集合：px是x的集合编号，py是y的集合编号，`p[x]=y`

并查集优化：遍历过一次每个结点直接指向根节点 路径压缩

#### 堆：

需要的变量：`h[N],size`

1. 插入一个数

2. 求集合当中的最小值

3. 删除最小值

4. 删除任意一个元素

5. 修改任意一个元素

   ![image-20221112173131690](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20221112173131690.png)

满足完全二叉树

1. 小根堆：每一个点是小于它左右两边的最小值

2. 存储：一维数组来存 

#### 哈希表

##### 一般哈希：

![image-20230221224809070](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230221224809070.png)

```
(1) 拉链法
    int h[N], e[N], ne[N], idx;//h[i]存的链表头结点下标,e[i]存的是链表的值，ne[i]是e[i]结点下一个结点的位置，idx是最新可用的点的下标
//head始终是头结点的下标，

    // 向哈希表中插入一个数
    void insert(int x)
    {
        int k = (x % N + N) % N;//jiang
        e[idx] = x;
        ne[idx] = h[k];
        h[k] = idx ++ ;
    }

    // 在哈希表中查询某个数是否存在
    bool find(int x)
    {
        int k = (x % N + N) % N;
        for (int i = h[k]; i != -1; i = ne[i])
            if (e[i] == x)
                return true;

        return false;
    }

(2) 开放寻址法
    int h[N];

    // 如果x在哈希表中，返回x的下标；如果x不在哈希表中，返回x应该插入的位置
    int find(int x)
    {
        int t = (x % N + N) % N;
        while (h[t] != null && h[t] != x)//如果这个坑位有人且不是要找的人，找下个坑位，不会死循环是因为开的空间是数据的两倍
        {
            t ++ ;
            if (t == N) t = 0;
        }
        return t;
    }

```

##### 字符串哈希

判断串里是否有一段串跟另一段串一样

进制：131

需要：`h[N],x[N]`

需要BKDR_hash和geth_hash

```
#include<iostream>
using namespace std;
typedef unsigned long long ULL;
const int X = 131;
const int N = 100010;
char s[N];
ULL h[N], x[N];
void BKDR_hash(string s)
{
    h[0] = s[0];
    x[0] = 1;
    for(int i = 1 ; i < s.size() ; i++)
    {
        h[i] = h[i - 1]*X + s[i];
        x[i] = x[i - 1]*X;
    }
}
ULL get_hash(int left,int right)
{
    return left?h[right]-h[left-1]*x[right-left+1]:h[right];
}
int main()
{
    int n,m;
    int l1,r1,l2,r2;
    scanf("%d%d",&n,&m);
    scanf("%s",s);
    BKDR_hash(s);
    for(int i=0;i<m;i++)
    {
        scanf("%d%d%d%d",&l1,&r1,&l2,&r2);
        if(get_hash(l1-1,r1-1)==get_hash(l2-1,r2-1)) printf("Yes\n");
        else printf("No\n");
    }
}
```

[Trie树和字符串哈希都是用于快速检索的数据结构。Trie树典型应用于快速检索（最长前缀匹配），统计，排序和保存大量的字符串，所以经常被搜索引擎系统用于文本词频统计，搜索提示等场景。它的优点是最大限度地减少无谓的字符串比较，查询效率比较高。Trie树的核心思想是空间换时间，利用字符串的公共前缀来降低查询时间的开销以达到提高效率的目的](https://blog.csdn.net/hyman_yx/article/details/54410619)[1](https://blog.csdn.net/hyman_yx/article/details/54410619)。

[而哈希表则是一种理想情况下不需要任何比较就能一次存取得到所查记录的数据结构。它通过在记录存储位置和关键字之间建立一个确定对应关系f来实现这一点，使每个关键字和一个唯一存储位置相对应。因此，在查找时只需根据这个对应关系f找到给定值K的像f(K)，不需要进行比较便可直接取得所查记录](https://developer.aliyun.com/article/59584)[2](https://developer.aliyun.com/article/59584)。

[Trie树典型应用于快速检索（最长前缀匹配），统计，排序和保存大量的字符串，所以经常被搜索引擎系统用于文本词频统计，搜索提示等场景](https://blog.csdn.net/hyman_yx/article/details/54410619)[1](https://blog.csdn.net/hyman_yx/article/details/54410619)。哈希表则可以用于快速查找和存储数据。

例如，在一个字典中查找一个单词是否存在，可以使用Trie树来实现。而在一个数据库中查找某个记录，则可以使用哈希表来实现。

总之，在处理大量字符串且需要最长前缀匹配时使用Trie树可能更合适；而在其他情况下使用哈希表可能更合适。

#### 图论

邻接表存储树和图分析

idx表示边的索引；
e[] 表示idx条边的结束节点是什么；
ne[] 表示idx条边的同起点的下一条边的idx；
h[] 表示节点索引；



```c++
idx = 0;
for(int i=0;i<n;++i)
{
h[i] = -1;
}

void add(int a, int b)
{
    e[idx] = b;
    ne[idx] = h[a];
    h[a] = idx;
    idx++;
}
```

注意： idx代表的是边的索引，h[a]返回起点为a的节点出去的第一条边的idx；
用e[idx]取出终点，当ne[idx] ！= -1 时，一直用ne去边，用e取终点节点。



拓扑、dfs、并查集都可以图中判断有没有环， floyd可以找最小环

1.DFS：递归结束条件的选择+状态标记+递归后的恢复
2.BFS：模拟队列 q[N], d[N] 使用d数组标记状态
3.搜索：解空间的搜索往往需要dfs+剪枝，bfs用来找最短路
4.树和图的存储：邻接表 h[N], e[N], ne[N], idx
5.树和图的遍历：遍历不用像搜索解空间一样递归后恢复，只用遍历一次即可

##### 思维导图

<img src="D:\typora笔记\基础算法.assets\image-20240717104327472.png" alt="image-20240717104327472" style="zoom:50%;" />

<img src="D:\typora笔记\基础算法.assets\image-20240717104924144.png" alt="image-20240717104924144" style="zoom:50%;" />

##### Dijkstra算法

记忆：外面集合的点与里面集合的点最短的距离

稠密图 外循环每次选择一条路径，先找到离起始点（这里为1）最近的点，内循环1.for循环找到没选入路径里离起始点最近的点 2.找到后通过这个点对其他点距离更新，把新的点标记表示选上了

用堆优化，散列表。稀疏图

```
#include<iostream>
#include<string.h>
#include<stdlib.h>
#include <algorithm>
using namespace std;
const int N = 510;
int n, m;
int g[N][N];//稠密图运用矩阵存储
int dist[N];//dist[i]表示i点到起点的距离
bool st[N];//存已找到最短路径的点
int dijkstra()
{
    memset(dist,0x3f,sizeof(dist));//初始化距离
    dist[1]=0;//***一定记得初始化，起点到起点的距离为0
    for(int i=1;i<n;i++)//每次要选择一条路径，最短路径至少需要n-1条，故1~n-1
    {
        int t=-1;//找到离起始点（这里为1）最近的点
        for(int j=1;j<=n;j++)//把每个点遍历一边找到可以选择的点
        {
           if(!st[j]&&(t==-1||dist[t]>dist[j]))//如果这个点没连上且还没开始选或者此时的点比t点离起点更近，更新
                t=j;
        }

        for(int j=1;j<=n;j++)//通过新的点进行节点距离更新
        {
            dist[j]=min(dist[j],dist[t]+g[t][j]);
        }
        st[t]=true;//把新加的点连上

    }
    if(dist[n]==0x3f3f3f3f) return -1;//如果这个点跟起点的距离仍是0x3f3f3f3f说明到不了n点
    return dist[n];
}
int main()
{
    int x,y,z;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=n;j++)
        {
            if(i==j) g[i][j]=0;
            else g[i][j]=0x3f3f3f3f;
        }
    }
    for(int i=0;i<m;i++)
    {
        scanf("%d%d%d",&x,&y,&z);
        g[x][y]=min(g[x][y],z);//重边把最小的权值换上
    }

    printf("%d",dijkstra());

}
```



##### bellman_ford算法

1. 可以限制经过边数

2. 需要

   ```
   sturct Edge{
   
   int a,b,c;//a为边起点，b为边终点，c为边的权
   
   }edges[M],dist[N],last[N]//需要每次外循环备份dist 记得dist和dist[1]要初始化
   ```

3. 内层循环是将每条边进行更新

   两层循环 外层经历边数，

   内层为auto `e=edge[j];`

   `dist[e.b]=min(dist[e.b],dist[e.a]+e.c);`

4. 备份原因：防止串联[(46条消息) Bellman-ford算法详解_真的没事鸭的博客-CSDN博客](https://blog.csdn.net/qq_52905520/article/details/126453516)

##### spfa（稀疏图）

用队列（或者数组来进行优化）优化bellman_ford

因为bellman_ford算法如果dist[e.a]都没变小就没必要更新

注意：一定要求题目中不能有负环，所以可以利用这个性质判断是否有负环

需要变量：

```
int h[N], w[N], e[N], ne[N], idx;//用邻接表来存储
int dist[N];//存距离 记得dist和dist[1]要初始化
bool st[N];//判断是否在队列存在
queue<int> q;//队列里存的是节点号
cnt[N];//可以维护判断是否有负环
```

<img src="C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20221121222707991.png" alt="image-20221121222707991" style="zoom:67%;" />

spfa判断是否有负环通过cnt来记录，如果cnt[j]>=n则说明有负环

注意要全部入队，因为1并不一定能到负环。

因为本质上spfa算法是对bellman_ford算法的优化，而**bellman-ford算法遍历k次求出的是从源点经过不超过k条边走到任一点的最短距离**，若两点之间的距离在第n-1次更新后还能更新，不就说明两点之间存在超过n-1条边的最短路了么，那不就是说说存在负环吗。

##### Floyd

需要变量

```
int d[N][N];//注意初始化
d[i][j]=min(d[i][j],d[i][k]+d[k][j]);
```

##### Prim

![image-20230225214324918](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230225214324918.png)

朴素Prim（稠密图）

初始：所有点到集合的距离为正无穷

没选起始点，迭代n次

dist[i] <- 正无穷

```
for(int i=0;i<n;i++)
{
	t<-找到集合外距离最近的点//第一次可以随便选
	用t更新其他点到集合的距离
	st[t]=true;
}
```

堆优化Prim

##### 克鲁斯卡尔算法（稀疏图)

需要变量：struct edge 因为只需要保存边的

算法思路： 先把所有边按权值排序，然后根据并查集找到集合没有的点且该边为所有边最小的边后加入集合，统计集合中点的数量，如果边的数量小于n-1说明没有联通，否则就输出最小生成树的权值

##### 染色法

判断是否是二分图的算法，通过dfs染色

注意无向图add的时候

```
bool dfs(int u, int color) {
    st[u] = color;

    for(int i = h[u]; i != -1; i = ne[i]){
        int j = e[i];
        if(!st[j]) {
            if(!dfs(j, 3 - color)) return false;
        }else if(st[j] == color) return false;
    }

    return true;
}
```

主函数注意每个点如果没染色都染色

```
 bool flag = true;
    for(int i = 1; i <= n; i ++){
        if(!st[i]){
            if(!dfs(i, 1)){
                flag = false;
                break;
            }
        }
    }
```



##### 匈牙利算法

```
#include <cstring>
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 510, M = 100010;

int n1, n2, m;
int h[N], e[M], ne[M], idx;
int match[N];  // match[i]：女生i的对象
bool query[N];  // bool st[N];  // 男生是否询问过女生

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx ++ ;
}

int find(int x) {
    for (int i = h[x]; i != -1; i = ne[i]) {  // 遍历男生x的所有可联系女生
        int j = e[i];  // 女生的编号j
        if (!query[j]) {  // 如果没询问过
            query[j] = true;  // 标记为询问，然后去问她
            if (!match[j] || find(match[j])){  // 如果女生j没有对象，或者女生j的对象match[j]可以再找一个。  // highlight：query的作用就在这里，递归产生的find栈不会再去询问match[j]自己的对象j
                match[j] = x;  // 那女生j把男生x作为对象
                return true;  // 男生x成功找到对象（在未询问女生中）
            }
        }
    }

    return false;  // 男生x没找着对象（在未询问女生中）
}

int main() {
    memset(h, -1, sizeof h);

    scanf("%d%d%d", &n1, &n2, &m);

    for (int i = 0; i < m; i ++ ) {
        int a, b;
        scanf("%d%d", &a, &b);
        add(a, b);
    }

    int res = 0;
    for (int i = 1; i <= n1; i ++ ) {
        memset(query, false, sizeof query);  // 重复使用query，每个男生最初都没有询问过女生
        if (find(i)) res ++ ;
    }

    printf("%d\n", res);

    return 0;
}

```



#### 数学知识

筛质数 埃式筛法 线性筛法

从小到大枚举每个数

如果当前数没划掉，必定是质数，记录该质数，枚举当前质数的倍数，必定是合数，划掉合数。

![image-20230106164833221](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230106164833221.png)

![image-20230106181915190](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230106181915190.png)
```
6.2:埃氏筛(稍加优化版的筛法).
(1).质数定理:1~n中有n/lnn个质数.
(2).原理:在朴素筛法的过程中只用质数项去筛.
(3).时间复杂度:粗略估计:O(n).实际:O(nlog(logn)).
(4).1~n中,只计算质数项的话,”1/2+1/3+1/4+1/5+…+1/n”的大小约为log(logn).
6.3:线性筛
(1).若n在10的6次方的话,线性筛和埃氏筛的时间效率差不多,若n在10的7次方的话,线性筛会比埃氏筛快了大概一倍.
(2).思考:一:线性筛法为什么是线性的?
二:线性筛法的原理是什么?
(3).核心:1~n内的合数p只会被其最小质因子筛掉.
(4).原理:1~n之内的任何一个合数一定会被筛掉,而且筛的时候只用最小质因子来筛,
然后每一个数都只有一个最小质因子,因此每个数都只会被筛一次,因此线性筛法是线性的.
(5).枚举到i的最小质因子的时候就会停下来,即”if(i%primes[j]==0) break;”.
(6).因为从小到大枚举的所有质数,所以当”i%primes[j]!=0”时,primes[j]一定小于i的最小质因子,
primes[j]一定是primes[j]i的最小质因子.
(7).因为是从小到大枚举的所有质数,所以当”i%primes[j]==0”时,primes[j]一定是i的最小质因子,
而primes[j]又是primes[j]的最小质因子,因此primes[j]是iprimes[j]的最小质因子.
(8).关于for循环的解释:
注:首先要把握住一个重点:我们枚举的时候是从小到大枚举的所有质数
1.当i%primes[j]==0时,因为是从小到大枚举的所有质数,所以primes[j]就是i的最小质因子,而primes[j]又是其本身
primes[j]的最小质因子,因此当i%primes[j]==0时,primes[j]是primes[j]i的最小质因子.
2.当i%primes[j]!=0时,因为是从小到大枚举的所有质数,且此时并没有出现过有质数满足i%primes[j]==0,
因此此时的primes[j]一定小于i的最小质因子,而primes[j]又是其本身primes[j]的最小质因子,
所以当i%primes[j]!=0时,primes[j]也是primes[j]*i的最小质因子.
3.综合1,2得知,在内层for循环里面无论何时,primes[j]都是primes[j]i的最小质因子,因此”st[primes[j]*i]=true”
语句就是用primes[j]i这个数的最小质因子来筛掉这个数.
```


分解质因数 唯一分解定理 试除法

![image-20230107103929896](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230107103929896.png)

 ![image-20230111105948906](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20230111105948906.png)

<ifram src="//player.bilibili.com/player.html?aid=763614192&bvid=BV19r4y127fu&cid=424201509&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" > </iframe>

#### C++ STL

[(14条消息) c++ map通过值找键与通过键找值得方法(全）_c++中map怎么用值查键_落春只在无意间的博客-CSDN博客](https://blog.csdn.net/qq_39838607/article/details/119653496)



[求解斐波那契数列的若干方法 - AcWing](https://www.acwing.com/blog/content/25/)

[(61条消息) C++中set用法详解_c++ set_Donny-You的博客-CSDN博客](https://blog.csdn.net/yas12345678/article/details/52601454)



#### 石子合并

每次合并两个最小的

 

A B C

A《B《C

A+B+A+B+C《B+C+B+C+A

同时我要知道合并之后此时邻居下一次最小的是谁

 

问题变成怎么快速找到一个数组里面a[i]+a[i+1]最小的

但注意到先合并和较小的两个的结果一般较优，考虑是否能按先合并小的来求最小值，这种方法是错误的

当其中一个数 与左边合并 和与右边合并消耗相同时，选法不同，结果会不同 ，贪心随机选左边或右边所以不一定正确。

 

关键点：最后一次合并一定是左边连续的一部分和右边连续的一部分进行合并



**递归搜索+保存计划结果=记忆化搜索**

把递归的计算结果保存下来，那么下次递归到同样的入参时就直接返回先前保存的结果<img src="C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20231129210717353.png" alt="image-20231129210717353" style="zoom:67%;" />



石子合并

递归写法（暴力写法）

思路：递归，hash判断是否这个stock被合了无了。

```c++
#include<iostream>
const int n=100010;
int N;
int stocks[n];
int hash[n];
int record[n][2]; 
int min=0x3f3f3f3f;
void dfs(int* stocks,int cost,int cnt)
{
    if(cnt==0)
    {
        //   for(int i=N-1;i>0;i--)
        //   {
        //       printf("%d %d\n",record[i][0],record[i][1]);
        //   }
        //   printf("cost%d ",cost);
      if(min>cost) {
          min = cost;
        
        //   printf("\n");
      }
      
        return ;
    }
    for(int i=0;i<N-1;i++)
    {
        if(hash[i]) 
        {
            int second=0;
            for(int j=i+1;j<N;j++)
            {
                if(hash[j])
                {
                    second = j;
                    break;
                }
                
        
            }
            if(second==N) continue;
            int tmp = stocks[second];
            hash[i]=0,stocks[second]=stocks[second]+stocks[i];
            record[cnt][0]=i;
            record[cnt][1]=i+1;
            // printf("co%d ",cost);
             dfs(stocks,cost+stocks[second],cnt-1);
            hash[i]=1,stocks[second]=tmp;
        }
    }
    return ;
}
int main()
{
    scanf("%d",&N);
    for(int i=0;i<N;i++)
    {
        scanf("%d",&stocks[i]);
        hash[i]=1;
        record[i][0]=-1;
        record[i][1]=-1;
    }
    dfs(stocks,0,N-1);
    printf("%d ",min);
}


```



转化为记忆化搜索

<img src="D:\typora笔记\基础算法.assets\image-20231202205741869.png" alt="image-20231202205741869" style="zoom:50%;" />

```c++
#include<stdio.h>
#include<string.h>
using namespace std;
const int N=310;
int n;
int a[N],dp[N][N];
int s[N];
int dfs(int l,int r)
{
    if(dp[l][r]!=0x3f3f3f3f) return dp[l][r];
    if(l==r) {
        dp[l][r]=0;
        return 0;
    }
    int min=0x3f3f3f3f;
    for(int i=l;i<r;i++)
    {
        
        min=min>dfs(l,i)+dfs(i+1,r)?dfs(l,i)+dfs(i+1,r):min;
       
    }
    dp[l][r]=min+s[r]-s[l-1];
    // printf("%d = dp[%d][%d] ",dp[l][r],l,r);
     return dp[l][r];
}
int main()
{
    scanf("%d",&n);
    
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        s[i]=s[i-1]+a[i];
    }
    memset(dp,0x3f3f3f3f,sizeof(dp));
    
    printf("%d",dfs(1,n));

}
```

<img src="D:\typora笔记\基础算法.assets\image-20231202215110757.png" alt="image-20231202215110757" style="zoom:50%;" />
