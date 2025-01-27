import { Schema, Types, model } from 'mongoose';
import { BlogModel, IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

blogSchema.static('isExists', function (id: string | Types.ObjectId) {
    return this.findById(id);
});

export const Blog = model<IBlog, BlogModel>('Blog', blogSchema);
