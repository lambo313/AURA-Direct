import { Schema, model, models, Document, SchemaTypes } from 'mongoose';

interface IUserApiLimit extends Document {
  userId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserApiLimitSchema = new Schema<IUserApiLimit>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserApiLimit = models.UserApiLimit || model('UserApiLimit', UserApiLimitSchema);

export default UserApiLimit;
