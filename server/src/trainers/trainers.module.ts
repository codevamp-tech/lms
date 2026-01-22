import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { Trainer, TrainerSchema } from './schemas/trainer.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Trainer.name, schema: TrainerSchema }]),
    ],
    controllers: [TrainersController],
    providers: [TrainersService],
    exports: [TrainersService],
})
export class TrainersModule { }
