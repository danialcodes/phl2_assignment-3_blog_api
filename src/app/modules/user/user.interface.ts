import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.const';

export interface IUser {
    _id?: string | Types.ObjectId;
    name: string;
    email: string;
    password: string;
    passwordChangeAt?: Date;
    isBlocked: boolean;
    role: 'admin' | 'user';
}

/* eslint-disable no-unused-vars */

export interface UserModel extends Model<IUser> {
    isExists(id: string | Types.ObjectId): Promise<IUser>;
    blockUser(id: string | Types.ObjectId): Promise<IUser>;
    unblockUser(id: string | Types.ObjectId): Promise<IUser>;
    isExistsByEmail(email: string): Promise<IUser>;
    isPasswordMatched(
        planePassword: string,
        hashedPassword: string,
    ): Promise<IUser>;
    hashThePassword(password: string): Promise<string>;
    isJWTExpired(jwtIssuedTimestamp: number, passwordChangeAt: Date): boolean;
}

export type IUserRole = keyof typeof USER_ROLE;
