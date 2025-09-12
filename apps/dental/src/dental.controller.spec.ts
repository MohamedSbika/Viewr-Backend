import { Test, TestingModule } from '@nestjs/testing';
import { DentalController } from './dental.controller';
import { DentalService } from './dental.service';

describe('DentalController', () => {
  let dentalController: DentalController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DentalController],
      providers: [DentalService],
    }).compile();

    dentalController = app.get<DentalController>(DentalController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dentalController.getHello()).toBe('Hello World!');
    });
  });
});
