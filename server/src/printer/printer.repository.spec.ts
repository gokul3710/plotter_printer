import { PrinterRepository } from './printer.repository';

describe('Printer', () => {
  it('should be defined', () => {
    expect(new PrinterRepository()).toBeDefined();
  });
});
