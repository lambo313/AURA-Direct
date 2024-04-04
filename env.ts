import {z} from 'zod';

const environmentSchema = z.object({
    MONGODB_URI: z.string()
})

const {MONGODB_URI} = process.env;

const parsedResults = environmentSchema.safeParse({
    MONGODB_URI
})

if(!parsedResults.success){
    console.error(parsedResults.error);
    throw new Error("Environment does not match the schema")
}

export const environmentVariables = parsedResults.data;

type EnvVarSchemaType = z.infer<typeof environmentSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvVarSchemaType {}
    }
}