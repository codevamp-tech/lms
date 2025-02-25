import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import {
  Configuration,
  ConfigurationSchema,
} from './schemas/configuration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Configuration.name, schema: ConfigurationSchema },
    ]), // ✅ Ensure this line is present
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService], // ✅ Export if used in other modules
})
export class ConfigurationModule {}
