import { Test, TestingModule } from '@nestjs/testing';
import { CoursePurchaseController } from './course-purchase.controller';

describe('CoursePurchaseController', () => {
  let controller: CoursePurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursePurchaseController],
    }).compile();

    controller = module.get<CoursePurchaseController>(CoursePurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
