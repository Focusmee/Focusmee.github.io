const fs = require('fs-extra');
const path = require('path');

async function clean() {
    console.log('🧹 开始清理...');
    
    try {
        // 清理posts目录中的生成文件（保留_posts目录）
        const postsDir = 'posts';
        const files = await fs.readdir(postsDir);
        
        for (const file of files) {
            if (file.endsWith('.html') && file !== 'index.html') {
                const filePath = path.join(postsDir, file);
                await fs.remove(filePath);
                console.log(`🗑️  删除: ${filePath}`);
            }
        }
        
        console.log('✅ 清理完成');
    } catch (error) {
        console.error('❌ 清理失败:', error);
    }
}

if (require.main === module) {
    clean();
}

module.exports = { clean }; 