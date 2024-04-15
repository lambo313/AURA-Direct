import mongoose, { Document } from 'mongoose';

export interface IPlanet extends Document {
    title: string;
    domicile: string[];
    detriment: string[];
    exaltation: string[];
    fall: string[];
    textSymbol: string;
}

const PlanetSchema = new mongoose.Schema<IPlanet>({
    title: {
        type: String,
    },
    domicile: {
        type: [String],
    },
    detriment: {
        type: [String],
    },
    exaltation: {
        type: [String],
    },
    fall: {
        type: [String],
    },
    textSymbol: {
        type: String,
    },
});

const Planet = mongoose.models.Planet || mongoose.model<IPlanet>('Planet', PlanetSchema);

export default Planet;
