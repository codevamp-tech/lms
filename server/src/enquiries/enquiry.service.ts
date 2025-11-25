import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectModel(Enquiry.name) private readonly enquiryModel: Model<EnquiryDocument>,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {
    const created = new this.enquiryModel(createEnquiryDto);
    return created.save();
  }

  async findAll(): Promise<Enquiry[]> {
    return this.enquiryModel.find().exec();
  }

  async findOne(id: string): Promise<Enquiry> {
    const doc = await this.enquiryModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Enquiry with id ${id} not found`);
    }
    return doc.toObject() as Enquiry;
  }
}
