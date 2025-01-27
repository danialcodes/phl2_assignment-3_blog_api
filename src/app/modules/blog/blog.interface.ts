import { Model, Types } from 'mongoose';

export interface IBlog {
    title: string;
    content: string;
    author: Types.ObjectId;
    isPublished: boolean;
}

export interface BlogModel extends Model<IBlog> {
    // eslint-disable-next-line no-unused-vars
    isExists(id: Types.ObjectId | string): Promise<IBlog>;
}
