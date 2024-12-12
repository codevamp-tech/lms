import { Module } from '@nestjs/common';
import { CoursePurchaseService } from './course-purchase.service';
import { CoursePurchaseController } from './course-purchase.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursePurchase, CoursePurchaseSchema } from './schemas/course-purchase.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CoursePurchase.name, schema: CoursePurchaseSchema }]),
  ],
  providers: [CoursePurchaseService],
  controllers: [CoursePurchaseController]
})
export class CoursePurchaseModule {}
