/**
 * 获取公共资源路径
 * @param path 相对于public文件夹的路径
 * @returns 完整的资源路径
 */
export const getPublicPath = (path: string): string => {
  return `${process.env.PUBLIC_URL}${path}`;
};

/**
 * 获取监控视频路径
 * @param filename 文件名（如：1.mp4）
 * @returns 完整的监控视频路径
 */
export const getMonitorVideoPath = (filename: string): string => {
  return getPublicPath(`/images/jiankong/${filename}`);
};

/**
 * 获取默认监控视频路径
 * @returns 默认监控视频路径
 */
export const getDefaultMonitorVideo = (): string => {
  return getMonitorVideoPath('1.mp4');
};

/**
 * 获取监控图片路径（备用）
 * @param filename 文件名（如：building.png）
 * @returns 完整的监控图片路径
 */
export const getMonitorImagePath = (filename: string): string => {
  return getPublicPath(`/images/monitor/${filename}`);
}; 