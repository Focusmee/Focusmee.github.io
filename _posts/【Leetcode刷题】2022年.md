[toc]



# 快速排序

```c
#include<stdio.h>
void swap(int* i,int* j)
{
    int temp = *i;
    *i = *j;
    *j = temp;
}

void quick_sort(int q[],int l,int r){
    if(l>=r) return ;
    int i=l-1,j=r+1,x=q[(l+r)>>1];
    while(i<j){
        do i++;while(q[i]<x);
        do j--;while(q[j]>x);
        if(i<j) swap(&q[i],&q[j]);
    }
    quick_sort(q,l,j),quick_sort(q,j+1,r);
}

int main()
{
    int n;
    int a[100000];
    scanf("%d",&n);
    for(int i=0;i<n;i++)
    {
        scanf("%d",&a[i]);
    }
    quick_sort(a,0,n-1);
    for(int i=0;i<n;i++)
    {
        printf("%d ",a[i]);
    }
}
```



# 线性表

### 线性表的逻辑结构



- 定义：线性表是具有相同数据类型的n（n≥0）个数据元素的有限序列。其中n为表长。当n=0时 线性表是一个空表
- 特点：线性表中第一个元素称为表头元素；最后一个元素称为表尾元素。 除第一个元素外，每个元素有且仅有一个直接前驱。 除最后一个元素外，每个元素有且仅有一个直接后继。

### 线性表的顺序存储结构



- 线性表的顺序存储又称为顺序表。 它是用一组地址连续的存储单元（比如C语言里面的数组），依次存储线性表中的数据元素，从而使得逻 辑上相邻的两个元素在物理位置上也相邻。
- 建立顺序表的三个属性: 1.存储空间的起始位置（数组名data） 2.顺序表最大存储容量（MaxSize） 3.顺序表当前的长度（length）
- 其实数组还可以动态分配空间，存储数组的空间是在程序执行过程中通过动态存储分配语句分配
- 总结：
  - 1.顺序表最主要的特点是随机访问（C语言中基于数组），即通过首地址和元素序号可以在O(1)的时间内找到指定的元素。
  - 2.顺序表的存储密度高，每个结点只存储数据元素。无需给表中元素花费空间建立它们之间的逻辑关系（因为物理位置相邻特性决定）
  - 3.顺序表逻辑上相邻的元素物理上也相邻，所以插入和删除操作需要移动大量元素。



## 单链表

```c
#include<stdio.h>
#define N 100010
int e[N],ne[N];
int head;
int idx;
void init()
{
    head=-1;
    idx=0;
}
void add_to_head(int x)
{
    e[idx]=x;
    ne[idx]=head;
    head=idx;
    idx++;
}
void insert(int k,int x)
{
    e[idx]=x;
    ne[idx]=ne[k];
    ne[k]=idx;
    idx++;
}
void remove_k(int k)
{
    ne[k]=ne[ne[k]];
}
int main()
{
    int M;
    char c;
    int x,k;
    init();
    scanf("%d",&M);

    for(int i=0;i<M;i++)
    {
        getchar();
        scanf("%c",&c);
        switch (c)
        {
            case 'H':
                scanf("%d",&x);
                add_to_head(x);
                break;
            case 'D':

                scanf("%d",&k);
                if(!k) head=ne[head];
                else remove_k(k-1);
                break;
            case 'I':

                scanf("%d %d",&k,&x);
                insert(k-1,x);
        }
    }
    for(int i=head;i!=-1;i=ne[i])
    {
        printf("%d ",e[i]);
    }
}

```





# 链表

单链表常用双指针

# 数组常用

## · 双指针

#### 二分搜索（有序）

##### 1.二分查找一般流程

[二分查找为什么总是写错？_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1d54y1q7k7?spm_id_from=333.999.0.0&vd_source=9a75a4b5f792c3cd3b921c00fec104bb)

<img src="C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20220809155448718.png" alt="image-20220809155448718" style="zoom: 37%;" /> 

##### 2.二分查找的细节处理

后处理就是需要注意l和r的范围是否处于在区间里面（包含只有蓝色区域/红色区域的返回值处理问题等）

###### 细节一：为什么l的初始值为-1，r的初始值为N

如果全为某一种颜色的区域，就会造成错误

###### 细节二：m是否始终处于[0，N）以内

只有m处于区间内才有意义

<img src="C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20220809164628717.png" alt="image-20220809164628717" style="zoom: 67%;" /> 

###### 细节三：更新指针能不能l=m+1，r=m-1

不能，因为不能确定l=m+1时不确定其是否为蓝色颜色

同理r=m-1也是同一个道理

##### 3.二分查找代码演示

```
int search(int* nums, int numsSize, int target){
int left=0,right=numsSize-1;
while(left<=right)
{
    int mid=(left+right)/2;
    if(nums[mid]==target) return mid;
    if(nums[mid]>target) right=mid-1;
    if(nums[mid]<target) left=mid+1;
}
return -1;
}//第一种
```

```
int search(int* nums, int numsSize, int target){
int left=0,right=numsSize;
while(left<right)
{
    int mid=(left+right)/2;
    if(nums[mid]==target) return mid;
    if(nums[mid]>target) right=mid;
    if(nums[mid]<target) left=mid+1;
}
return -1;
}//第二种
```

```
int search(int* nums, int numsSize, int target){
int left=-1,right=numsSize;
while(left+1!=right)
{
    int mid=(left+right)/2;
    if(IsBLUE(m)) l=mid;
    else r=mid;
}
/*
此处添加后处理
*/
return l or r;
}//第三种：颜色区域，对于IsBLUE和return共同实现了查找的情况
```

计算上防止溢出的技巧：

![image-20221010101540427](C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20221010101540427.png)

