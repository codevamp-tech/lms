import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Body,
    Param,
    Query,
    Headers,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Controller('trainers')
export class TrainersController {
    constructor(private readonly trainersService: TrainersService) { }

    @Post()
    async create(@Body() createTrainerDto: CreateTrainerDto) {
        return this.trainersService.create(createTrainerDto);
    }

    @Get('active')
    async findActive() {
        return this.trainersService.findActive();
    }

    @Get()
    async findAll(
        @Headers('Authorization') auth: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const companyId = auth ? auth.split(' ')[1] : undefined;
        return this.trainersService.findAll(companyId, Number(page), Number(limit));
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.trainersService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTrainerDto: UpdateTrainerDto,
    ) {
        return this.trainersService.update(id, updateTrainerDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.trainersService.delete(id);
    }

    @Patch(':id/toggle-status')
    async toggleStatus(@Param('id') id: string) {
        return this.trainersService.toggleStatus(id);
    }
}
