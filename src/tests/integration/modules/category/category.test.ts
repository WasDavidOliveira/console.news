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
    it('deve listar todas as categorias com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await CategoryFactory.createMultipleCategories(3);

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      console.log(response.body);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Categorias encontradas com sucesso.');
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('status');
    });

    it('deve retornar lista vazia quando não há categorias', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Categorias encontradas com sucesso.');
      expect(response.body.data).toHaveLength(0);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server).get(apiUrl);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
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
