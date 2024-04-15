import mongoose, { Schema, Document } from 'mongoose';

export interface IZodiac extends Document {
    title: string;
    modality: string;
    element: string;
    motto: string;
    symbol: string;
    house: string;
    bodyPart: string;
    textSymbol: string;
}

const ZodiacSchema = new mongoose.Schema<IZodiac>({
    title: {
        type: String,
    },
    modality: {
        type: String,
    },
    element: {
        type: String,
    },
    motto: {
        type: String,
    },
    symbol: {
        type: String,
    },
    house: {
        type: String,
    },
    bodyPart: {
        type: String,
    },
    textSymbol: {
        type: String,
    },
});

const Zodiac = mongoose.models.Zodiac || mongoose.model<IZodiac>('Zodiac', ZodiacSchema);

export default Zodiac;
