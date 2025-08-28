/**
 * 获取公共资源路径
 * @param path 相对于public文件夹的路径
 * @returns 完整的资源路径
 */
export const getPublicPath = (path: string): string => {
  return `${process.env.PUBLIC_URL}${path}`;
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