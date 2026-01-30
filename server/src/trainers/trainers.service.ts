import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trainer } from './schemas/trainer.schema';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainersService {
    constructor(@InjectModel(Trainer.name) private trainerModel: Model<Trainer>) { }

    async create(createTrainerDto: CreateTrainerDto) {
        try {
            // Check if email already exists
            const existingTrainer = await this.trainerModel.findOne({
                email: createTrainerDto.email,
            });

            if (existingTrainer) {
                throw new BadRequestException('Email is already registered');
            }

            const newTrainer = new this.trainerModel(createTrainerDto);

            if (createTrainerDto.companyId) {
                newTrainer.companyId = new Types.ObjectId(createTrainerDto.companyId);
            }

            const savedTrainer = await newTrainer.save();

            return {
                success: true,
                message: 'Trainer created successfully',
                trainer: savedTrainer,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error creating trainer:', error);
            throw new Error('Failed to create trainer');
        }
    }

    async findAll(companyId?: string, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const filter: any = {};
            if (companyId) {
                if (Types.ObjectId.isValid(companyId)) {
                    filter.$or = [
                        { companyId: new Types.ObjectId(companyId) },
                        { companyId: companyId },
                    ];
                } else {
                    filter.companyId = companyId;
                }
            }

            const trainers = await this.trainerModel
                .find(filter)
                .populate('companyId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalTrainers = await this.trainerModel.countDocuments(filter);

            return {
                success: true,
                trainers,
                totalPages: Math.ceil(totalTrainers / limit) || 1,
                currentPage: page,
                totalTrainers,
            };
        } catch (error) {
            console.error('Error fetching trainers:', error);
            throw new Error('Failed to fetch trainers');
        }
    }

    async findActive() {
        try {
            const trainers = await this.trainerModel
                .find({ isActive: true })
                .populate('companyId')
                .sort({ createdAt: -1 })
                .lean();

            return {
                success: true,
                trainers,
            };
        } catch (error) {
            console.error('Error fetching active trainers:', error);
            throw new Error('Failed to fetch active trainers');
        }
    }

    async findOne(id: string) {
        try {
            const trainer = await this.trainerModel
                .findById(id)
                .populate('companyId')
                .lean();

            if (!trainer) {
                throw new NotFoundException('Trainer not found');
            }

            return {
                success: true,
                trainer,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error fetching trainer:', error);
            throw new Error('Failed to fetch trainer');
        }
    }

    async update(id: string, updateTrainerDto: UpdateTrainerDto) {
        try {
            const trainer = await this.trainerModel.findById(id);
            if (!trainer) {
                throw new NotFoundException('Trainer not found');
            }

            // Check email uniqueness if email is being updated
            if (updateTrainerDto.email && updateTrainerDto.email !== trainer.email) {
                const existingTrainer = await this.trainerModel.findOne({
                    email: updateTrainerDto.email,
                });
                if (existingTrainer) {
                    throw new BadRequestException('Email is already registered');
                }
            }

            const updatedTrainer = await this.trainerModel
                .findByIdAndUpdate(id, updateTrainerDto, { new: true })
                .populate('companyId')
                .lean();

            return {
                success: true,
                message: 'Trainer updated successfully',
                trainer: updatedTrainer,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error updating trainer:', error);
            throw new Error('Failed to update trainer');
        }
    }

    async delete(id: string) {
        try {
            const trainer = await this.trainerModel.findById(id);
            if (!trainer) {
                throw new NotFoundException('Trainer not found');
            }

            await this.trainerModel.findByIdAndDelete(id);

            return {
                success: true,
                message: 'Trainer deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error deleting trainer:', error);
            throw new Error('Failed to delete trainer');
        }
    }

    async toggleStatus(id: string) {
        try {
            const trainer = await this.trainerModel.findById(id);
            if (!trainer) {
                throw new NotFoundException('Trainer not found');
            }

            const updatedTrainer = await this.trainerModel
                .findByIdAndUpdate(id, { isActive: !trainer.isActive }, { new: true })
                .lean();

            if (!updatedTrainer) {
                throw new NotFoundException('Trainer not found after update');
            }

            return {
                success: true,
                message: `Trainer is now ${updatedTrainer.isActive ? 'Active' : 'Inactive'}`,
                trainer: updatedTrainer,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error toggling trainer status:', error);
            throw new Error('Failed to toggle trainer status');
        }
    }
}
