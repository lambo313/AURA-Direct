import { Schema, model, models, Document, SchemaTypes } from 'mongoose';

interface IUserApiLimit extends Document {
  id: string;
  userId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserApiLimitSchema = new Schema<IUserApiLimit>({
  id: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
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
