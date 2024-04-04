import { Schema, model, models, Document, SchemaTypes } from 'mongoose';

interface IUserSubscription extends Document{
  id: string;
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
}


const UserSubscriptionSchema = new Schema<IUserSubscription>({
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
  stripeCustomerId: {
    type: String,
    unique: [true, 'StripeCustomerId already exists!'],
  },
  stripeSubscriptionId: {
    type: String,
    unique: [true, 'StripeSubscriptionId already exists!'],
  },
  stripePriceId: {
    type: String,
  },
  stripeCurrentPeriodEnd: {
    type: Date,
  },
});

const UserSubscription = models.UserSubscription || model('UserSubscription', UserSubscriptionSchema);

export default UserSubscription;
