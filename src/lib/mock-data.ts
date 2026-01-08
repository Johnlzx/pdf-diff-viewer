import { PDFGroup } from './types';

const colors = {
  groupA: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  groupB: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  groupC: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7', '#FFFBEB'],
};

export const initialGroups: PDFGroup[] = [
  {
    id: 'group-a',
    name: 'Passport',
    status: 'ready',
    pages: Array.from({ length: 5 }, (_, i) => ({
      id: `group-a-page-${i + 1}`,
      pageNumber: i + 1,
      thumbnail: `https://placehold.co/210x297/${colors.groupA[i].slice(1)}/ffffff?text=A-${i + 1}`,
      color: colors.groupA[i],
    })),
  },
  {
    id: 'group-b',
    name: 'Bank statement',
    status: 'pending review',
    pages: Array.from({ length: 4 }, (_, i) => ({
      id: `group-b-page-${i + 1}`,
      pageNumber: i + 1,
      thumbnail: `https://placehold.co/210x297/${colors.groupB[i].slice(1)}/ffffff?text=B-${i + 1}`,
      color: colors.groupB[i],
    })),
  },
  {
    id: 'group-c',
    name: 'Utility Bill',
    status: 'ready',
    pages: Array.from({ length: 6 }, (_, i) => ({
      id: `group-c-page-${i + 1}`,
      pageNumber: i + 1,
      thumbnail: `https://placehold.co/210x297/${colors.groupC[i].slice(1)}/333333?text=C-${i + 1}`,
      color: colors.groupC[i],
    })),
  },
];
