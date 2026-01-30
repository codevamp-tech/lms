import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Controller('enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) { }

  @Post()
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiryService.create(createEnquiryDto);
  }

  @Get()
  findAll() {
    return this.enquiryService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'inprocess' | 'done',
  ) {
    return this.enquiryService.updateStatus(id, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enquiryService.findOne(id);
  }
}
