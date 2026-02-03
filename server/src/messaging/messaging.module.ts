import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WatiService } from './wati.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [WatiService],
    exports: [WatiService],
})
export class MessagingModule { }
