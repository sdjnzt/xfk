import { getFaceImagePath } from '../utils/imageUtils';

export interface FaceData {
  id: string;
  name: string;
  image: string;
  confidence: number;
  timestamp: string;
  location: string;
  status: 'matched' | 'unmatched' | 'suspicious';
  age: number;
  gender: 'male' | 'female';
}

export const faceData: FaceData[] = [
  {
    id: '1',
    name: '张三',
    image: getFaceImagePath('1.jpg'),
    confidence: 98.5,
    timestamp: '2025-08-28 14:30:25',
    location: '市政府大楼入口',
    status: 'matched',
    age: 35,
    gender: 'female'
  },
  {
    id: '2',
    name: '李四',
    image: getFaceImagePath('2.jpg'),
    confidence: 95.2,
    timestamp: '2025-08-28 14:28:10',
    location: '停车场A区',
    status: 'matched',
    age: 28,
    gender: 'female'
  },
  {
    id: '3',
    name: '王五',
    image: getFaceImagePath('3.jpg'),
    confidence: 87.3,
    timestamp: '2025-08-28 14:25:45',
    location: '办公楼大厅',
    status: 'suspicious',
    age: 42,
    gender: 'male'
  },
  {
    id: '4',
    name: '赵六',
    image: getFaceImagePath('4.jpg'),
    confidence: 92.1,
    timestamp: '2025-08-28 14:22:30',
    location: '会议室走廊',
    status: 'matched',
    age: 31,
    gender: 'male'
  },
  {
    id: '5',
    name: '未知人员',
    image: getFaceImagePath('5.jpg'),
    confidence: 45.6,
    timestamp: '2025-08-28 14:20:15',
    location: '后门区域',
    status: 'unmatched',
    age: 25,
    gender: 'female'
  },
  {
    id: '6',
    name: '陈七',
    image: getFaceImagePath('6.jpg'),
    confidence: 96.8,
    timestamp: '2025-08-28 14:18:50',
    location: '电梯间',
    status: 'matched',
    age: 38,
    gender: 'male'
  },
  {
    id: '7',
    name: '刘八',
    image: getFaceImagePath('7.jpg'),
    confidence: 89.4,
    timestamp: '2025-08-28 14:15:20',
    location: '档案室门口',
    status: 'suspicious',
    age: 45,
    gender: 'male'
  },
  {
    id: '8',
    name: '孙九',
    image: getFaceImagePath('8.jpg'),
    confidence: 94.7,
    timestamp: '2025-08-28 14:12:05',
    location: '食堂入口',
    status: 'matched',
    age: 29,
    gender: 'female'
  }
];

export const getFaceDataByStatus = (status: FaceData['status']) => {
  return faceData.filter(face => face.status === status);
};

export const getFaceDataByLocation = (location: string) => {
  return faceData.filter(face => face.location.includes(location));
};

export const getRecentFaceData = (hours: number = 24) => {
  const now = new Date();
  const timeThreshold = new Date(now.getTime() - hours * 60 * 60 * 1000);
  
  return faceData.filter(face => {
    const faceTime = new Date(face.timestamp);
    return faceTime >= timeThreshold;
  });
}; 