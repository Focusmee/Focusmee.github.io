const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// 配置
const CONFIG = {
    // GitHub仓库配置
    github: {
        username: 'your-username', // 请修改为您的GitHub用户名
        repo: 'your-username.github.io', // 请修改为您的GitHub仓库名
        branch: 'main'
    },
    
    // 部署配置
    deploy: {
        commitMessage: '🚀 更新博客文章',
        buildCommand: 'node scripts/convert-posts.js',
        cleanBeforeUpload: true
    },
    
    // 忽略文件
    ignoreFiles: [
        'node_modules/',
        '.git/',
        '.vscode/',
        '*.log',
        '.DS_Store',
        'deploy.log'
    ]
};

// 颜色输出
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, colors.green);
}

function logError(message) {
    log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
    log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
    log(`ℹ️  ${message}`, colors.cyan);
}

function logStep(step, message) {
    log(`\n${colors.bold}[步骤 ${step}]${colors.reset} ${colors.blue}${message}${colors.reset}`);
}

// 检查Git状态
async function checkGitStatus() {
    try {
        const { stdout } = await execAsync('git status --porcelain');
        return stdout.trim();
    } catch (error) {
        throw new Error('不是Git仓库或Git命令不可用');
    }
}

// 检查是否有未提交的更改
async function hasUncommittedChanges() {
    const status = await checkGitStatus();
    return status.length > 0;
}

// 转换Markdown文章
async function convertMarkdownFiles() {
    logStep(1, '转换Markdown文章为HTML');
    
    try {
        const { stdout, stderr } = await execAsync('node scripts/convert-posts.js');
        
        if (stderr) {
            logWarning('转换过程中有警告:');
            console.log(stderr);
        }
        
        logSuccess('文章转换完成');
        return true;
        
    } catch (error) {
        logError(`文章转换失败: ${error.message}`);
        return false;
    }
}

// 生成部署统计
function generateDeploymentStats() {
    const statsFile = 'deployment-stats.json';
    const stats = {
        lastDeployment: new Date().toISOString(),
        version: '1.0.0',
        articlesCount: 0,
        categoriesCount: 0,
        deploymentCount: 1
    };
    
    try {
        // 读取现有统计
        if (fs.existsSync(statsFile)) {
            const existingStats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
            stats.deploymentCount = (existingStats.deploymentCount || 0) + 1;
        }
        
        // 统计文章数量
        if (fs.existsSync('posts-list.json')) {
            const postsData = JSON.parse(fs.readFileSync('posts-list.json', 'utf8'));
            stats.articlesCount = postsData.length;
            
            const categories = new Set(postsData.map(post => post.category));
            stats.categoriesCount = categories.size;
        }
        
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
        logInfo(`生成部署统计: ${stats.articlesCount} 篇文章, ${stats.categoriesCount} 个分类`);
        
    } catch (error) {
        logWarning(`生成统计失败: ${error.message}`);
    }
}

// 提交到Git
async function commitToGit() {
    logStep(2, '提交更改到Git仓库');
    
    try {
        // 添加所有更改
        await execAsync('git add .');
        logInfo('已添加所有更改文件');
        
        // 检查是否有更改需要提交
        const hasChanges = await hasUncommittedChanges();
        if (!hasChanges) {
            logInfo('没有更改需要提交');
            return true;
        }
        
        // 提交更改
        const commitMessage = `${CONFIG.deploy.commitMessage} - ${new Date().toLocaleDateString('zh-CN')}`;
        await execAsync(`git commit -m "${commitMessage}"`);
        logSuccess('成功提交更改');
        
        return true;
        
    } catch (error) {
        logError(`Git提交失败: ${error.message}`);
        return false;
    }
}

// 推送到GitHub
async function pushToGitHub() {
    logStep(3, '推送到GitHub');
    
    try {
        const { stdout, stderr } = await execAsync(`git push origin ${CONFIG.github.branch}`);
        
        if (stderr && !stderr.includes('up-to-date')) {
            logWarning('推送过程中有信息:');
            console.log(stderr);
        }
        
        logSuccess('成功推送到GitHub');
        logInfo(`仓库地址: https://github.com/${CONFIG.github.username}/${CONFIG.github.repo}`);
        logInfo(`网站地址: https://${CONFIG.github.username}.github.io/`);
        
        return true;
        
    } catch (error) {
        logError(`推送失败: ${error.message}`);
        logError('请检查:');
        logError('1. GitHub仓库是否存在');
        logError('2. 是否有推送权限');
        logError('3. 网络连接是否正常');
        return false;
    }
}

