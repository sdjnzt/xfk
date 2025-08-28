/**
 * 获取公共资源路径 - 彻底修复版本
 * @param path 相对于public文件夹的路径
 * @returns 完整的资源路径
 */
export const getPublicPath = (path: string): string => {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 方法1: 硬编码GitHub Pages完整路径（主要方案）
  const githubPagesPath = `https://sdjnzt.github.io/xfk${normalizedPath}`;
  
  // 方法2: 使用PUBLIC_URL（备用方案）
  const publicUrlPath = `${process.env.PUBLIC_URL || ''}${normalizedPath}`;
  
  // 方法3: 相对路径（本地开发备用）
  const relativePath = normalizedPath;
  
  // 调试信息
  console.log('🔍 图片路径调试:', {
    originalPath: path,
    normalizedPath,
    githubPagesPath,
    publicUrlPath,
    relativePath,
    PUBLIC_URL: process.env.PUBLIC_URL,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
  });
  
  // 优先返回GitHub Pages路径
  return githubPagesPath;
};

/**
 * 获取人脸图片路径
 * @param filename 文件名（如：1.jpg）
 * @returns 完整的人脸图片路径
 */
export const getFaceImagePath = (filename: string): string => {
  return getPublicPath(`/images/face/${filename}`);
};

/**
 * 获取监控图片路径
 * @param filename 文件名（如：building.png）
 * @returns 完整的监控图片路径
 */
export const getMonitorImagePath = (filename: string): string => {
  return getPublicPath(`/images/monitor/${filename}`);
};

/**
 * 获取视频文件路径
 * @param filename 文件名（如：1.mp4）
 * @returns 完整的视频文件路径
 */
export const getVideoPath = (filename: string): string => {
  return getPublicPath(`/images/jiankong/${filename}`);
};

/**
 * 获取图片的多种可能路径（用于调试和备用）
 * @param path 图片路径
 * @returns 图片路径数组
 */
export const getImagePaths = (path: string): string[] => {
  const basePath = path.startsWith('/') ? path : `/${path}`;
  
  return [
    // 主要路径：硬编码GitHub Pages完整路径
    `https://sdjnzt.github.io/xfk${basePath}`,
    // 备用路径1：PUBLIC_URL路径
    `${process.env.PUBLIC_URL || ''}${basePath}`,
    // 备用路径2：相对路径
    basePath,
    // 备用路径3：绝对路径
    `https://sdjnzt.github.io${basePath}`,
  ];
};

/**
 * 强制刷新图片（清除缓存）
 * @param imgElement 图片元素
 */
export const forceRefreshImage = (imgElement: HTMLImageElement): void => {
  if (imgElement.src) {
    const originalSrc = imgElement.src;
    imgElement.src = '';
    setTimeout(() => {
      imgElement.src = originalSrc + '?t=' + Date.now();
    }, 100);
  }
};

/**
 * 创建图片加载错误处理
 * @param imgSrc 图片源路径
 * @param fallbackSrc 备用图片路径
 * @returns 错误处理函数
 */
export const createImageErrorHandler = (imgSrc: string, fallbackSrc?: string) => {
  return (event: Event) => {
    const img = event.target as HTMLImageElement;
    console.error(`❌ 图片加载失败: ${imgSrc}`);
    
    if (fallbackSrc) {
      console.log(`🔄 尝试备用路径: ${fallbackSrc}`);
      img.src = fallbackSrc;
    }
  };
}; 