import { model, Schema, Types } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
const userSchema = new Schema<IUser, UserModel>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        passwordChangeAt: {
            type: Date,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

userSchema.statics.isExists = function (id: string | Types.ObjectId) {
    return this.findById({ _id: id });
};

userSchema.statics.isExistsByEmail = function (email: string) {
    return this.findOne({ email }).select('+password');
};

userSchema.statics.blockUser = function (id: string | Types.ObjectId) {
    return this.findByIdAndUpdate(
        { _id: id },
        {
            isBlocked: true,
        },
    );
};
userSchema.statics.unblockUser = function (id: string | Types.ObjectId) {
    return this.findByIdAndUpdate(
        { _id: id },
        {
            isBlocked: false,
        },
    );
};

userSchema.statics.hashThePassword = async function (password: string) {
    return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

userSchema.statics.isPasswordMatched = async function (
    planePassword,
    hashedPassword,
) {
    return await bcrypt.compare(planePassword, hashedPassword);
};

userSchema.statics.isJWTExpired = function (
    jwtIssuedTimestamp: number,
    passwordChangeAt: Date,
) {
    const passwordChangeAtTimeStamp =
        new Date(passwordChangeAt).getTime() / 1000;
    if (jwtIssuedTimestamp < passwordChangeAtTimeStamp) {
        return true;
    }
};
export const User = model<IUser, UserModel>('User', userSchema);
