import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from 'src/company/schemas/company.schema';

@Schema({ timestamps: true })
export class Trainer extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: '' })
    phone: string;

    @Prop({ default: '' })
    expertise: string;

    @Prop({ default: '' })
    bio: string;

    @Prop({ default: '' })
    photoUrl: string;

    @Prop({ default: '' })
    experience: string;

    @Prop({ default: '' })
    studentsTaught: string;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Company', default: null })
    companyId: mongoose.Types.ObjectId | Company;
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);
