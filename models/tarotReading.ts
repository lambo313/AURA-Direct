import { Schema, model, models, Document } from 'mongoose';
import { ITarotCard } from './TarotCards';

export interface ITarotReadingDocument extends Document {
  userId: string; // Identifier linking the reading to a specific user
  cards: ITarotCard[]; // Array of cards drawn in the reading
  response: { role: string; content: any }[];
  spread: string;
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
  response: [{
    role: String,
    content: Schema.Types.Mixed, 
  }],
  spread: {
    type: String,
  },
  readingDate: {
    type: Date
  }
});

const TarotReading = models.TarotReading || model('TarotReading', TarotReadingSchema);

export default TarotReading;