[69. x 的平方根 ](https://leetcode.cn/problems/sqrtx/)

```c
int mySqrt(int x){
    if(x==0||x==1) return x;
int l=0;
int r=x;
while(l!=r-1)
{
    int mid=(l+r)/2;
    if(x/mid>=mid) l=mid;
    else r=mid;
}
 return l;
}
```

这道题其实有许多坑的，如果我使用的都是int那么就要考虑边界条件越界的问题，测试用例**2147483647**就引发问题。

首先还是套用蓝红区域的模板去解决，但因为有个重要的问题首先不想越界那么采用的x/mid>=mid，这决定了mid就不能为0，所以l不能选择-1，m的区间就会出现0，导致运行不通过，既然如此l=1行吗？事实证明不行，因为当r为**2147483647**（int的上限）就会出现1+2147483647的情况导致出现错误。

所以l必须=0。

#### 滑动窗口：快慢指针，解决子串问题（窗口扩大和缩小的影响可保证）

#### 解决回文串：是不是用两端向中心检查，有无子串从中心到两端（最长回文子串有Manacher算法）

## · 前缀和和差分数组

如果频繁地让你计算子数组的和，每次用 for 循环去遍历肯定没问题，但前缀和技巧预计算一个 `preSum` 数组，就可以避免循环。

类似的，如果频繁地让你对子数组进行增减操作，也可以每次用 for 循环去操作，但差分数组技巧维护一个 `diff` 数组，也可以避免循环。

##### 前缀和题目：

###### [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

1. 暴力 直接sum记录连续子数组的和，如果满足就ans++ 超时
2. 先求前缀和，开辟前缀和数组，然后后面的前缀和减前面的前缀和可以得到任意子数组的和 超时
3. 运用HashMap，而且是java写法，如果用c开hash数组表示所有和那么就太大了，浪费空间。java写法直接就是用sum求前缀和，然后再HashMap中找是否有sum-k的键，sum-k的元素就是此时i的前缀和-前面某一个数的前缀和等于k的个数，最后将该前缀和++

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        int sum=0,res=0;
        HashMap<Integer,Integer> cul=new HashMap<Integer,Integer>();
        cul.put(0,1);
        for(int i:nums){
            sum+=i;
            if(null!=cul.get(sum-k))
            {
                res+=cul.get(sum-k);
            }
            
            if(null==cul.get(sum)){
                cul.put(sum,1);
                continue;
            }
            int oldNum=cul.get(sum);
            cul.put(sum,oldNum+1);
        }
        return res;
    }
}
```



## · 动态规划：本质上也是穷举



## · 堆栈

 [1047. 删除字符串中的所有相邻重复项](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)

``` c
char * removeDuplicates(char * s){
    int lenth=strlen(s);
char* str=(char*)malloc(sizeof(char)*(lenth+1));

char *bottom=str;
char *top=str+1;
for(int i=0;i<lenth;i++)
{
    if(top==bottom) 
    {
        *top++=*(s+i);
    }
    else{

        if(*(top-1)==*(s+i)) 
        {
            *(top-1)=0,top--;
        }
        else *top++=*(s+i);
    }
}
*(top)='\0';
return str+1;
}
```

框架：创建stack

​			bottom和top去判断是否为空，

​			top-bottom判断堆栈内有几个元素，

​			空则直接入栈，不为空则与栈中顶端元素对比

​			注意最后栈顶封顶

之前memset导致运行错误。

``` c
char * removeDuplicates(char * s){
    int lenth=strlen(s);
    char* str=(char*)malloc(sizeof(char)*(lenth+1));
    int retSize=0;
for(int i=0;i<lenth;i++)
{
    if(retSize>0&&str[retSize-1]==s[i])
    {
        retSize--;
    }
    else{
        str[retSize++]=s[i];
    }
   
}
str[retSize]='\0';
return str;
}
```

框架：用retSize有两个用处：1.栈中有多少元素 2.表示栈顶位置

如果retSize>0说明栈中有元素，如果此时又满足栈顶元素消除条件，则直接元素数减少，栈顶元素消除。

否则直接retSize++，栈中入新元素。

#### 单调栈

单调栈是什么？栈中元素按递增顺序或者递减顺序排列的时候

解决：找最近一个比当前值大/小

优势是时间复杂度是线性的，每个元素遍历一次

三步走：

1. 维持递增栈

2. 放入最后结果array
3. 当前元素入栈

递增栈主要进行两步：

1. 入栈元素从栈顶到栈底比较，把小于入栈元素的栈内元素出栈。
2. 入栈元素入栈。

```
for(int i=heightSize-1;i>=0;i--)
 {
     while(stackSize!=0&&stack[stackSize-1]<height[i])
     {
         stackSize--;
     }
     if(stackSize==0) right_max[i]=0;
     else right_max[i]=stack[stackSize-1];
     stack[stackSize++]=height[i];
 }//这个得到的是每个数它右边最大的数是什么。
```



题目：

[496. 下一个更大元素 I](https://leetcode.cn/problems/next-greater-element-i/)

[503. 下一个更大元素 II](https://leetcode.cn/problems/next-greater-element-ii/)

[42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)

要点 1
对于某一个位置i, 我们能否接这个位置上的雨水, 取决于i左右两侧的最大值(leftMax, rightMax)是否比height[i]大. 只有当i左右两侧的最大值都比height[i]大时, 才能接i上的雨水, 数量为min(leftMax, rightMax) - height[i];
这里得出结论, 限制当前位置接雨水的条件是其左右两侧最大值中的较小值min(leftMax, rightMax).
要点 2
对于i和j两个指针, i从左向右移动, j从右向左移动, 对于指针i来说, leftMax是真实可信的, 因为leftMax的值是i一步一个脚印走出来的, 但是rightMax是不真实不可信的, 因为i不知道从height[i]到height[j]之间是否有其他的数大于rightMax; 同样,对于j来说rightMax是真实可信的, leftMax值是不真实不可信的.
这里得出结论: 对于左指针i, 它右侧的真实的最大值 >= rightMax, 对于右指针j, 它左侧的真实的最大值 >= leftMax.
要点 3
基于要点 1, 我们知道对于一个位置来说影响它接水的应该是左右两侧最大值中的较小值, 也就是min(leftMax, rightMax), 而基于要点 2, 我们知道左指针右侧的真实最大值会大于等于rightMax, 所以, 当出现leftMax < rightMax的时候, 左指针的位置是否能接雨水就已经确定了, 同样, 当出现leftMax >= rightMax的时候, 右指针的位置是否能接雨水就已经确定了, 所以, 可以写出下面的代码了.
另外关于代码中的循环条件while (i < j), 今天我再看时有了些疑问, 为什么不是while (i <= j)也能通过. 我又仔细想了下, 并做了些试验, 结果发现最后当i == j的时候, 它们指向的一定是数组中最大的那个数, 这个最大的数是不能接到雨水的.

作者：lafiteee
链接：https://leetcode.cn/problems/trapping-rain-water/solution/shuang-zhi-zhen-by-lafiteee-aay8/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

```
int min(int a,int b)
 {
     return a>b?b:a;
 }
