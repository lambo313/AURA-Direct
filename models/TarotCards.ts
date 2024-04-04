import mongoose , { Schema, Document } from 'mongoose';

type ObjectId = string;

export interface ITarotCard extends Document {
    _id: ObjectId
    title: string;
    cardImage: string;
    cardDescription: string;
    arcana: string;
    uprightEffect: string;
    reversedEffect: string;
    hebrewLetter: string;
    astroPower: { [key: string]: ObjectId[] }; // Define astroPower as an object containing an array of ObjectIds
    treeOfLifePath: string;
    divinatoryMeaning: string[];
}

const TarotCardSchema = new mongoose.Schema<ITarotCard>({
    _id: {
        type: String,
    },
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
    hebrewLetter: {
        type: String,
    },
    astroPower: {
        type: Object, 
    },
    treeOfLifePath: {
        type: String,
    },
    divinatoryMeaning: {
        type: [String],
    },
});


const TarotCard =  mongoose.models.TarotCard || mongoose.model('TarotCard', TarotCardSchema)

export default TarotCard;
