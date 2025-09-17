import { describe, expect, it } from 'vitest';
import PaginationUtils from '@/utils/core/pagination.utils';

describe('PaginationUtils', () => {
  describe('validatePaginationParams', () => {
    it('deve validar parâmetros de paginação válidos', () => {
      const result = PaginationUtils.validatePaginationParams(2, 15);

      expect(result).toEqual({
        page: 2,
        limit: 15,
        maxLimit: 100,
      });
    });

    it('deve corrigir página para mínimo de 1', () => {
      const result = PaginationUtils.validatePaginationParams(0, 10);

      expect(result.page).toBe(1);
    });

    it('deve corrigir página negativa para 1', () => {
      const result = PaginationUtils.validatePaginationParams(-5, 10);

      expect(result.page).toBe(1);
    });

    it('deve corrigir limite para mínimo de 1', () => {
      const result = PaginationUtils.validatePaginationParams(1, 0);

      expect(result.limit).toBe(1);
    });

    it('deve corrigir limite negativo para 1', () => {
      const result = PaginationUtils.validatePaginationParams(1, -10);

      expect(result.limit).toBe(1);
    });

    it('deve limitar ao máximo padrão de 100', () => {
      const result = PaginationUtils.validatePaginationParams(1, 150);

      expect(result.limit).toBe(100);
    });

    it('deve respeitar maxLimit customizado', () => {
      const result = PaginationUtils.validatePaginationParams(1, 60, 50);

      expect(result.limit).toBe(50);
      expect(result.maxLimit).toBe(50);
    });

    it('deve converter números decimais para inteiros', () => {
      const result = PaginationUtils.validatePaginationParams(2.7, 15.9);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(15);
    });
  });

  describe('calculateOffset', () => {
    it('deve calcular offset corretamente para primeira página', () => {
      const offset = PaginationUtils.calculateOffset(1, 10);

      expect(offset).toBe(0);
    });

    it('deve calcular offset corretamente para segunda página', () => {
      const offset = PaginationUtils.calculateOffset(2, 10);

      expect(offset).toBe(10);
    });

    it('deve calcular offset corretamente para página qualquer', () => {
      const offset = PaginationUtils.calculateOffset(5, 20);

      expect(offset).toBe(80);
    });

    it('deve calcular offset corretamente com limite customizado', () => {
      const offset = PaginationUtils.calculateOffset(3, 7);

      expect(offset).toBe(14);
    });
  });

  describe('createPaginationMeta', () => {
    it('deve criar metadados de paginação corretamente', () => {
      const meta = PaginationUtils.createPaginationMeta(1, 10, 25);

      expect(meta).toEqual({
        currentPage: 1,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('deve indicar hasNextPage como false na última página', () => {
      const meta = PaginationUtils.createPaginationMeta(3, 10, 25);

      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPreviousPage).toBe(true);
    });

    it('deve indicar hasPreviousPage como false na primeira página', () => {
      const meta = PaginationUtils.createPaginationMeta(1, 10, 25);

      expect(meta.hasPreviousPage).toBe(false);
      expect(meta.hasNextPage).toBe(true);
    });

    it('deve calcular páginas corretamente quando totalItems é exato múltiplo', () => {
      const meta = PaginationUtils.createPaginationMeta(2, 10, 20);

      expect(meta.totalPages).toBe(2);
      expect(meta.hasNextPage).toBe(false);
    });

    it('deve calcular páginas corretamente com apenas um item', () => {
      const meta = PaginationUtils.createPaginationMeta(1, 10, 1);

      expect(meta.totalPages).toBe(1);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPreviousPage).toBe(false);
    });

    it('deve calcular páginas corretamente com zero itens', () => {
      const meta = PaginationUtils.createPaginationMeta(1, 10, 0);

      expect(meta.totalPages).toBe(0);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPreviousPage).toBe(false);
    });

    it('deve lidar com página além do total de páginas', () => {
      const meta = PaginationUtils.createPaginationMeta(5, 10, 25);

      expect(meta.currentPage).toBe(5);
      expect(meta.totalPages).toBe(3);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPreviousPage).toBe(true);
    });
  });
});