int trap(int* height, int heightSize){
    int left_max=height[0];
    int right_max=height[heightSize-1];
    int left=0;;
    int right=heightSize-1;
    int ans=0;
   
 while(left<right)
 {
     if(left_max<=right_max)
     {
         ans+=left_max-height[left];
         left++;
         left_max=left_max>height[left]?left_max:height[left];
         continue;
     }
     if(right_max<=left_max)
     {
         ans+=right_max-height[right];
         right--;
         right_max=right_max>height[right]?right_max:height[right];
     }
 }
 return ans;
}
```



---
## · 优先队列PriorityQueue 堆Heap

##### Insert 插入

1. 在堆的最后新建一个结点

2. 将数值赋予新结点

3. 将其结点和父节点比较
4. 如果新节点的数值比父节点打，调换父子结点的位置
5. 重复步骤3和4直到最大堆的特性被满足。

##### Poll 删除

1. 移除根节点
2. 将最后的元素移到根节点处
3. 将子节点和

##### Peek 获取

---

# 二叉树

重点在于如何访问结点和处理结点

## 一、种类

##### 1. 满二叉树  

就是二叉树满的 如果一棵二叉树只有度为0的结点和度为2的结点，并且度为0的结点在同一层上，则这棵二叉树为满二叉树。这棵二叉树为满二叉树，也可以说深度为k，有2^k-1个节点的二叉树。

##### 2. 完全二叉树 

节点都在左边 

在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 h 层，则该层包含 1~ 2h 个节点。

**优先级队列其实是一个堆，堆就是一棵完全二叉树，同时保证父子节点的顺序关系。**

##### 3. 二叉搜索树 

小左大右 

二叉搜索树是有数值的了，**「二叉搜索树是一个有序树」**。

- 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
- 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
- 它的左、右子树也分别为二叉排序树

##### 4. 平衡二叉搜索树 

满足二叉平衡树（它是⼀棵空树或 它的左右两个⼦树的⾼度差的绝对值不超过1，并且左右两个⼦树都是⼀棵平衡⼆叉树） 且 满足二叉搜索树

## 二、存储方式

1. 链式存储
2. 数组存储：如果⽗节点的数组下表是i，那么它的左孩⼦就是i * 2 + 1，右孩⼦就是 i * 2 + 2。

## 三、遍历

### 1. 深度优先遍历

a. 前序遍历

b. 中序遍历

c. 后序遍历

### 2. 广度优先遍历

层序遍历

### 递归写法

#### 	三要素

1. **确定递归函数的参数和返回值**

2. **确定终止条件**

3. **确定单层递归的逻辑**




***



### 迭代法（前中后层）：

##### 1.前序遍历：

一个stack 一个res（结果）数组，入栈一次，然后出栈一次看其左右结点使其入栈之后继续出栈看其左右结点有无，有则入栈，注意入栈的时候要右左入才能左右出。直到栈为空。

<details>
<summary>代码如下：</summary>
<pre><code>int* preorderTraversal(struct TreeNode* root, int* returnSize){
*returnSize=0;
if(root==NULL) return NULL;
struct TreeNode *stack[101];
int stackSize=0;
int *res=(int *)malloc(sizeof(int)*101);
int resSize=0;
stack[stackSize++]=root;
while(stackSize!=0)
{
    res[resSize++]=stack[stackSize-1]->val;
    root=stack[stackSize-1];
    stackSize--;
    if(root->right!=NULL) stack[stackSize++]=root->right;
    if(root->left!=NULL) stack[stackSize++]=root->left;
}
*returnSize=resSize;
return res;
}



##### 2.后序遍历：

前序遍历入栈是中右左，把入栈顺序改成中左右，然后颠倒结果数组就编程左右中

<details>
    <summary>代码如下：</summary>
    <pre><code>int* revese(int *p,int size)
{
    for(int i=0;i&#60;size/2;i++)
    {
        int temp=p[i];
        p[i]=p[size-1-i];
        p[size-1-i]=temp;
    }
    return p;
}
int* postorderTraversal(struct TreeNode* root, int* returnSize){
*returnSize=0;
if(root==NULL) return NULL;
struct TreeNode *stack[101];
int stackSize=0;
int *res=(int *)malloc(sizeof(int)*101);
int resSize=0;
stack[stackSize++]=root;
while(stackSize!=0)
{
    res[resSize++]=stack[stackSize-1]->val;
    root=stack[stackSize-1];
    stackSize--;
    if(root->left!=NULL) stack[stackSize++]=root->left;
    if(root->right!=NULL) stack[stackSize++]=root->right;
}
*returnSize=resSize;
res=revese(res,resSize);
return res;
}



疑惑：

```
root=stack[stackSize-1];
stackSize--;//为什么这里写成stack[stackSize--]
```



##### 3.中序遍历：

左入栈，一直到左结点NULL后出栈 处理：看右孩子有无，有入栈，并把出栈元素加入到res，无则继续出栈，看右孩子有无，有入栈，

左有入栈继续左，左空看右，右有入栈继续左，右无继续出栈

左孩子为空则弹出自己，右孩子为空则继续=弹出

注意这个left是啥含义：表示说明中间结点的左节点都已经弹出去了防止下次循环再次进入stack[stackSize-1]->left！=NULL

```c
int* inorderTraversal(struct TreeNode* root, int* returnSize){
*returnSize=0;
if(root==NULL) return NULL;
struct TreeNode *stack[101];
int stackSize=0;
int *res=(int *)malloc(sizeof(int)*101);
int resSize=0;
stack[stackSize++]=root;
int left=0;
while(stackSize!=0)
{
   
    if(stack[stackSize-1]->left!=NULL&&left==0)
    {
        stack[stackSize]=stack[stackSize-1]->left;
        stackSize++;
        continue;
    } 
    res[resSize++]=stack[stackSize-1]->val;
     printf("%d %d\n",stackSize,res[resSize-1]);
    if(stack[stackSize-1]->right!=NULL) stack[stackSize-1]=stack[stackSize-1]->right,left=0;//表示已经弹出去，右孩子入栈
    else 
    {
        stackSize-=1;
        left=1;
    }
    
}
*returnSize=resSize;
return res;
}
```

left表示是否该结点的左孩子是否遍历过了

如果没遍历完左孩子则继续入栈，把左孩子全入完栈后，开始出栈栈顶元素（这样就固定了前中后节点的顺序）

出栈元素的val保存到结果数组里，并看当前出栈元素的右孩子，有就入栈（下次循环将继续先遍历以其为根节点的左子树，所以此处要left=0表示还未遍历以该入栈节点为根节点的左子树），

无则记录以出栈元素为根节点的树遍历完了，此时left=1表示之前的根节点的左节点都记录到结果数组里了无需再遍历左孩子了。

第一次循环结束 

之后的循环也是这个逻辑，循环结束就是当栈清空。



继续栈顶结点的左子树，全遍历完后才看右子树，有一个有节点就立马看它的左子树，



##### 层序遍历（图论中的广度优先遍历）

###### [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

思路：运用队列先进先出，外循环是层数的更替，内循环是某层所有结点的处理。每一层的结点在出结点的时候其子节点入队列，即该层的所有结点都在内循环里出队完并把下层的所有结点入队。再用一个变量保存内循环里每层出队多少个就解决层序遍历了。

front是队列头 rear是队列尾

cur是当前正出队的结点，用来加入它子节点（下一层的结点）

cnt存储每层的结点数量。cnt>0 说明该层还有结点可以出队

colSize就是每列多少个，也就是每层数量。

```
int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes){
*returnSize=0;
if(root==NULL)
{
    return NULL;
}
int** res=(int **)malloc(sizeof(int *)*2000);
*returnColumnSizes=(int*)malloc(sizeof(int)*2000);
struct TreeNode*queue[2000];
int front=0,rear=0;
queue[rear++]=root;
while(front!=rear)
{
    res[*returnSize]=(int *)malloc(sizeof(int )*(rear-front));
    int cnt=rear-front;
    int colSize=0;
    while(cnt>0)
    {
        struct TreeNode*cur=queue[front];
        res[*returnSize][colSize++]=queue[front++]->val;
        cnt--;
        if(cur->left) queue[rear++]=cur->left;
        if(cur->right) queue[rear++]=cur->right;
    }
     (*returnColumnSizes)[*returnSize]=colSize;
     (*returnSize)++;
}

return res;
}
```

```
int** returnColumnSizes就可以去看作一个一维数组，*returnColumnSizes就是为数组名，然后申请空间存放每列的个数进行存放。
```

###### [429. N 叉树的层序遍历](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/)

```
int** levelOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
    *returnSize=0;
    if(root==NULL)
    {
        *returnColumnSizes = malloc(0);//注意：这题会出现如下的错误提示当缺少*returnColumnSizes = malloc(0);就会出现double-free的错误。用例为空树[]，如果未处理returnColumnSizes，主函数会释放空指针导致错误。
        return NULL;
    }
    int **res=(int **)malloc(sizeof(int *)*10001);
    *returnColumnSizes=(int*)malloc(sizeof(int)*1000);
    struct Node*queue[10001];
    int front=0,rear=0;
    queue[rear++]=root;
    while(front!=rear)
    {
        int cnt=rear-front;
        res[*returnSize]=(int *)malloc(sizeof(int)*cnt);
        for(int i=0;i<cnt;i++)
        {
            struct Node*cur=queue[front];
            res[*returnSize][i]=queue[front++]->val;
            for(int j=0;j<cur->numChildren;j++)
            {
               queue[rear++]=cur->children[j];
            }
        }
        (*returnColumnSizes)[*returnSize]=cnt;
        (*returnSize)++;
    }
    return res;
}

