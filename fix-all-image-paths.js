const fs = require('fs');
const path = require('path');

// 需要修复的文件和路径映射
const filesToFix = [
  {
    file: 'src/pages/IntelligentAnalysisPage.tsx',
    patterns: [
      { from: "'/images/face/1.jpg'", to: "getFaceImagePath('1.jpg')" },
      { from: "'/images/face/2.jpg'", to: "getFaceImagePath('2.jpg')" },
      { from: "'/images/face/3.jpg'", to: "getFaceImagePath('3.jpg')" },
      { from: "'/images/face/4.jpg'", to: "getFaceImagePath('4.jpg')" },
      { from: "'/images/face/5.jpg'", to: "getFaceImagePath('5.jpg')" },
      { from: "'/images/face/6.jpg'", to: "getFaceImagePath('6.jpg')" },
      { from: "'/images/face/7.jpg'", to: "getFaceImagePath('7.jpg')" },
      { from: "'/images/face/8.jpg'", to: "getFaceImagePath('8.jpg')" },
      { from: "'/images/face/9.jpg'", to: "getFaceImagePath('9.jpg')" },
      { from: "'/images/face/10.jpg'", to: "getFaceImagePath('10.jpg')" },
      { from: "'/images/face/11.jpg'", to: "getFaceImagePath('11.jpg')" },
      { from: "'/images/face/12.jpg'", to: "getFaceImagePath('12.jpg')" },
      { from: '"/images/face/1.jpg"', to: 'getFaceImagePath("1.jpg")' },
      { from: '"/images/face/2.jpg"', to: 'getFaceImagePath("2.jpg")' },
      { from: '"/images/face/3.jpg"', to: 'getFaceImagePath("3.jpg")' },
      { from: '"/images/face/4.jpg"', to: 'getFaceImagePath("4.jpg")' },
      { from: '"/images/face/5.jpg"', to: 'getFaceImagePath("5.jpg")' },
      { from: '"/images/face/6.jpg"', to: 'getFaceImagePath("6.jpg")' },
      { from: '"/images/face/7.jpg"', to: 'getFaceImagePath("7.jpg")' },
      { from: '"/images/face/8.jpg"', to: 'getFaceImagePath("8.jpg")' },
      { from: '"/images/face/9.jpg"', to: 'getFaceImagePath("9.jpg")' },
      { from: '"/images/face/10.jpg"', to: 'getFaceImagePath("10.jpg")' },
      { from: '"/images/face/11.jpg"', to: 'getFaceImagePath("11.jpg")' },
      { from: '"/images/face/12.jpg"', to: 'getFaceImagePath("12.jpg")' }
    ]
  },
  {
    file: 'src/pages/AutoAlarm.tsx',
    patterns: [
      { from: "'/images/monitor/building.png'", to: "getMonitorImagePath('building.png')" },
      { from: '"/images/monitor/building.png"', to: 'getMonitorImagePath("building.png")' }
    ]
  },
  {
    file: 'src/pages/KeyControl.tsx',
    patterns: [
      { from: "'/images/monitor/building.png'", to: "getMonitorImagePath('building.png')" },
      { from: '"/images/monitor/building.png"', to: 'getMonitorImagePath("building.png")' }
    ]
  },
  {
    file: 'src/pages/MonitorPage.tsx',
    patterns: [
      { from: 'poster="/images/monitor/building.png"', to: 'poster={getMonitorImagePath("building.png")}' },
      { from: 'poster=\'/images/monitor/building.png\'', to: 'poster={getMonitorImagePath(\'building.png\')}' }
    ]
  },
  {
    file: 'src/pages/StatusMonitor.tsx',
    patterns: [
      { from: '`${process.env.PUBLIC_URL}/images/monitor/building.png?t=${Date.now()}`', to: '`${getMonitorImagePath(\'building.png\')}?t=${Date.now()}`' }
    ]
  },
  {
    file: 'src/components/ImageTest.tsx',
    patterns: [
      { from: 'testImagePath(\'/images/face/1.jpg\')', to: 'testImagePath(getFaceImagePath(\'1.jpg\'))' }
    ]
  }
];

// 修复函数
function fixFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 检查是否需要添加导入
  const needsFaceImport = patterns.some(pattern => 
    pattern.to.includes('getFaceImagePath')
  );
  const needsMonitorImport = patterns.some(pattern => 
    pattern.to.includes('getMonitorImagePath')
  );

  if (needsFaceImport && !content.includes('getFaceImagePath')) {
    // 添加getFaceImagePath导入语句
    const importMatch = content.match(/import\s+.*\s+from\s+['"]\.\.\/data\/mockData['"];?/);
    if (importMatch) {
      const newImport = importMatch[0].replace(';', ';\nimport { getFaceImagePath } from \'../utils/imageUtils\';');
      content = content.replace(importMatch[0], newImport);
      modified = true;
      console.log(`✅ 已添加getFaceImagePath导入语句到: ${filePath}`);
    }
  }

  if (needsMonitorImport && !content.includes('getMonitorImagePath')) {
    // 添加getMonitorImagePath导入语句
    const importMatch = content.match(/import\s+.*\s+from\s+['"]\.\.\/data\/mockData['"];?/);
    if (importMatch) {
      const newImport = importMatch[0].replace(';', ';\nimport { getMonitorImagePath } from \'../utils/imageUtils\';');
      content = content.replace(importMatch[0], newImport);
      modified = true;
      console.log(`✅ 已添加getMonitorImagePath导入语句到: ${filePath}`);
    }
  }

  // 替换路径
  patterns.forEach(pattern => {
    if (content.includes(pattern.from)) {
      content = content.replace(new RegExp(pattern.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.to);
      modified = true;
      console.log(`✅ 已修复路径: ${pattern.from} -> ${pattern.to}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已修复文件: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️ 无需修复: ${filePath}`);
    return false;
  }
}

// 主函数
function main() {
  console.log('🔧 开始修复所有硬编码的图片路径...\n');

  let totalFixed = 0;
  let totalFiles = filesToFix.length;

  filesToFix.forEach(({ file, patterns }) => {
    console.log(`📁 处理文件: ${file}`);
    if (fixFile(file, patterns)) {
      totalFixed++;
    }
    console.log('');
  });

  console.log(`🎉 修复完成！`);
  console.log(`📊 统计: ${totalFixed}/${totalFiles} 个文件已修复`);
  
  if (totalFixed > 0) {
    console.log('\n📝 下一步操作:');
    console.log('1. git add .');
    console.log('2. git commit -m "修复所有硬编码图片路径"');
    console.log('3. git push origin main');
  }
}

// 运行脚本
main();
