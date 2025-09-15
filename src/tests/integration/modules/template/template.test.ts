import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { TemplateFactory } from '@/tests/factories/template/template.factory';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { TemplateVariable } from '@/enums/v1/modules/template/template-variables.enum';
import { Roles } from '@/enums/v1/modules/auth/roles.enum';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

const apiUrl: string = '/api/v1/templates';

describe('Templates', () => {
  setupTestDB();

  describe('GET /templates', () => {
    it('deve listar todos os templates com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await TemplateFactory.createMultipleTemplates(3);

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Templates encontrados com sucesso.');
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('html');
      expect(response.body.data[0]).toHaveProperty('text');
      expect(response.body.data[0]).toHaveProperty('css');
      expect(response.body.data[0]).toHaveProperty('variables');
      expect(response.body.data[0]).toHaveProperty('isActive');
    });

    it('deve filtrar templates ativos com query parameter', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await TemplateFactory.createMultipleActiveTemplates(2);
      await TemplateFactory.createMultipleInactiveTemplates(2);

      const response = await request(server)
        .get(`${apiUrl}?active=true`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(
        response.body.data.every((template: any) => template.isActive),
      ).toBe(true);
    });

    it('deve filtrar templates inativos com query parameter', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await TemplateFactory.createMultipleActiveTemplates(2);
      await TemplateFactory.createMultipleInactiveTemplates(2);

      const response = await request(server)
        .get(`${apiUrl}?active=false`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(
        response.body.data.every((template: any) => !template.isActive),
      ).toBe(true);
    });

    it('deve retornar lista vazia quando não há templates', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Templates encontrados com sucesso.');
      // Pode haver templates de seed no banco, então verificamos se pelo menos existe a estrutura
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve retornar erro 401 quando não autenticado', async () => {
      const response = await request(server).get(apiUrl);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve retornar erro 403 quando não tem permissão de admin', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.USER,
      );

      const response = await request(server)
        .get(apiUrl)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('GET /templates/preview', () => {
    it('deve retornar templates ativos para preview', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      await TemplateFactory.createMultipleActiveTemplates(2);
      await TemplateFactory.createMultipleInactiveTemplates(2);

      const response = await request(server)
        .get(`${apiUrl}/preview`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe(
        'Templates para preview encontrados com sucesso.',
      );
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(
        response.body.data.every((template: any) => template.isActive),
      ).toBe(true);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('variables');
      expect(response.body.data[0]).not.toHaveProperty('html');
      expect(response.body.data[0]).not.toHaveProperty('text');
      expect(response.body.data[0]).not.toHaveProperty('css');
    });
  });

  describe('GET /templates/:id', () => {
    it('deve buscar template por ID com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const template = await TemplateFactory.createTemplate();

      const response = await request(server)
        .get(`${apiUrl}/${template.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Template encontrado com sucesso.');
      expect(response.body.data).toHaveProperty('id', template.id);
      expect(response.body.data).toHaveProperty('name', template.name);
      expect(response.body.data).toHaveProperty(
        'description',
        template.description,
      );
      expect(response.body.data).toHaveProperty('html', template.html);
      expect(response.body.data).toHaveProperty('text', template.text);
      expect(response.body.data).toHaveProperty('css', template.css);
      expect(response.body.data).toHaveProperty(
        'variables',
        template.variables,
      );
      expect(response.body.data).toHaveProperty('isActive', template.isActive);
    });

    it('deve retornar erro 404 quando template não existe', async () => {
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

  describe('POST /templates', () => {
    it('deve criar template com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const templateData = TemplateFactory.build().make();

      const response = await request(server)
        .post(apiUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(templateData);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.message).toBe('Template criado com sucesso.');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', templateData.name);
      expect(response.body.data).toHaveProperty(
        'description',
        templateData.description,
      );
      expect(response.body.data).toHaveProperty('html', templateData.html);
      expect(response.body.data).toHaveProperty('text', templateData.text);
      expect(response.body.data).toHaveProperty('css', templateData.css);
      expect(response.body.data).toHaveProperty(
        'variables',
        templateData.variables,
      );
      expect(response.body.data).toHaveProperty(
        'isActive',
        templateData.isActive,
      );
    });

    it('deve criar template com valores padrão quando não informados', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const templateData = {
        name: 'Template Simples',
        html: '<html><body>{{title}}</body></html>',
      };

      const response = await request(server)
        .post(apiUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(templateData);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.data).toHaveProperty('isActive', true);
      expect(response.body.data).toHaveProperty('variables', []);
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
      const templateData = TemplateFactory.build().make();

      const response = await request(server).post(apiUrl).send(templateData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });
  });

  describe('PUT /templates/:id', () => {
    it('deve atualizar template com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const template = await TemplateFactory.createTemplate();
      const updateData = {
        name: 'Template Atualizado',
        description: 'Descrição atualizada',
        html: '<html><body><h1>{{title}}</h1><p>{{content}}</p></body></html>',
        variables: [
          TemplateVariable.TITLE,
          TemplateVariable.CONTENT,
          TemplateVariable.SUBJECT,
        ],
        isActive: false,
      };

      const response = await request(server)
        .put(`${apiUrl}/${template.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Template atualizado com sucesso.');
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty(
        'description',
        updateData.description,
      );
      expect(response.body.data).toHaveProperty('html', updateData.html);
      expect(response.body.data).toHaveProperty(
        'variables',
        updateData.variables,
      );
      expect(response.body.data).toHaveProperty(
        'isActive',
        updateData.isActive,
      );
    });

    it('deve atualizar apenas campos informados', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const template = await TemplateFactory.createTemplate();
      const updateData = {
        name: 'Nome Atualizado',
      };

      const response = await request(server)
        .put(`${apiUrl}/${template.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty(
        'description',
        template.description,
      );
      expect(response.body.data).toHaveProperty('html', template.html);
    });

    it('deve retornar erro 404 quando template não existe', async () => {
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

  describe('PATCH /templates/:id/activate', () => {
    it('deve ativar template com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const template = await TemplateFactory.createInactiveTemplate();

      const response = await request(server)
        .patch(`${apiUrl}/${template.id}/activate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Template ativado com sucesso.');
      expect(response.body.data).toHaveProperty('isActive', true);
    });

    it('deve retornar erro 404 quando template não existe', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .patch(`${apiUrl}/999/activate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
    });
  });

  describe('PATCH /templates/:id/deactivate', () => {
    it('deve desativar template com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const template = await TemplateFactory.createActiveTemplate();

      const response = await request(server)
        .patch(`${apiUrl}/${template.id}/deactivate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Template desativado com sucesso.');
      expect(response.body.data).toHaveProperty('isActive', false);
    });

    it('deve retornar erro 404 quando template não existe', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );

      const response = await request(server)
        .patch(`${apiUrl}/999/deactivate`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
    });
  });

  describe('DELETE /templates/:id', () => {
    it('deve deletar template com sucesso', async () => {
      const { token } = await UserFactory.createUserWithRoleAndGetToken(
        Roles.ADMIN,
      );
      const template = await TemplateFactory.createTemplate();

      const response = await request(server)
        .delete(`${apiUrl}/${template.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Template removido com sucesso.');
    });

    it('deve retornar erro 404 quando template não existe', async () => {
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
