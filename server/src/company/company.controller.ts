// company.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company';
import { Company } from './schemas/company.schema';
import { UpdateCompanyDto } from './dto/update-company';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create-company')
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get('all-company')
  async getAllCompanies(): Promise<Company[]> {
    return this.companyService.getAllCompanies();
  }

  @Patch('edit-company/:id') // "id" must match exactly
  update(
    @Param('id') id: string, // Make sure this matches the route
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    console.log('Received ID:', id); // Debugging
    if (!id) {
      throw new BadRequestException('ID parameter is required');
    }
    return this.companyService.update(id, updateCompanyDto);
  }

  @Get()
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.companyService.remove(id);
  }
}
