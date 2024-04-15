import mongoose, { Document } from 'mongoose';

export interface IElement extends Document {
    title: string;
    qualities: string[];
    strength: string;
    weakness: string;
    balance: string;
    gender: string;
    godsName: string;
    soul: string;
    world: string;
    biology: string;
    chemistry: string;
    description: string;
    humanRelation: string;
    physics: string;
    textSymbol: string;
}

const ElementSchema = new mongoose.Schema<IElement>({
    title: {
        type: String,
    },
    qualities: {
        type: [String],
    },
    strength: {
        type: String,
    },
    weakness: {
        type: String,
    },
    balance: {
        type: String,
    },
    gender: {
        type: String,
    },
    godsName: {
        type: String,
    },
    soul: {
        type: String,
    },
    world: {
        type: String,
    },
    biology: {
        type: String,
    },
    chemistry: {
        type: String,
    },
    description: {
        type: String,
    },
    humanRelation: {
        type: String,
    },
    physics: {
        type: String,
    },
    textSymbol: {
        type: String,
    },
});

const Element = mongoose.models.Element || mongoose.model<IElement>('Element', ElementSchema);

export default Element;
