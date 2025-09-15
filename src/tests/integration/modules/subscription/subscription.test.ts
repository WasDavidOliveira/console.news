import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { SubscriptionFactory } from '@/tests/factories/subscription/subscription.factory';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { SubscriptionStatus } from '@/enums/v1/modules/subscription/subscription-status.enum';
import { Roles } from '@/enums/v1/modules/auth/roles.enum';
import { faker } from '@faker-js/faker';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

const apiUrl: string = '/api/v1/subscriptions';

describe('Subscription', () => {
  setupTestDB();

  describe('POST /subscriptions', () => {
    it('deve criar uma nova inscrição com sucesso', async () => {
      const subscriptionData = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
      };

      const response = await request(server)
        .post(apiUrl)
        .send(subscriptionData);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.message).toBe('Inscrição criada com sucesso');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('status', SubscriptionStatus.ACTIVE);
      expect(response.body.data).toHaveProperty('isActive', true);
    });

    it('deve criar usuário automaticamente se não existir', async () => {
      const subscriptionData = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
      };

      const response = await request(server)
        .post(apiUrl)
        .send(subscriptionData);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.message).toBe('Inscrição criada com sucesso');
      expect(response.body.data).toHaveProperty('userId');
    });

    it('deve retornar erro 409 se usuário já possui inscrição ativa', async () => {
      const { user } = await UserFactory.build().create();
      await SubscriptionFactory.build().createWithUser(user.id);

      const subscriptionData = {
        name: user.name,
        email: user.email,
      };

      const response = await request(server)
        .post(apiUrl)
        .send(subscriptionData);

      expect(response.status).toBe(StatusCode.CONFLICT);
      expect(response.body.message).toBe('Usuário já possui uma inscrição ativa');
    });

    it('deve retornar erro 400 se dados inválidos', async () => {
      const invalidData = {
        name: '',
        email: faker.string.alphanumeric(10),
      };

      const response = await request(server)
        .post(apiUrl)
        .send(invalidData);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.status).toBe('erro');
      expect(response.body.message).toBe('Erro de validação');
    });
  });

  describe('GET /subscriptions', () => {
    it('deve listar todas as inscrições', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      await SubscriptionFactory.createActiveSubscription();
      await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrições encontradas com sucesso');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve filtrar inscrições por status ativo', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      await SubscriptionFactory.createActiveSubscription();
      await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}?isActive=true`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.every((sub: any) => sub.isActive === true)).toBe(true);
    });

    it('deve filtrar inscrições por status inativo', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      await SubscriptionFactory.createActiveSubscription();
      await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}?isActive=false`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.every((sub: any) => sub.isActive === false)).toBe(true);
    });

    it('deve filtrar inscrições por status específico', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      await SubscriptionFactory.createWithStatus(SubscriptionStatus.ACTIVE);
      await SubscriptionFactory.createWithStatus(SubscriptionStatus.INACTIVE);

      const response = await request(server)
        .get(`${apiUrl}?status=${SubscriptionStatus.ACTIVE}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.every((sub: any) => sub.status === SubscriptionStatus.ACTIVE)).toBe(true);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server)
        .get(apiUrl);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.USER);

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('GET /subscriptions/email/:email', () => {
    it('deve buscar inscrições por email', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const { user, subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}/email/${user.email}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrições encontradas com sucesso');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].userId).toBe(user.id);
    });

    it('deve retornar array vazio se email não possui inscrições', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const nonExistentEmail = faker.internet.email().toLowerCase();

      const response = await request(server)
        .get(`${apiUrl}/email/${nonExistentEmail}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toHaveLength(0);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const testEmail = faker.internet.email().toLowerCase();
      const response = await request(server)
        .get(`${apiUrl}/email/${testEmail}`);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.USER);
      const testEmail = faker.internet.email().toLowerCase();

      const response = await request(server)
        .get(`${apiUrl}/email/${testEmail}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('GET /subscriptions/:id', () => {
    it('deve buscar inscrição por ID', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}/${subscription.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição encontrada com sucesso');
      expect(response.body.data.id).toBe(subscription.id);
    });

    it('deve retornar erro 400 se ID inválido', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);

      const response = await request(server)
        .get(`${apiUrl}/abc`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.status).toBe('erro');
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);

      const response = await request(server)
        .get(`${apiUrl}/99999`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server)
        .get(`${apiUrl}/1`);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.USER);

      const response = await request(server)
        .get(`${apiUrl}/1`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('PUT /subscriptions/:id', () => {
    it('deve atualizar inscrição com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const updateData = {
        status: SubscriptionStatus.INACTIVE,
        isActive: false,
      };

      const response = await request(server)
        .put(`${apiUrl}/${subscription.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição atualizada com sucesso');
      expect(response.body.data.status).toBe(SubscriptionStatus.INACTIVE);
      expect(response.body.data.isActive).toBe(false);
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const updateData = {
        status: SubscriptionStatus.INACTIVE,
      };

      const response = await request(server)
        .put(`${apiUrl}/99999`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const updateData = {
        status: SubscriptionStatus.INACTIVE,
      };

      const response = await request(server)
        .put(`${apiUrl}/1`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.USER);
      const updateData = {
        status: SubscriptionStatus.INACTIVE,
      };

      const response = await request(server)
        .put(`${apiUrl}/1`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('PATCH /subscriptions/:id/activate', () => {
    it('deve ativar inscrição com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const { subscription } = await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .patch(`${apiUrl}/${subscription.id}/activate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição ativada com sucesso');
      expect(response.body.data.isActive).toBe(true);
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);

      const response = await request(server)
        .patch(`${apiUrl}/99999/activate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server)
        .patch(`${apiUrl}/1/activate`);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.USER);

      const response = await request(server)
        .patch(`${apiUrl}/1/activate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('PATCH /subscriptions/:id/deactivate', () => {
    it('deve desativar inscrição com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .patch(`${apiUrl}/${subscription.id}/deactivate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição desativada com sucesso');
      expect(response.body.data.isActive).toBe(false);
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);

      const response = await request(server)
        .patch(`${apiUrl}/99999/deactivate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server)
        .patch(`${apiUrl}/1/deactivate`);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.USER);

      const response = await request(server)
        .patch(`${apiUrl}/1/deactivate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('DELETE /subscriptions/:id', () => {
    it('deve excluir inscrição com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .delete(`${apiUrl}/${subscription.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição removida com sucesso');
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.ADMIN);

      const response = await request(server)
        .delete(`${apiUrl}/99999`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server)
        .delete(`${apiUrl}/1`);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(Roles.USER);

      const response = await request(server)
        .delete(`${apiUrl}/1`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });
});
