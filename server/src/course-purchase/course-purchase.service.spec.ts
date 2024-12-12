import { Test, TestingModule } from '@nestjs/testing';
import { CoursePurchaseService } from './course-purchase.service';

describe('CoursePurchaseService', () => {
  let service: CoursePurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursePurchaseService],
    }).compile();

    service = module.get<CoursePurchaseService>(CoursePurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
