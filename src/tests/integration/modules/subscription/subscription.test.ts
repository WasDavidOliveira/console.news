import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { SubscriptionFactory } from '@/tests/factories/subscription/subscription.factory';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { SubscriptionStatus } from '@/enums/v1/modules/subscription/subscription-status.enum';

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
        name: 'João Silva',
        email: 'joao@email.com',
      };

      const response = await request(server)
        .post(apiUrl)
        .send(subscriptionData);

      console.log(response.body);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.message).toBe('Inscrição criada com sucesso');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('status', SubscriptionStatus.ACTIVE);
      expect(response.body.data).toHaveProperty('isActive', true);
    });

    it('deve criar usuário automaticamente se não existir', async () => {
      const subscriptionData = {
        name: 'Maria Santos',
        email: 'maria@email.com',
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
        email: 'email-invalido',
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
      await SubscriptionFactory.createActiveSubscription();
      await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .get(apiUrl);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrições encontradas com sucesso');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve filtrar inscrições por status ativo', async () => {
      await SubscriptionFactory.createActiveSubscription();
      await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}?isActive=true`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.every((sub: any) => sub.isActive === true)).toBe(true);
    });

    it('deve filtrar inscrições por status inativo', async () => {
      await SubscriptionFactory.createActiveSubscription();
      await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}?isActive=false`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.every((sub: any) => sub.isActive === false)).toBe(true);
    });

    it('deve filtrar inscrições por status específico', async () => {
      await SubscriptionFactory.createWithStatus(SubscriptionStatus.ACTIVE);
      await SubscriptionFactory.createWithStatus(SubscriptionStatus.INACTIVE);

      const response = await request(server)
        .get(`${apiUrl}?status=${SubscriptionStatus.ACTIVE}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.every((sub: any) => sub.status === SubscriptionStatus.ACTIVE)).toBe(true);
    });
  });

  describe('GET /subscriptions/email/:email', () => {
    it('deve buscar inscrições por email', async () => {
      const { user, subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}/email/${user.email}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrições encontradas com sucesso');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].userId).toBe(user.id);
    });

    it('deve retornar array vazio se email não possui inscrições', async () => {
      const response = await request(server)
        .get(`${apiUrl}/email/naoexiste@email.com`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /subscriptions/:id', () => {
    it('deve buscar inscrição por ID', async () => {
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .get(`${apiUrl}/${subscription.id}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição encontrada com sucesso');
      expect(response.body.data.id).toBe(subscription.id);
    });

    it('deve retornar erro 400 se ID inválido', async () => {
      const response = await request(server)
        .get(`${apiUrl}/abc`);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.status).toBe('erro');
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const response = await request(server)
        .get(`${apiUrl}/99999`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });
  });

  describe('PUT /subscriptions/:id', () => {
    it('deve atualizar inscrição com sucesso', async () => {
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const updateData = {
        status: SubscriptionStatus.INACTIVE,
        isActive: false,
      };

      const response = await request(server)
        .put(`${apiUrl}/${subscription.id}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição atualizada com sucesso');
      expect(response.body.data.status).toBe(SubscriptionStatus.INACTIVE);
      expect(response.body.data.isActive).toBe(false);
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const updateData = {
        status: SubscriptionStatus.INACTIVE,
      };

      const response = await request(server)
        .put(`${apiUrl}/99999`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });
  });

  describe('PATCH /subscriptions/:id/activate', () => {
    it('deve ativar inscrição com sucesso', async () => {
      const { subscription } = await SubscriptionFactory.createInactiveSubscription();

      const response = await request(server)
        .patch(`${apiUrl}/${subscription.id}/activate`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição ativada com sucesso');
      expect(response.body.data.isActive).toBe(true);
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const response = await request(server)
        .patch(`${apiUrl}/99999/activate`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });
  });

  describe('PATCH /subscriptions/:id/deactivate', () => {
    it('deve desativar inscrição com sucesso', async () => {
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .patch(`${apiUrl}/${subscription.id}/deactivate`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição desativada com sucesso');
      expect(response.body.data.isActive).toBe(false);
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const response = await request(server)
        .patch(`${apiUrl}/99999/deactivate`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });
  });

  describe('DELETE /subscriptions/:id', () => {
    it('deve excluir inscrição com sucesso', async () => {
      const { subscription } = await SubscriptionFactory.createActiveSubscription();

      const response = await request(server)
        .delete(`${apiUrl}/${subscription.id}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Inscrição removida com sucesso');
    });

    it('deve retornar erro 404 se inscrição não encontrada', async () => {
      const response = await request(server)
        .delete(`${apiUrl}/99999`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Inscrição não encontrada');
    });
  });
});
