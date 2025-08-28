/**
 * 获取公共资源路径
 * @param path 相对于public文件夹的路径
 * @returns 完整的资源路径
 */
export const getPublicPath = (path: string): string => {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 直接使用硬编码的GitHub Pages路径
  // 这样可以确保在GitHub Pages上图片能正确加载
  return `https://sdjnzt.github.io/xfk${normalizedPath}`;
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
 * 备用图片路径获取函数（用于调试）
 * @param path 图片路径
 * @returns 图片路径数组（包含多种可能的路径）
 */
export const getImagePaths = (path: string): string[] => {
  const basePath = path.startsWith('/') ? path : `/${path}`;
  
  return [
    `https://sdjnzt.github.io/xfk${basePath}`, // 硬编码完整路径（主要）
    `${process.env.PUBLIC_URL || ''}${basePath}`, // PUBLIC_URL路径（备用）
    basePath, // 相对路径（备用）
  ];
}; 