```

在⼆叉树：看看这些树的最⼤深度中我们可以使⽤层序遍历来求深度，但是就不能直接⽤层序遍历来求⾼度了，这 就体现出求⾼度和求深度的不同

[110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

深度可以用先序和层序求

这题是与高度有关的，下面用到的是后序遍历。

**递归法代码**

```
int Isba(struct TreeNode*root)
{
    if(root==NULL) return 0;
    int leftsize=Isba(root->left)+1;
    int rightsize=Isba(root->right)+1;
    if(fabs(leftsize-rightsize)<=1&&leftsize!=0&&rightsize!=0) return leftsize>rightsize?leftsize:rightsize;
    else return -1;
}
bool isBalanced(struct TreeNode* root){
    if(root==NULL) return true;
    if(Isba(root)!=-1) return true;
return false;
}
```

当然也可以用迭代法用栈模拟后序遍历

**迭代法代码**

```
```





## 四、思路拓展

一、如何确定一个结点是另一个结点的祖先？

1. 暴力搜索 缺点：时间复杂度（n）
2. hash存储每个结点的子节点 缺点：空间复杂度（n^2^)

本质：一个结点是另一个结点的祖先是一种关系



记录访问开始时刻和访问结束时刻。

当一个结点的开始时刻到结束时刻包含了另一个结点的开始时刻和结束时刻，就说明是祖先节点。

用线段去表示这个



***



#### 堆：从堆的定义到优先队列、堆排序

[【从堆的定义到优先队列、堆排序】 10分钟看懂必考的数据结构——堆_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1AF411G7cA/?spm_id_from=333.788.recommend_more_video.0&vd_source=9a75a4b5f792c3cd3b921c00fec104bb)

- ##### 定义：堆必须是一个完全二叉树

  **完全二叉树有以下性质**：

     		   1. 完全二叉树只允许最后一行不为满 
     		   2. 且最后一行必须从左往右排序
     		   3. 最后一行元素之间不可以有间隔

  **堆序性**：

  1. 大根堆（大顶堆）
  2. 小根堆（小顶堆）

  **储存**：

  因为堆是完全二叉树，

  故一个堆用一个一维数组来描述。

  结点下标规律：

  结点下标为 `i`

  左子节点下标为` 2i + 1`

  右子结点下标为 `2i + 2`

- ##### 基本操作

  **上滤**：以小根堆举例，只有树的最后一个元素破坏了堆序性

  让它与它父节点比较，大则交换知道无法上移为止。

  **下滤** O(logN)：以大根堆举例，比较其两子节点，找到最大的交换。持续比较、交换，知道该元素大于它的子节点为止或者移动到底部为止。

- ##### 建堆

  **自顶向下 ** O(NlogN)：方法：将每个元素一个一个1. 插入堆 2. 上滤

  **自下而上 ** O(N)：方法：先把数组里元素调整为堆，再对每个父节点进行下滤操作

  

- ##### 优先队列

  弹出**最小元素**<-优先队列<-**插入**队列

  **弹出最小元素操作** O(logN)：

  1. 弹出根节点；
  2. 将最后一个元素放到根节点然后进行**下滤**操作即可。

  **插入操作 ** O(logN)：

  1. 任意元素插入到堆尾部
  2. 上滤操作

- ##### 堆排序 O(NlogN)

​		实质上是将**优先队列**的所有元素依次进行**弹出最小元素操作**，（考虑到空间复杂度，排序的结果会存放到堆空缺的单元里）

大根堆做排序就是正序的，小根堆做排序就是倒序的。

节约空间的做法：

用完全二叉树以一维数组的形式存储处理，

不断进行将最后一个（完全二叉树中最下面一层未进行交换的）元素与根节点交换，然后这个元素进行下滤操作

直到最后一个元素在根节点。



***



#### 栈和队列互相模拟

两个栈模拟队列，直接先放入一个栈，然后从这个栈放入另一个栈，此时先进后出来的顺序就是队列的顺序。

一个队列模拟栈，先进先出再进队列，只要知道什么时候停止这个操作即到出栈的元素即可。



***



## 五、相关题目

#### 对二叉树遍历的深刻理解

[538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/)反中序遍历

[116. 填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)

#### [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

**解题思路**

能用递归写法都可以尝试写写迭代。
先确定递归的逻辑。

既然要判断是不是对称的，那么左右子树都要同时判断，所以需要自己写一个递归函数，去判断左树和右树是否对称。

既然要判断左树和右数是否对称，就是判断左树的左孩子和右树的右孩子是否相等，左树的右孩子和左树的左孩子是否相等。
其实就是判断两棵树的这些结点是否符合对称条件。
同时**判断两棵树的结点是否符合对称条件就需要传参两个结点**。//此处已经确定了**传参**了
返回值的话就返回bool即可。

接下来**确定递归的条件**，什么时候递归呢？我只要判断了**左树某一个结点和右树对应对称的结点比较是否对称就可以继续往下比对称，**

也就是说只要**先判断这两个结点是否对称**，不对称返回false，对称才然后继续往下比。

**这两个结点不对称的情况有以下两种**：

1. 一个空 一个有 直接返回false；
2. 两个都有但是值不同 直接返回false。

**这两个结点对称的情况有以下两种**：

1. 两结点为空；
2. 两结点都不为空且两结点值相等；

**两结点对称中第二种情况就可以继续访问这两结点的子节点是否符合对称，第一种情况就可以直接放回true了（比如树只有一个结点这样好理解）**
那么**开始递归**就是两结点对称中第二种情况。

得到接下来的代码（代码对应注释在该行代码下面）

**代码**

```
bool isSame(struct TreeNode*p,struct TreeNode*q)
{
    if(p==NULL&&q==NULL) return true;
//为什么这个要放到最前面，因为如果都为空就直接说明此时这两个结点对称。
    if(p==NULL||q==NULL) return false;
//为什么p==NULL||q==NULL这样写就可以说明一个空 一个有，因为两空已经return了，能进行到这里就说明至少有一个不为空
    if(p->val!=q->val) return false;
//值不同直接返回false
    if(isSame(p->left,q->right)&&isSame(p->right,q->left)) return true;
//满足对称情况2. 两结点都不为空且两结点值相等；递归。如果两个都为true说明后面的结点都符合对称，只要一个false就说明就不对称
    return false;
}

