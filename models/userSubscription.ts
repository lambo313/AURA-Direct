import { Schema, model, models, Document, SchemaTypes } from 'mongoose';

interface IUserSubscription extends Document{
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
}


const UserSubscriptionSchema = new Schema<IUserSubscription>({
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
