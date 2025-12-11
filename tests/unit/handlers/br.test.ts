import { TextRun } from 'docx';
import { handleBr } from '../../../src/handlers/br.handler';

describe('BR Handler', () => {
  describe('handleBr', () => {
    it('should create a text run with break', async () => {
      const result = await handleBr();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(TextRun);
    });

    it('should always return the same break structure', async () => {
      const result1 = await handleBr();
      const result2 = await handleBr();
      
      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(1);
      expect(result1[0]).toBeInstanceOf(TextRun);
      expect(result2[0]).toBeInstanceOf(TextRun);
    });
  });
});
