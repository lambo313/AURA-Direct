import { Schema, model, models, Document } from 'mongoose';
import { ITarotCard } from './TarotCards';

export interface ITarotReadingDocument extends Document {
  userId: string; // Identifier linking the reading to a specific user
  cards: ITarotCard[]; // Array of cards drawn in the reading
  question?: string; // Optional question or intention set by the user for the reading
  response: [];
  readingDate: Date;
}

const TarotReadingSchema = new Schema<ITarotReadingDocument>({
  userId: {
    type: String,
  },
  cards: [{
    type: Schema.Types.ObjectId, 
    ref: 'TarotCard' 
  }],
  question: {
    type: String,
    required: false, 
  },
  response: {
    type: [],
  },
  readingDate: {
    type: Date
  }
});

const TarotReading = models.TarotReading || model('TarotReading', TarotReadingSchema);

export default TarotReading;
