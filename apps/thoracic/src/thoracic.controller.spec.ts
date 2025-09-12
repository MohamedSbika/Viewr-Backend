import { Test, TestingModule } from '@nestjs/testing';
import { ThoracicController } from './thoracic.controller';
import { ThoracicService } from './thoracic.service';

describe('ThoracicController', () => {
  let thoracicController: ThoracicController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ThoracicController],
      providers: [ThoracicService],
    }).compile();

    thoracicController = app.get<ThoracicController>(ThoracicController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(thoracicController.getHello()).toBe('Hello World!');
    });
  });
});
