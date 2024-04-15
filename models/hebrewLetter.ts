import mongoose, { Document } from 'mongoose';

export interface IHebrewLetter extends Document {
    title: string;
    value: number;
    letterType: string;
    meaning: string[];
    pronunciation: string;
    hebrewLetter: string;
}

const HebrewLetterSchema = new mongoose.Schema<IHebrewLetter>({
    title: {
        type: String,
    },
    value: {
        type: Number,
    },
    letterType: {
        type: String,
    },
    meaning: {
        type: [String],
    },
    pronunciation: {
        type: String,
    },
    hebrewLetter: {
        type: String,
    },
});

const HebrewLetter = mongoose.models.HebrewLetter || mongoose.model<IHebrewLetter>('HebrewLetter', HebrewLetterSchema);

export default HebrewLetter;