bool isSymmetric(struct TreeNode* root){
   return isSame(root->left,root->right);
}
```

既然确定好递归的逻辑了，那我们是否可以想想能否运用到迭代呢？
这里需要对前面前中后序遍历以及层序遍历的迭代法有个了解或许能更加容易理解。
当然前中后序遍历迭代比较常用的是栈，层序遍历比较常用的是队列。
这里分享一下用栈的做法，当然其实这题并没有运用到上面所说到的遍历。

首先把比较的两个点入栈，出栈比较后如何把他们的子节点成对入栈（一旦不成对说明一空一有肯定不对称，如果两为空则直接跳过入栈）
之后出栈继续比较，再子节点成对入栈，直到栈为空则说明所有结点（除了树的根结点）都成对入了栈且对称的。

**代码**

```c
bool isSymmetric(struct TreeNode* root){
    struct TreeNode* stack[1000];
   int stackSize=0;
   stack[stackSize++]=root->left;
   stack[stackSize++]=root->right;
   while(stackSize!=0)
   {
       struct TreeNode *cur1=stack[--stackSize];
       struct TreeNode *cur2=stack[--stackSize];
       if(cur1==NULL&&cur2==NULL) continue;
       if(cur1==NULL&&cur2!=NULL||cur1!=NULL&&cur2==NULL) return false;
       if(cur1->val==cur2->val)
       {
           if(cur1->right!=NULL&&cur2->left!=NULL)
           {
            stack[stackSize++]=cur1->right;
            stack[stackSize++]=cur2->left;
           }
           else if(cur1->right==NULL&&cur2->left==NULL);
           else return false;
           if(cur2->right!=NULL&&cur1->left!=NULL)
           {
            stack[stackSize++]=cur1->left;
            stack[stackSize++]=cur2->right;
           }
           else if(cur2->right==NULL&&cur1->left==NULL);
           else return false;
           
       }
       else return NULL;
   }
   return true;
}
```

#### [222. 完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/)

完全二叉树 的定义如下：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 h 层，则该层包含 1~ 2h 个节点。

**递归法代码：**

```
int countNodes(struct TreeNode* root){
if(root==NULL) return 0;
int count=0;
count+=countNodes(root->left)+countNodes(root->right)+1;
return count;
}//运用了后序遍历，左右中。
```

迭代法就直接中序遍历记录结点数就行。

但这些都是普通二叉树来做的。

没有触及完全二叉树的性质。

把完全二叉树拆开，就会发现其实是满二叉树和若干个根节点组成的。

而满二叉树满足结点个数为2^n^-1的性质

所以代码可以这样写。

```
int countNodes(struct TreeNode* root){
struct TreeNode*cur=root;
if(cur==NULL) return 0;
int leftsize=0;
int rightsize=0;
while(cur->left!=NULL)
{
    cur=cur->left;
    leftsize++;
}
while(cur->right!=NULL)
{
    cur=cur->right;
    rightsize++;
}
if(leftsize==rightsize)
{
    return (1<<(leftsize+1))-1;
}
else
{
    return 1+countNodes(root->right)+countNodes(root->left);
}
}
```

#### 路径问题合集

##### [257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)

##### [112. 路径总和](https://leetcode.cn/problems/path-sum/)

**如果需要搜索整颗⼆叉树，那么递归函数就不要返回值，如果要搜索其中⼀条符合条件的路径，递归函数就需要返 回值，因为遇到符合条件的路径了就要及时返回。**

* 确定**传参**和**返回值** 传参肯定要有`root`和`targetsum`，需要判断是否满足`targetsum`的条件就必须用到这两个参数，此处用`count`表示减当前结点的值在当`count==0`时候表明符合条件。返回值为bool因为当遇到路径符合条件就直接返回true了无需去访问树的所有路径。
* 确定**终止条件**，**叶子结点**指的是没有子节点的结点，即符合`root->left==NULL&&root->right==NULL&&count-root->val==0`返回
* 确定**每层逻辑**，就是当不满足终止条件时候，一是到叶子节点但不符合条件就会返回，二是该节点不是叶子结点，就要继续向下访问，当这条路径的叶子结点返回true的时候，就说明这条路径符合条件，直接返回true就可以，否则返回false

<details>
<summary>递归代码如下：</summary>
<pre><code>
bool DFS(struct TreeNode* root,int count)
{
    if(root->left==NULL&&root->right==NULL&&count-root->val==0) 
    {
        return true; 
    }
    if(root->left==NULL&&root->right==NULL) return false;
    if(root->left!=NULL) 
    {
        if(DFS(root->left,count-root->val))
        {
            return true;
        }
    }
    if(root->right!=NULL) 
    {
        if(DFS(root->right,count-root->val))
        {
            return true;
        }
    }
    return false;
}
bool hasPathSum(struct TreeNode* root, int targetSum){
    if(root==NULL) return false;
    return DFS(root,targetSum);
}



##### [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)

**要遍历整个树，找到所有路径，所以递归函数不要返回值**



#### 构造二叉树合集

##### [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

##### [106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

- 第一步：如果数组大小为零的话，说明是空结点
- 第二步：如果不为空，那么取**后序数组最后一个元素/前序数组第一个元素**作为节点元素
- 第三步：找到**后序数组最后一个元素/前序数组第一个元素**在中序数组的位置，作为切割点
- 第四步：切割中序数组，切成中序左数组和中序右数组（顺序必须先切中序数组，这样才能切后序数组--通过中序左数组的个数等于后序左数组的个数，中序右数组的个数等于后序右数组的个数）
- 第五步：切割**后序数组/前序数组**，切成**后序/前序左数组**和**后序/前序右数组**
- 第六步：递归处理左区间和右区间

分割注意：

1. 分割的区间开闭
2. 中间结点的跳过
3. 左右个数的确定以及利⽤中序数组⼤⼩⼀定是和后序/前序数组的⼤⼩相同这⼀特点来进⾏

##### [654. 最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/)

跟上面的处理方法大致。

只是每层逻辑不同，总结模板大概为先找中间结点，然后切割左右数组，然后递归建左右子树，最后返回return

细节之处就是如何处理到底空结点，下面代码用的是当数组只有一个元素就直接返回而不在递归中去处理空结点。

```
struct TreeNode* constructMaximumBinaryTree(int* nums, int numsSize){
    struct TreeNode*cur=(struct TreeNode *)malloc(sizeof(struct TreeNode));
    cur->left=NULL;
    cur->right=NULL;
    if(numsSize==1) 
    {
        cur->val=*(nums);
        return cur;
    }
    int max=0;
    int max_i=0;
    for(int i=0;i<numsSize;i++)
    {
        if(*(nums+i)>max) 
        {
            max=*(nums+i);
            max_i=i;
        }
    }
    // printf("%d %d %d %d\n",*nums,max_i,*(nums+max_i+1),numsSize-1-max_i);
    cur->val=max;
    
