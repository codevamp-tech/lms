import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatBuddyService } from './chat-buddy.service';
import { CreateChatBuddyDto } from './dto/create-chat-buudy';
import { UpdateChatBuddyDto } from './dto/update-chat-buddy.dto';

@Controller('chat-buddy')
export class ChatBuddyController {
  constructor(private readonly chatBuddyService: ChatBuddyService) { }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() dto: CreateChatBuddyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.chatBuddyService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.chatBuddyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatBuddyService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChatBuddyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.chatBuddyService.update(id, dto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatBuddyService.remove(id);
  }
}
