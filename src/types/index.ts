// export type { User, UserRole } from './api/index';
export type * from './store/index.d.ts';
export type * from './chat/index.d.ts';
// export type { ButtonProps, InputProps } from './setting/index';
export type * from './user/index.d.ts';

// 直接在 index.ts 中定义通用类型
export interface CommonResponse<T> {
    code: number;
    message: string;
    data: T;
}