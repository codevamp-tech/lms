// company.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company';
import { UpdateCompanyDto } from './dto/update-company';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const createdCompany = new this.companyModel(createCompanyDto);

    return createdCompany.save();
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  // company.service.ts
  async findOne(id: string): Promise<Company> {
    if (!id) {
      throw new Error('No company ID provided');
    }
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async getAllCompanies(
    page: number = 1,
    limit: number = 5,
  ): Promise<{ companies: Company[]; total: number }> {
    const skip = (page - 1) * limit;
    const companies = await this.companyModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.companyModel.countDocuments();
    return { companies, total };
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, { new: true })
      .exec();

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }
    return updatedCompany;
  }

  async remove(id: string): Promise<void> {
    await this.companyModel.deleteOne({ _id: id }).exec();
  }
}