// 检查配置
function checkConfiguration() {
    logStep(0, '检查配置');
    
    if (CONFIG.github.username === 'your-username') {
        logError('请先在deploy.js中配置您的GitHub用户名');
        return false;
    }
    
    if (CONFIG.github.repo === 'your-username.github.io') {
        logError('请先在deploy.js中配置您的GitHub仓库名');
        return false;
    }
    
    if (!fs.existsSync('_posts')) {
        logError('找不到_posts目录，请确保在正确的项目根目录下运行');
        return false;
    }
    
    if (!fs.existsSync('scripts/convert-posts.js')) {
        logError('找不到convert-posts.js转换脚本');
        return false;
    }
    
    logSuccess('配置检查通过');
    return true;
}

// 清理函数
function cleanup() {
    logInfo('清理临时文件...');
    
    const tempFiles = [
        'deployment.log',
        '.deploy_temp'
    ];
    
    tempFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}

// 显示帮助信息
function showHelp() {
    log(`
${colors.bold}${colors.cyan}博客部署脚本使用说明${colors.reset}

${colors.yellow}使用方法:${colors.reset}
  node scripts/deploy.js [选项]

${colors.yellow}选项:${colors.reset}
  --help, -h     显示帮助信息
  --dry-run      预览模式，不实际部署
  --skip-build   跳过文章转换步骤
  --force        强制部署（忽略Git状态检查）

${colors.yellow}配置说明:${colors.reset}
1. 修改 deploy.js 中的 CONFIG.github 配置
2. 设置正确的 GitHub 用户名和仓库名
3. 确保已经设置了 GitHub SSH 密钥或 HTTPS 认证

${colors.yellow}部署流程:${colors.reset}
1. 检查配置和环境
2. 转换 Markdown 文章为 HTML
3. 提交更改到 Git 仓库
4. 推送到 GitHub
5. 生成部署统计

${colors.yellow}示例:${colors.reset}
  node scripts/deploy.js           # 完整部署
  node scripts/deploy.js --dry-run # 预览模式
`);
}

// 主函数
async function main() {
    const args = process.argv.slice(2);
    
    // 处理帮助参数
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }
    
    const isDryRun = args.includes('--dry-run');
    const skipBuild = args.includes('--skip-build');
    const forceMode = args.includes('--force');
    
    log(`${colors.bold}${colors.cyan}🚀 博客自动部署脚本${colors.reset}`);
    log(`${colors.gray}开始时间: ${new Date().toLocaleString('zh-CN')}${colors.reset}\n`);
    
    if (isDryRun) {
        logWarning('预览模式：不会实际执行部署操作');
    }
    
    try {
        // 检查配置
        if (!checkConfiguration()) {
            process.exit(1);
        }
        
        // 检查Git状态
        if (!forceMode) {
            const status = await checkGitStatus();
            logInfo(`Git状态: ${status ? '有未提交更改' : '工作目录干净'}`);
        }
        
        // 步骤1: 转换文章
        if (!skipBuild) {
            const convertSuccess = isDryRun ? true : await convertMarkdownFiles();
            if (!convertSuccess) {
                process.exit(1);
            }
        } else {
            logInfo('跳过文章转换步骤');
        }
        
        // 生成统计
        if (!isDryRun) {
            generateDeploymentStats();
        }
        
        // 步骤2: Git提交
        const commitSuccess = isDryRun ? true : await commitToGit();
        if (!commitSuccess) {
            process.exit(1);
        }
        
        // 步骤3: 推送到GitHub
        const pushSuccess = isDryRun ? true : await pushToGitHub();
        if (!pushSuccess) {
            process.exit(1);
        }
        
        // 成功完成
        log(`\n${colors.bold}${colors.green}🎉 部署完成！${colors.reset}`);
        
        if (!isDryRun) {
            logSuccess('您的博客已成功部署到GitHub Pages');
            logInfo('通常需要几分钟时间才能看到更新内容');
            logInfo(`访问地址: https://${CONFIG.github.username}.github.io/`);
        }
        
    } catch (error) {
        logError(`部署失败: ${error.message}`);
        process.exit(1);
    } finally {
        cleanup();
        log(`\n${colors.gray}结束时间: ${new Date().toLocaleString('zh-CN')}${colors.reset}`);
    }
}

// 导出配置供其他脚本使用
module.exports = { CONFIG, log, logSuccess, logError, logWarning, logInfo };

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(error => {
        logError(`致命错误: ${error.message}`);
        process.exit(1);
    });
} 