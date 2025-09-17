import { describe, expect, it } from 'vitest';
import { paginationQuerySchema } from '@/validations/core/pagination.validations';
import { categoryPaginationSchema } from '@/validations/v1/modules/category.validations';

describe('Pagination Validations', () => {
  describe('paginationQuerySchema', () => {
    it('deve validar parâmetros válidos', () => {
      const result = paginationQuerySchema.parse({
        page: '2',
        limit: '15',
      });

      expect(result).toEqual({
        page: 2,
        limit: 15,
      });
    });

    it('deve usar valores padrão quando não fornecidos', () => {
      const result = paginationQuerySchema.parse({});

      expect(result).toEqual({
        page: 1,
        limit: 10,
      });
    });

    it('deve usar valor padrão para page quando não fornecido', () => {
      const result = paginationQuerySchema.parse({
        limit: '20',
      });

      expect(result).toEqual({
        page: 1,
        limit: 20,
      });
    });

    it('deve usar valor padrão para limit quando não fornecido', () => {
      const result = paginationQuerySchema.parse({
        page: '3',
      });

      expect(result).toEqual({
        page: 3,
        limit: 10,
      });
    });

    it('deve converter strings numéricas válidas', () => {
      const result = paginationQuerySchema.parse({
        page: '5',
        limit: '25',
      });

      expect(result).toEqual({
        page: 5,
        limit: 25,
      });
    });

    it('deve rejeitar página menor que 1', () => {
      expect(() => {
        paginationQuerySchema.parse({
          page: '0',
          limit: '10',
        });
      }).toThrow('Página deve ser maior ou igual a 1');
    });

    it('deve rejeitar página negativa', () => {
      expect(() => {
        paginationQuerySchema.parse({
          page: '-1',
          limit: '10',
        });
      }).toThrow('Página deve ser maior ou igual a 1');
    });

    it('deve rejeitar limite menor que 1', () => {
      expect(() => {
        paginationQuerySchema.parse({
          page: '1',
          limit: '0',
        });
      }).toThrow('Limite deve estar entre 1 e 100');
    });

    it('deve rejeitar limite maior que 100', () => {
      expect(() => {
        paginationQuerySchema.parse({
          page: '1',
          limit: '101',
        });
      }).toThrow('Limite deve estar entre 1 e 100');
    });

    it('deve rejeitar strings não numéricas para page', () => {
      expect(() => {
        paginationQuerySchema.parse({
          page: 'abc',
          limit: '10',
        });
      }).toThrow();
    });

    it('deve rejeitar strings não numéricas para limit', () => {
      expect(() => {
        paginationQuerySchema.parse({
          page: '1',
          limit: 'xyz',
        });
      }).toThrow();
    });

    it('deve aceitar limite no limite máximo (100)', () => {
      const result = paginationQuerySchema.parse({
        page: '1',
        limit: '100',
      });

      expect(result).toEqual({
        page: 1,
        limit: 100,
      });
    });

    it('deve aceitar limite no limite mínimo (1)', () => {
      const result = paginationQuerySchema.parse({
        page: '1',
        limit: '1',
      });

      expect(result).toEqual({
        page: 1,
        limit: 1,
      });
    });

    it('deve lidar com números decimais convertendo para inteiros', () => {
      const result = paginationQuerySchema.parse({
        page: '2.7',
        limit: '15.9',
      });

      expect(result).toEqual({
        page: 2,
        limit: 15,
      });
    });
  });
});

describe('Category Pagination Validations', () => {

  describe('categoryPaginationSchema', () => {
    it('deve validar parâmetros com perPage', () => {
      const result = categoryPaginationSchema.parse({
        query: {
          page: '2',
          limit: '10',
          perPage: '15',
        },
      });

      expect(result.query).toEqual({
        page: 2,
        limit: 10,
        perPage: 15,
      });
    });

    it('deve usar limit quando perPage não é fornecido', () => {
      const result = categoryPaginationSchema.parse({
        query: {
          page: '1',
          limit: '20',
        },
      });

      expect(result.query).toEqual({
        page: 1,
        limit: 20,
        perPage: undefined,
      });
    });

    it('deve rejeitar perPage maior que 100', () => {
      expect(() => {
        categoryPaginationSchema.parse({
          query: {
            page: '1',
            limit: '10',
            perPage: '150',
          },
        });
      }).toThrow('PerPage deve estar entre 1 e 100');
    });

    it('deve rejeitar perPage menor que 1', () => {
      expect(() => {
        categoryPaginationSchema.parse({
          query: {
            page: '1',
            limit: '10',
            perPage: '0',
          },
        });
      }).toThrow('PerPage deve estar entre 1 e 100');
    });

    it('deve aceitar perPage no limite máximo (100)', () => {
      const result = categoryPaginationSchema.parse({
        query: {
          page: '1',
          limit: '10',
          perPage: '100',
        },
      });

      expect(result.query.perPage).toBe(100);
    });

    it('deve aceitar perPage no limite mínimo (1)', () => {
      const result = categoryPaginationSchema.parse({
        query: {
          page: '1',
          limit: '10',
          perPage: '1',
        },
      });

      expect(result.query.perPage).toBe(1);
    });
  });
});
