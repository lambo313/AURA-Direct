import mongoose , { Schema, Document } from 'mongoose';

export interface ITarotCard extends Document {
    title: string;
    cardImage: string;
    cardDescription: string;
    arcana: string;
    uprightEffect: string;
    reversedEffect: string;
    kabalism: { [key: string]: Object[] };
    astroPower: { [key: string]: Object[] }; // Define astroPower as an object containing an array of ObjectIds
    divinatoryMeaning: string[];
}

const TarotCardSchema = new mongoose.Schema<ITarotCard>({
    title: {
        type: String,
    },
    cardImage: {
        type: String,
    },
    cardDescription: {
        type: String,
    },
    arcana: {
        type: String,
    },
    uprightEffect: {
        type: String,
    },
    reversedEffect: {
        type: String,
    },
    kabalism: {
        type: Object,
    },
    astroPower: {
        type: Object, 
    },
    divinatoryMeaning: {
        type: [String],
    },
});


const TarotCard =  mongoose.models.TarotCard || mongoose.model('TarotCard', TarotCardSchema)

export default TarotCard;
