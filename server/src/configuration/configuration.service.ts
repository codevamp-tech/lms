import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Configuration,
  ConfigurationDocument,
} from './schemas/configuration.schema';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration.name)
    private readonly configModel: Model<ConfigurationDocument>,
  ) {}

  async create(
    createConfigDto: CreateConfigurationDto,
  ): Promise<Configuration> {
    const newConfig = new this.configModel(createConfigDto);
    return newConfig.save();
  }

  async findAll(): Promise<Configuration[]> {
    return this.configModel.find().exec();
  }

  // configuration.service.ts
  async findByCompanyId(companyId: string): Promise<Configuration[]> {
    const configs = await this.configModel
      .find({ company_id: companyId })
      .exec();
    return configs;
  }

  async update(
    id: string,
    updateConfigDto: UpdateConfigurationDto,
  ): Promise<Configuration> {
    const updatedConfig = await this.configModel
      .findByIdAndUpdate(id, updateConfigDto, { new: true })
      .exec();
    if (!updatedConfig) {
      throw new NotFoundException(`Configuration with ID ${id} not found`);
    }
    return updatedConfig;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.configModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Configuration with ID ${id} not found`);
    }
    return { message: 'Configuration deleted successfully' };
  }
}
