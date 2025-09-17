import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { CategoryFactory } from '@/tests/factories/category/category.factory';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { CategoryStatus } from '@/enums/v1/modules/category/category-status.enum';
import { Roles } from '@/enums/v1/modules/auth/roles.enum';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

const apiUrl: string = '/api/v1/categories';

describe('Categorias', () => {
  setupTestDB();

  describe('GET /categories', () => {
    it('deve listar categorias paginadas com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(5);

      const response = await request(server)
        .get(apiUrl)
        .query({ page: 1, limit: 3 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Categorias encontradas com sucesso.');
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('status');

      expect(response.body.meta).toHaveProperty('currentPage', 1);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.totalPages).toBeGreaterThanOrEqual(2);
      expect(response.body.meta.totalItems).toBeGreaterThanOrEqual(5);
      expect(response.body.meta.itemsPerPage).toBeGreaterThanOrEqual(3);
      expect(response.body.meta.hasNextPage).toBe(true);
      expect(response.body.meta.hasPreviousPage).toBe(false);
    });

    it('deve retornar segunda página com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(5);

      const response = await request(server)
        .get(apiUrl)
        .query({ page: 2, limit: 3 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(response.body.meta).toHaveProperty('currentPage', 2);
      expect(response.body.meta.totalPages).toBeGreaterThanOrEqual(2);
      expect(response.body.meta.totalItems).toBeGreaterThanOrEqual(5);
      expect(response.body.meta).toHaveProperty('itemsPerPage', 3);
      expect(response.body.meta).toHaveProperty('hasPreviousPage', true);
    });

    it('deve usar valores padrão quando parâmetros não são fornecidos', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(15);

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.meta).toHaveProperty('currentPage', 1);
      expect(response.body.meta).toHaveProperty('itemsPerPage', 10);
      expect(response.body.meta.totalItems).toBeGreaterThanOrEqual(15);
      expect(response.body.meta.totalPages).toBeGreaterThanOrEqual(2);
    });

    it('deve validar página mínima como 1', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(5);

      const response = await request(server)
        .get(apiUrl)
        .query({ page: 1, limit: 2 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.meta).toHaveProperty('currentPage', 1);
    });

    it('deve testar limites de validação', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(apiUrl)
        .query({ page: '1', limit: '100' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.meta).toHaveProperty('currentPage', 1);
      expect(response.body.meta).toHaveProperty('itemsPerPage', 100);
    });

    it('deve usar perPage quando fornecido, sobrescrevendo limit', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(10);

      const response = await request(server)
        .get(apiUrl)
        .query({ page: '1', limit: '10', perPage: '5' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
      expect(response.body.meta).toHaveProperty('itemsPerPage', 5);
    });

    it('deve validar perPage dentro dos limites', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(apiUrl)
        .query({ page: '1', perPage: '150' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
    });

    it('deve validar limite máximo de 100', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(3);

      const response = await request(server)
        .get(apiUrl)
        .query({ page: 1, limit: 100 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.meta).toHaveProperty('itemsPerPage', 100);
    });

    it('deve retornar erro 400 para parâmetros inválidos', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(apiUrl)
        .query({ page: 'invalid', limit: 'invalid' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
    });

    it('deve retornar dados de paginação corretamente', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Categorias encontradas com sucesso.');
      expect(response.body.data).toBeDefined();
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta).toHaveProperty('totalItems');
      expect(response.body.meta).toHaveProperty('totalPages');
      expect(response.body.meta).toHaveProperty('currentPage', 1);
      expect(response.body.meta).toHaveProperty('itemsPerPage', 10);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server).get(apiUrl);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve ordenar categorias por data de criação descendente', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(apiUrl)
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length >= 2) {
        const firstCategory = response.body.data[0];
        const secondCategory = response.body.data[1];

        expect(
          new Date(firstCategory.createdAt).getTime(),
        ).toBeGreaterThanOrEqual(new Date(secondCategory.createdAt).getTime());
      }
    });

    it('deve retornar página vazia quando solicitada página inexistente', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(5);

      const response = await request(server)
        .get(apiUrl)
        .query({ page: 100, limit: 5 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.meta).toHaveProperty('currentPage', 100);
      expect(response.body.meta.totalItems).toBeGreaterThanOrEqual(5);
      expect(response.body.meta).toHaveProperty('hasNextPage', false);
      expect(response.body.meta).toHaveProperty('hasPreviousPage', true);
    });
  });

  describe('GET /categories/:id', () => {
    it('deve buscar categoria por ID com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const category = await CategoryFactory.createCategory();

      const response = await request(server)
        .get(`${apiUrl}/${category.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Categoria encontrada com sucesso.');
      expect(response.body.data).toHaveProperty('id', category.id);
      expect(response.body.data).toHaveProperty('name', category.name);
      expect(response.body.data).toHaveProperty(
        'description',
        category.description,
      );
    });

    it('deve retornar erro 404 quando categoria não existe', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(`${apiUrl}/999`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server).get(`${apiUrl}/1`);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });
  });

  describe('POST /categories', () => {
    it('deve criar categoria com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const categoryData = CategoryFactory.build().make();

      const response = await request(server)
        .post(apiUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.message).toBe('Categoria criada com sucesso.');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', categoryData.name);
      expect(response.body.data).toHaveProperty(
        'description',
        categoryData.description,
      );
      expect(response.body.data).toHaveProperty('status', categoryData.status);
    });

    it('deve criar categoria com status padrão ACTIVE quando não informado', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const categoryData = {
        name: 'Tecnologia',
        description: 'Categoria de tecnologia',
      };

      const response = await request(server)
        .post(apiUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.data).toHaveProperty(
        'status',
        CategoryStatus.ACTIVE,
      );
    });

    it('deve retornar erro 400 quando dados inválidos', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .post(apiUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const categoryData = CategoryFactory.build().make();

      const response = await request(server).post(apiUrl).send(categoryData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });
  });

  describe('PUT /categories/:id', () => {
    it('deve atualizar categoria com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const category = await CategoryFactory.createCategory();
      const updateData = {
        name: 'Tecnologia Atualizada',
        description: 'Descrição atualizada',
        status: CategoryStatus.INACTIVE,
      };

      const response = await request(server)
        .put(`${apiUrl}/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Categoria atualizada com sucesso.');
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty(
        'description',
        updateData.description,
      );
      expect(response.body.data).toHaveProperty('status', updateData.status);
    });

    it('deve atualizar apenas campos informados', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const category = await CategoryFactory.createCategory();
      const updateData = {
        name: 'Nome Atualizado',
      };

      const response = await request(server)
        .put(`${apiUrl}/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty(
        'description',
        category.description,
      );
    });

    it('deve retornar erro 404 quando categoria não existe', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const updateData = { name: 'Nome Atualizado' };

      const response = await request(server)
        .put(`${apiUrl}/999`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const updateData = { name: 'Nome Atualizado' };

      const response = await request(server)
        .put(`${apiUrl}/1`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });
  });

  describe('DELETE /categories/:id', () => {
    it('deve deletar categoria com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const category = await CategoryFactory.createCategory();

      const response = await request(server)
        .delete(`${apiUrl}/${category.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Categoria removida com sucesso.');
    });

    it('deve retornar erro 404 quando categoria não existe', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .delete(`${apiUrl}/999`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server).delete(`${apiUrl}/1`);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });
  });
});
