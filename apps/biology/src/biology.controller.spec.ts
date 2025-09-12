import { Test, TestingModule } from '@nestjs/testing';
import { BiologyController } from './biology.controller';
import { BiologyService } from './biology.service';

describe('BiologyController', () => {
  let biologyController: BiologyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BiologyController],
      providers: [BiologyService],
    }).compile();

    biologyController = app.get<BiologyController>(BiologyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(biologyController.getHello()).toBe('Hello World!');
    });
  });
});
