import { PartialType } from '@nestjs/mapped-types';
import { CreateChatBuddyDto } from './create-chat-buudy';

export class UpdateChatBuddyDto extends PartialType(CreateChatBuddyDto) { }