    if(max_i>0) cur->left=constructMaximumBinaryTree(nums,max_i);
    if(numsSize-1-max_i>0) cur->right=constructMaximumBinaryTree(nums+max_i+1,numsSize-1-max_i);
    return cur;
}
```

##### [617. 合并二叉树](https://leetcode.cn/problems/merge-two-binary-trees/)

<details>
    <summary>代码如下</summary>
    <pre><code>
    struct TreeNode* mergeTrees(struct TreeNode* root1, struct TreeNode* root2){
    if(root1==NULL&&root2!=NULL) return root2;
    if(root1!=NULL&&root2==NULL) return root1;
    if(root1==NULL&&root2==NULL) return NULL;
    root1->val=root1->val+root2->val;
    root1->left=mergeTrees(root1->left,root2->left);
    root1->right=mergeTrees(root1->right,root2->right);
    return root1;
	}
    </code></pre>

##### [108. 将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

有序数组中间的位置构造根节点，左右接收左子树区间数组的中间和右子树区间数组的中间。

知道区间数组大小为0返回。

这个二叉搜索树还是平衡的。

递归代码：

```
struct TreeNode* creat(int* nums,int numsSize)
{
    if(numsSize==0) return NULL;
    struct TreeNode *node=(struct TreeNode*)malloc(sizeof(struct TreeNode));
    node->val=nums[numsSize/2];
    node->left=creat(nums,numsSize/2);// numsSize/2 确定左子树的节点个数
    node->right=creat(nums+numsSize/2+1,numsSize-numsSize/2-1);// numsSize-numsSize/2-1 确定右子树的节点个数
    return node;
}
struct TreeNode* sortedArrayToBST(int* nums, int numsSize){
    if(nums==NULL) return NULL;
    return creat(nums,numsSize);
}
```



***



#### 二叉搜索树合集

##### [二叉搜索树的个数 - jihite - 博客园 (cnblogs.com)](https://www.cnblogs.com/kaituorensheng/p/3960263.html)

##### [700. 二叉搜索树中的搜索](https://leetcode.cn/problems/search-in-a-binary-search-tree/)

迭代法和递归其实都是直接搜索，小往左搜否则往右搜



##### [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

注意一下几点，下面这个做法就没考虑了一二两点。

- 节点的左子树只包含 **小于** 当前节点的数。

- 节点的右子树只包含 **大于** 当前节点的数。

- 二叉搜索树的子树所有左子树和右子树自身必须也是二叉搜索树。

错误做法：

```
bool isValidBST(struct TreeNode* root){
if(root==NULL) return true;
if(root->right)
{
    if(root->right->val<=root->val) return false;
}
if(root->left) 
{
    if(root->left->val>=root->val) return false;
}
return isValidBST(root->left)&&isValidBST(root->right);
}
```

<details>
    <summary>递归代码：</summary>
    <pre><code>
    int nodes[10000];
	int nodesSize=0;
	void DFS(struct TreeNode* root)
	{
		if(root==NULL) return ;
		if(root->left)
		{
    		DFS(root->left);
		}
		nodes[nodesSize++]=root->val;
		if(root->right) 
		{
   			DFS(root->right);
		}
	}
bool isValidBST(struct TreeNode* root){
    nodesSize=0;
    DFS(root);
	for(int i=1;i&#60;nodesSize;i++)
	{
		if(nodes[i]&#60;=nodes[i-1]) return false;
	}
	return true;
}
    </code></pre>
</details>


迭代法: 就是用**中序遍历**如何也是通过判断构成的数组是否有序逐项增。

全局变量注意要用写另一个函数的方式使其初始化，以达到在leetcode上能运行。



##### [530. 二叉搜索树的最小绝对差](https://leetcode.cn/problems/minimum-absolute-difference-in-bst/)

可以用**中序遍历**构成有序数组，然后遍历有序数组查找最小绝对差。

也可以用双指针，一个指针在前一个指针在后，在**中序遍历**的时候移动指针。

<details>
<summary>递归代码：</summary>    
<pre><code>
    int min;
    struct TreeNode*pre=NULL;
	void DFS(struct TreeNode* root)
	{
		if(root==NULL) return ;
		if(root->left)
		{
    		DFS(root->left);
		}
		if(pre!=NULL)
        min=min>root->val-pre->val?root->val-pre->val:min;
        pre=root;
		if(root->right) 
		{
   			DFS(root->right);
		}
	}
int getMinimumDifference(struct TreeNode* root){
    min=INT_MAX;
    pre=NULL;//这一步important
    DFS(root);
	return min;
}
</code></pre>



##### [701. 二叉搜索树中的插入操作](https://leetcode.cn/problems/insert-into-a-binary-search-tree/)

返回值可以有，也可以没有，但递归函数如果没有返回值的话，实现是⽐较麻烦的，下⾯也会给出其具体实现代码。 有返回值的话，可以利⽤返回值完成新加⼊的节点与其⽗节点的赋值操作。通过递归函数返回值完成了新加⼊节点的父子关系赋值操作了，下⼀层将加⼊节 点返回，本层⽤root->left或者root->right将其接住。

```
class Solution {
public:
 TreeNode* insertIntoBST(TreeNode* root, int val) {
 if (root == NULL) {
 TreeNode* node = new TreeNode(val);
 return node;
 }
 if (root->val > val) root->left = insertIntoBST(root->left, val);
 if (root->val < val) root->right = insertIntoBST(root->right, val);
 return root;
 }
};
```

迭代法：



##### [450. 删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/)

按照下面的图，先列出所有删的情况。因为本人画图很抽象所以用leetcode自带的图（因为二叉树的性质，数字其实无关紧要）。

<img src="C:\Users\乌拉拉巴卡巴卡\AppData\Roaming\Typora\typora-user-images\image-20220827232014295.png" alt="image-20220827232014295" style="zoom: 67%;" /> 

比如这个二叉搜索树，如果我想删掉3这个节点，删节点的本质其实就是将它的子节点直接代替它的位置，并保持二叉搜索树的性质，其本质就是插入节点。那么就可以用到上面的返回节点的模板（当没到达目标节点时候用root->left和root->right去接，如果到达目标节点直接返回处理后的节点就可以实现链接节点）

首先如果节点本身就是NULL 直接返回NULL

接下来考虑删除的情况了。（此处我也将会用子节点去代替目标节点描述，你可以理解我这里说的子节点都为目标节点，目标节点的父节点就用父节点概括）

1. 目标节点左空右空 

   直接返回NULL

2. 目标节点左不空右空

   父节点接子节点的左子树，即返回子节点的left

3. 目标节点左空右不空

   父节点接子节点的右子树，即返回子节点的right

4. 目标节点左不空右不空

   子节点的右孩子的左子树里最小节点（最下面最左边的那个节点）->left=子节点的左孩子

   父节点接子节点的右孩子

如果没删除，那么就访问左右孩子并赋值给节点的left和right

最后返回该节点

补充：如果删去的是头节点其实也是有效的，也是符合删除里面的四种情况的。

该题总结：先想好递归函数的返回值和传参，单层逻辑，单层逻辑直接以二叉树里面的节点进行具体的分析，然后换其他节点去检验是否包含了所有的情况。



##### [669. 修剪二叉搜索树](https://leetcode.cn/problems/trim-a-binary-search-tree/)

如果小于区间low往右找符合返回

如果大于范围high往左找符合返回

如果在区间里就往左右找，用节点的`left`和` right`去接，最后返回节点自身。

因为返回要么是NULL，要么就是符合条件的节点。

```
struct TreeNode* trimBST(struct TreeNode* root, int low, int high){
    if(root==NULL) return NULL;
     struct TreeNode*left;
      struct TreeNode*right;
    if(root->val<low) 
    {
       return trimBST(root->right,low,high);
    }
    if(root->val>high) return  trimBST(root->left,low,high);
    root->left=trimBST(root->left,low,high);
    root->right=trimBST(root->right,low,high);
    return root;
}
```







##### **总结**

二叉搜索树和中序遍历很搭。

有返回值，更⽅便，可以通过递归函数的返回值来进行增删查改

***



#### 最近公共祖先（Lowest Common Ancestor，简称 LCA）

学习来源链接：[二叉树的最近公共祖先 (xiaoe-tech.com)](https://appktavsiei5995.pc.xiaoe-tech.com/detail/i_62987959e4b01a4852072fa5/1?from=p_629871eee4b01a48520729f7&type=6&parent_pro_id=)

普通树的做法复杂这里暂不记录。

本文作者以Git利用找到两条不同分支的最近公共祖先来检测两条分支是否存在冲突的。



1. **简单入门：在二叉树中寻找一个元素**

   ```
   struct TreeNode*find(struct TreeNode* root,int val)
   {
   	if(root==NULL) return NULL;
   	if(root->val==val) return root;
   	struct TreeNode* left = find(root->left,val);
   	if(left!=NULL) return left;
   	struct TreeNode* right = find(root->right,val);
   	if(right!=NULL) return right;
   	return NULL;
   }
   ```

   ```
   struct TreeNode*find(struct TreeNode* root,int val)
   {
   	if(root==NULL) return NULL;
   	if(root->val==val) return root;
   	struct TreeNode* left = find(root->left,val);
   	struct TreeNode* right = find(root->right,val);
   	//if(left!=NULL) return left;
   	//if(right!=NULL) return right;
   	//return NULL;
   	return left!=NULL?left:right;//这一步上面的省略但是实际运行的效率会低一些，如果能够在左子树找到目标节点，还有没有必要去右子树找了？没有必要。但这段代码还是会去右子树找一圈，所以效率相对差一些。
   }
   ```

   ```
   struct TreeNode*find(struct TreeNode* root,int val)
   {
   	if(root==NULL) return NULL;
   	struct TreeNode* left = find(root->left,val);
   	struct TreeNode* right = find(root->right,val);
   	if(root->val==val) return root;//把判断放到后面，效率变低，因为即使该节点是目标节点，但仍会找完它的左右子树才能返回
   	return left!=NULL?left:right;
   }
   ```

   之前的解法，在前序位置就检查 `root`，如果输入的二叉树根节点的值恰好就是目标值 `val`，那么函数直接结束了，其他的节点根本不用搜索。

   但如果在后序位置判断，那么就算根节点就是目标节点，你也要去左右子树遍历完所有节点才能判断出来。

   

2. **拓展：尝试寻找到寻找值为 `val1` 或`val2` 的节点**

   ```
   struct TreeNode*find(struct TreeNode* root,int val1,int val2)
   {
   	if(root==NULL) return NULL;
   	if(root->val==val1||root->val==val2) return root;
   	struct TreeNode* left = find(root->left,val);
   	if(left!=NULL) return left;
   	struct TreeNode* right = find(root->right,val);
   	if(right!=NULL) return right;
   	return NULL;
   }
   ```

   

3. [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/) **(p和q节点都一定在树中)**

   ```
   struct TreeNode*find(struct TreeNode* root,int val1,int val2)
   {
   	if(root==NULL) return NULL;
   	if(root->val==val1||root->val==val2) return root;//判断放前面是为了提前返回
   	struct TreeNode* left = find(root->left,val1,val2);
   	struct TreeNode* right = find(root->right,val1,val2);
   	if(left!=NULL&&right!=NULL) return root;//情况一：该节点的左右子树分别各有一个目标节点，则该节点为最近公共祖先
   	if(left!=NULL) return left;//**情况二：1. 左子树只有一个目标节点，另一个目标节点在该节点的祖先节点的右子树上（除它本身） 2.左孩子就是祖先节点（当该节点的右子树无目标节点，如果有就是第一种情况）
   	if(right!=NULL) return right;//**1. 右孩子就是祖先节点（当该节点的左子树无目标节点，如果有就是第一种情况）
   	//这两步放后面是因为要遍历完整棵树才能判断最近公共祖先，
   	return NULL;
   }
   ```

   

4. 

比较可惜是二叉树的最近公共祖先还有不同版本，但无VIP无法提交。
