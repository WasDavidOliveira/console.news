import { createDocument } from 'zod-openapi';
import path from 'path';
import fs from 'fs';
import * as z from 'zod';
import {
  loginSchema,
  registerSchema,
  userResponseSchema,
} from '@/validations/v1/modules/auth.validations';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/validations/v1/modules/category.validations';
import {
  createTemplateSchema,
  updateTemplateSchema,
} from '@/validations/v1/modules/template.validations';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from '@/validations/v1/modules/subscription.validations';

export const generateOpenAPIDocument = () => {
  const loginResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Login realizado com sucesso',
      }),
      user: userResponseSchema,
      token: z.string().openapi({
        description: 'Token JWT para autenticação',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }),
    })
    .openapi({
      ref: 'LoginResponse',
      description: 'Resposta de login bem-sucedido',
    });

  const registerResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Usuário criado com sucesso',
      }),
      user: userResponseSchema,
    })
    .openapi({
      ref: 'RegisterResponse',
      description: 'Resposta de registro bem-sucedido',
    });

  const meResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Usuário encontrado com sucesso',
      }),
      user: userResponseSchema,
    })
    .openapi({
      ref: 'MeResponse',
      description: 'Resposta com dados do usuário atual',
    });

  const categoryResponseSchema = z
    .object({
      id: z.number().openapi({
        description: 'ID único da categoria',
        example: 1,
      }),
      name: z.string().openapi({
        description: 'Nome da categoria',
        example: 'Tecnologia',
      }),
      description: z.string().openapi({
        description: 'Descrição da categoria',
        example: 'Categoria para notícias de tecnologia',
      }),
      status: z.string().openapi({
        description: 'Status da categoria',
        example: 'A',
      }),
      createdAt: z.string().openapi({
        description: 'Data de criação',
        example: '2024-01-15T10:30:00Z',
      }),
      updatedAt: z.string().openapi({
        description: 'Data de atualização',
        example: '2024-01-15T10:30:00Z',
      }),
    })
    .openapi({
      ref: 'CategoryResponse',
      description: 'Dados de uma categoria',
    });

  const paginationMetaSchema = z
    .object({
      currentPage: z.number().openapi({
        description: 'Página atual',
        example: 1,
      }),
      totalPages: z.number().openapi({
        description: 'Total de páginas',
        example: 5,
      }),
      totalItems: z.number().openapi({
        description: 'Total de itens',
        example: 45,
      }),
      itemsPerPage: z.number().openapi({
        description: 'Itens por página',
        example: 10,
      }),
      hasNextPage: z.boolean().openapi({
        description: 'Indica se há próxima página',
        example: true,
      }),
      hasPreviousPage: z.boolean().openapi({
        description: 'Indica se há página anterior',
        example: false,
      }),
    })
    .openapi({
      ref: 'PaginationMeta',
      description: 'Metadados de paginação',
    });

  const categoryPaginatedResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Categorias encontradas com sucesso.',
      }),
      data: z.array(categoryResponseSchema).openapi({
        description: 'Lista paginada de categorias',
      }),
      meta: paginationMetaSchema.openapi({
        description: 'Metadados de paginação',
      }),
    })
    .openapi({
      ref: 'CategoryPaginatedResponse',
      description: 'Resposta com lista paginada de categorias',
    });

  const categoryListResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Categorias listadas com sucesso',
      }),
      data: z.array(categoryResponseSchema).openapi({
        description: 'Lista de categorias',
      }),
    })
    .openapi({
      ref: 'CategoryListResponse',
      description: 'Resposta com lista de categorias',
    });

  const categoryCreateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Categoria criada com sucesso',
      }),
      data: categoryResponseSchema,
    })
    .openapi({
      ref: 'CategoryCreateResponse',
      description: 'Resposta de criação de categoria',
    });

  const categoryUpdateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Categoria atualizada com sucesso',
      }),
      data: categoryResponseSchema,
    })
    .openapi({
      ref: 'CategoryUpdateResponse',
      description: 'Resposta de atualização de categoria',
    });

  const categoryDeleteResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Categoria excluída com sucesso',
      }),
    })
    .openapi({
      ref: 'CategoryDeleteResponse',
      description: 'Resposta de exclusão de categoria',
    });

  // Schemas de resposta para Template
  const templateResponseSchema = z
    .object({
      id: z.number().openapi({
        description: 'ID único do template',
        example: 1,
      }),
      name: z.string().openapi({
        description: 'Nome do template',
        example: 'Template Newsletter Semanal',
      }),
      description: z.string().nullable().openapi({
        description: 'Descrição do template',
        example: 'Template para newsletter semanal de notícias',
      }),
      html: z.string().openapi({
        description: 'Conteúdo HTML do template',
        example:
          '<html><body><h1>{{title}}</h1><div>{{content}}</div></body></html>',
      }),
      text: z.string().nullable().openapi({
        description: 'Conteúdo de texto do template',
        example: '{{title}}\n\n{{content}}',
      }),
      css: z.string().nullable().openapi({
        description: 'Estilos CSS do template',
        example: 'body { font-family: Arial, sans-serif; }',
      }),
      variables: z.array(z.string()).openapi({
        description: 'Variáveis disponíveis no template',
        example: ['TITLE', 'CONTENT'],
      }),
      isActive: z.boolean().openapi({
        description: 'Status de ativação do template',
        example: true,
      }),
      createdAt: z.string().openapi({
        description: 'Data de criação',
        example: '2024-01-15T10:30:00Z',
      }),
      updatedAt: z.string().openapi({
        description: 'Data de atualização',
        example: '2024-01-15T10:30:00Z',
      }),
    })
    .openapi({
      ref: 'TemplateResponse',
      description: 'Dados de um template',
    });

  const templateListResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Templates listados com sucesso',
      }),
      data: z.array(templateResponseSchema).openapi({
        description: 'Lista de templates',
      }),
    })
    .openapi({
      ref: 'TemplateListResponse',
      description: 'Resposta com lista de templates',
    });

  const templateCreateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Template criado com sucesso',
      }),
      data: templateResponseSchema,
    })
    .openapi({
      ref: 'TemplateCreateResponse',
      description: 'Resposta de criação de template',
    });

  const templateUpdateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Template atualizado com sucesso',
      }),
      data: templateResponseSchema,
    })
    .openapi({
      ref: 'TemplateUpdateResponse',
      description: 'Resposta de atualização de template',
    });

  const templateActivateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Template ativado com sucesso',
      }),
      data: templateResponseSchema,
    })
    .openapi({
      ref: 'TemplateActivateResponse',
      description: 'Resposta de ativação de template',
    });

  const templateDeactivateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Template desativado com sucesso',
      }),
      data: templateResponseSchema,
    })
    .openapi({
      ref: 'TemplateDeactivateResponse',
      description: 'Resposta de desativação de template',
    });

  const templateDeleteResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Template excluído com sucesso',
      }),
    })
    .openapi({
      ref: 'TemplateDeleteResponse',
      description: 'Resposta de exclusão de template',
    });

  const templatePreviewResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Preview do template gerado com sucesso',
      }),
      preview: z.string().openapi({
        description: 'HTML renderizado do template',
        example:
          '<html><body><h1>Exemplo de Título</h1><div>Exemplo de conteúdo</div></body></html>',
      }),
    })
    .openapi({
      ref: 'TemplatePreviewResponse',
      description: 'Resposta de preview do template',
    });

  // Schemas de resposta para Subscription
  const subscriptionResponseSchema = z
    .object({
      id: z.number().openapi({
        description: 'ID único da inscrição',
        example: 1,
      }),
      userId: z.number().openapi({
        description: 'ID do usuário',
        example: 1,
      }),
      status: z.string().openapi({
        description: 'Status da inscrição',
        example: 'A',
      }),
      isActive: z.boolean().openapi({
        description: 'Status de ativação da inscrição',
        example: true,
      }),
      createdAt: z.string().openapi({
        description: 'Data de criação',
        example: '2024-01-15T10:30:00Z',
      }),
      updatedAt: z.string().openapi({
        description: 'Data de atualização',
        example: '2024-01-15T10:30:00Z',
      }),
    })
    .openapi({
      ref: 'SubscriptionResponse',
      description: 'Dados de uma inscrição',
    });

  const subscriptionListResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Inscrições encontradas com sucesso',
      }),
      data: z.array(subscriptionResponseSchema).openapi({
        description: 'Lista de inscrições',
      }),
    })
    .openapi({
      ref: 'SubscriptionListResponse',
      description: 'Resposta com lista de inscrições',
    });

  const subscriptionCreateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Inscrição criada com sucesso',
      }),
      data: subscriptionResponseSchema,
    })
    .openapi({
      ref: 'SubscriptionCreateResponse',
      description: 'Resposta de criação de inscrição',
    });

  const subscriptionUpdateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Inscrição atualizada com sucesso',
      }),
      data: subscriptionResponseSchema,
    })
    .openapi({
      ref: 'SubscriptionUpdateResponse',
      description: 'Resposta de atualização de inscrição',
    });

  const subscriptionActivateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Inscrição ativada com sucesso',
      }),
      data: subscriptionResponseSchema,
    })
    .openapi({
      ref: 'SubscriptionActivateResponse',
      description: 'Resposta de ativação de inscrição',
    });

  const subscriptionDeactivateResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Inscrição desativada com sucesso',
      }),
      data: subscriptionResponseSchema,
    })
    .openapi({
      ref: 'SubscriptionDeactivateResponse',
      description: 'Resposta de desativação de inscrição',
    });

  const subscriptionDeleteResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Inscrição removida com sucesso',
      }),
    })
    .openapi({
      ref: 'SubscriptionDeleteResponse',
      description: 'Resposta de remoção de inscrição',
    });

  // Schemas de resposta para Health Check
  const healthSimpleResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Status da API',
        example: 'OK',
      }),
      timestamp: z.string().openapi({
        description: 'Timestamp da verificação',
        example: '2024-01-15T10:30:00.000Z',
      }),
    })
    .openapi({
      ref: 'HealthSimpleResponse',
      description: 'Resposta simples de health check',
    });

  const healthDetailedResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de status da API',
        example: 'API está funcionando corretamente',
      }),
      data: z
        .object({
          status: z.string().openapi({
            description: 'Status da aplicação',
            example: 'healthy',
          }),
          timestamp: z.string().openapi({
            description: 'Timestamp da verificação',
            example: '2024-01-15T10:30:00.000Z',
          }),
          uptime: z.number().openapi({
            description: 'Tempo de execução em segundos',
            example: 3600.5,
          }),
          environment: z.string().openapi({
            description: 'Ambiente de execução',
            example: 'development',
          }),
          version: z.string().openapi({
            description: 'Versão da aplicação',
            example: '1.0.0',
          }),
          database: z.string().openapi({
            description: 'Status da conexão com o banco',
            example: 'connected',
          }),
          memory: z
            .object({
              used: z.number().openapi({
                description: 'Memória usada em MB',
                example: 45.67,
              }),
              total: z.number().openapi({
                description: 'Memória total em MB',
                example: 128.0,
              }),
            })
            .openapi({
              description: 'Informações de memória',
            }),
        })
        .openapi({
          description: 'Dados detalhados do health check',
        }),
    })
    .openapi({
      ref: 'HealthDetailedResponse',
      description: 'Resposta detalhada de health check',
    });

  const healthErrorResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de erro',
        example: 'API está com problemas',
      }),
      data: z
        .object({
          status: z.string().openapi({
            description: 'Status da aplicação',
            example: 'unhealthy',
          }),
          timestamp: z.string().openapi({
            description: 'Timestamp da verificação',
            example: '2024-01-15T10:30:00.000Z',
          }),
          uptime: z.number().openapi({
            description: 'Tempo de execução em segundos',
            example: 3600.5,
          }),
          environment: z.string().openapi({
            description: 'Ambiente de execução',
            example: 'development',
          }),
          version: z.string().openapi({
            description: 'Versão da aplicação',
            example: '1.0.0',
          }),
          database: z.string().openapi({
            description: 'Status da conexão com o banco',
            example: 'disconnected',
          }),
          error: z.string().openapi({
            description: 'Mensagem de erro',
            example: 'Connection timeout',
          }),
        })
        .openapi({
          description: 'Dados de erro do health check',
        }),
    })
    .openapi({
      ref: 'HealthErrorResponse',
      description: 'Resposta de erro do health check',
    });

  // Schemas de resposta para Dashboard
  const dashboardAnalyticsSchema = z
    .object({
      subscribers: z
        .object({
          active: z.number().openapi({
            description: 'Número de assinantes ativos',
            example: 150,
          }),
          total: z.number().openapi({
            description: 'Total de assinantes',
            example: 200,
          }),
        })
        .openapi({
          description: 'Métricas de assinantes',
        }),
      newsletters: z
        .object({
          created: z.number().openapi({
            description: 'Número de newsletters criadas',
            example: 45,
          }),
          sent: z.number().openapi({
            description: 'Número de newsletters enviadas',
            example: 40,
          }),
        })
        .openapi({
          description: 'Métricas de newsletters',
        }),
      categories: z
        .object({
          total: z.number().openapi({
            description: 'Total de categorias ativas',
            example: 8,
          }),
        })
        .openapi({
          description: 'Métricas de categorias',
        }),
      templates: z
        .object({
          active: z.number().openapi({
            description: 'Número de templates ativos',
            example: 12,
          }),
        })
        .openapi({
          description: 'Métricas de templates',
        }),
    })
    .openapi({
      ref: 'DashboardAnalytics',
      description: 'Dados de analytics do dashboard',
    });

  const dashboardResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Analytics do dashboard obtidas com sucesso',
      }),
      data: dashboardAnalyticsSchema,
    })
    .openapi({
      ref: 'DashboardResponse',
      description: 'Resposta com analytics do dashboard',
    });

  const document = createDocument({
    openapi: '3.0.0',
    info: {
      title: 'API Starker Kit',
      description: 'Documentação da API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    paths: {
      // Rotas de Analytics - Health Check
      '/api/v1/health': {
        get: {
          tags: ['Analytics'],
          summary: 'Health check simples',
          description: 'Endpoint para verificar se a API está funcionando',
          responses: {
            200: {
              description: 'API funcionando corretamente',
              content: {
                'application/json': {
                  schema: healthSimpleResponseSchema,
                },
              },
            },
          },
        },
      },
      '/api/v1/health/detailed': {
        get: {
          tags: ['Analytics'],
          summary: 'Health check detalhado',
          description:
            'Endpoint para verificar o status detalhado da API incluindo banco de dados e métricas',
          responses: {
            200: {
              description: 'API funcionando corretamente com todos os serviços',
              content: {
                'application/json': {
                  schema: healthDetailedResponseSchema,
                },
              },
            },
            503: {
              description: 'API com problemas - algum serviço indisponível',
              content: {
                'application/json': {
                  schema: healthErrorResponseSchema,
                },
              },
            },
          },
        },
      },
      // Rotas de Analytics - Dashboard
      '/api/v1/dashboard': {
        get: {
          tags: ['Analytics'],
          summary: 'Obter analytics do dashboard',
          description:
            'Endpoint para obter métricas e estatísticas do dashboard incluindo assinantes, newsletters, categorias e templates',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'Analytics obtidas com sucesso',
              content: {
                'application/json': {
                  schema: dashboardResponseSchema,
                },
              },
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Login de usuário',
          description: 'Endpoint para autenticar um usuário existente',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: loginSchema.shape.body,
              },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: loginResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            401: {
              description: 'Credenciais inválidas',
            },
          },
        },
      },
      '/api/v1/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Registro de usuário',
          description: 'Endpoint para cadastrar um novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: registerSchema.shape.body,
              },
            },
          },
          responses: {
            200: {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: registerResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos ou usuário já existe',
            },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Autenticação'],
          summary: 'Detalhes do usuário atual',
          description: 'Endpoint para obter informações do usuário autenticado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'Usuário encontrado com sucesso',
              content: {
                'application/json': {
                  schema: meResponseSchema,
                },
              },
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            404: {
              description: 'Usuário não encontrado',
            },
          },
        },
      },
      // Rotas de Categoria
      '/api/v1/categories': {
        get: {
          tags: ['Categorias'],
          summary: 'Listar categorias com paginação',
          description:
            'Endpoint para listar categorias com suporte a paginação. Ordena por data de criação descendente.',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'page',
              in: 'query',
              required: false,
              description: 'Número da página (começa em 1)',
              schema: {
                type: 'integer',
                minimum: 1,
                default: 1,
                example: 1,
              },
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              description: 'Número de itens por página (máximo 100)',
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 10,
                example: 10,
              },
            },
            {
              name: 'perPage',
              in: 'query',
              required: false,
              description:
                'Número específico de itens por página (sobrescreve limit, máximo 100)',
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                example: 15,
              },
            },
          ],
          responses: {
            200: {
              description: 'Categorias encontradas com sucesso',
              content: {
                'application/json': {
                  schema: categoryPaginatedResponseSchema,
                },
              },
            },
            400: {
              description: 'Parâmetros de paginação inválidos',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
        post: {
          tags: ['Categorias'],
          summary: 'Criar categoria',
          description: 'Endpoint para criar uma nova categoria',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: createCategorySchema.shape.body,
              },
            },
          },
          responses: {
            201: {
              description: 'Categoria criada com sucesso',
              content: {
                'application/json': {
                  schema: categoryCreateResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
      },
      '/api/v1/categories/{id}': {
        get: {
          tags: ['Categorias'],
          summary: 'Buscar categoria por ID',
          description: 'Endpoint para buscar uma categoria específica pelo ID',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da categoria',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Categoria encontrada com sucesso',
              content: {
                'application/json': {
                  schema: z
                    .object({
                      message: z.string().openapi({
                        description: 'Mensagem de sucesso',
                        example: 'Categoria encontrada com sucesso.',
                      }),
                      data: categoryResponseSchema,
                    })
                    .openapi({
                      ref: 'CategoryShowResponse',
                      description: 'Resposta de busca de categoria por ID',
                    }),
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Categoria não encontrada',
            },
          },
        },
        put: {
          tags: ['Categorias'],
          summary: 'Atualizar categoria',
          description: 'Endpoint para atualizar uma categoria existente',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da categoria',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: updateCategorySchema.shape.body,
              },
            },
          },
          responses: {
            200: {
              description: 'Categoria atualizada com sucesso',
              content: {
                'application/json': {
                  schema: categoryUpdateResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Categoria não encontrada',
            },
          },
        },
        delete: {
          tags: ['Categorias'],
          summary: 'Excluir categoria',
          description: 'Endpoint para excluir uma categoria',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da categoria',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Categoria excluída com sucesso',
              content: {
                'application/json': {
                  schema: categoryDeleteResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Categoria não encontrada',
            },
          },
        },
      },
      // Rotas de Template
      '/api/v1/templates': {
        get: {
          tags: ['Templates'],
          summary: 'Listar templates',
          description: 'Endpoint para listar templates com filtros opcionais',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'active',
              in: 'query',
              required: false,
              description: 'Filtrar por status de ativação',
              schema: {
                type: 'boolean',
                example: true,
              },
            },
          ],
          responses: {
            200: {
              description: 'Templates listados com sucesso',
              content: {
                'application/json': {
                  schema: templateListResponseSchema,
                },
              },
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
        post: {
          tags: ['Templates'],
          summary: 'Criar template',
          description: 'Endpoint para criar um novo template',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: createTemplateSchema.shape.body,
              },
            },
          },
          responses: {
            201: {
              description: 'Template criado com sucesso',
              content: {
                'application/json': {
                  schema: templateCreateResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
      },
      '/api/v1/templates/preview': {
        get: {
          tags: ['Templates'],
          summary: 'Preview de template',
          description: 'Endpoint para gerar preview de um template',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'Preview gerado com sucesso',
              content: {
                'application/json': {
                  schema: templatePreviewResponseSchema,
                },
              },
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
      },
      '/api/v1/templates/{id}': {
        get: {
          tags: ['Templates'],
          summary: 'Buscar template por ID',
          description: 'Endpoint para buscar um template específico pelo ID',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do template',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Template encontrado com sucesso',
              content: {
                'application/json': {
                  schema: templateResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Template não encontrado',
            },
          },
        },
        put: {
          tags: ['Templates'],
          summary: 'Atualizar template',
          description: 'Endpoint para atualizar um template existente',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do template',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: updateTemplateSchema.shape.body,
              },
            },
          },
          responses: {
            200: {
              description: 'Template atualizado com sucesso',
              content: {
                'application/json': {
                  schema: templateUpdateResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Template não encontrado',
            },
          },
        },
        delete: {
          tags: ['Templates'],
          summary: 'Excluir template',
          description: 'Endpoint para excluir um template',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do template',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Template excluído com sucesso',
              content: {
                'application/json': {
                  schema: templateDeleteResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Template não encontrado',
            },
          },
        },
      },
      '/api/v1/templates/{id}/activate': {
        patch: {
          tags: ['Templates'],
          summary: 'Ativar template',
          description: 'Endpoint para ativar um template',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do template',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Template ativado com sucesso',
              content: {
                'application/json': {
                  schema: templateActivateResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Template não encontrado',
            },
          },
        },
      },
      '/api/v1/templates/{id}/deactivate': {
        patch: {
          tags: ['Templates'],
          summary: 'Desativar template',
          description: 'Endpoint para desativar um template',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do template',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Template desativado com sucesso',
              content: {
                'application/json': {
                  schema: templateDeactivateResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Template não encontrado',
            },
          },
        },
      },
      // Rotas de Subscription
      '/api/v1/subscriptions': {
        get: {
          tags: ['Inscrições'],
          summary: 'Listar inscrições',
          description: 'Endpoint para listar inscrições com filtros opcionais',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'status',
              in: 'query',
              required: false,
              description: 'Filtrar por status da inscrição',
              schema: {
                type: 'string',
                enum: ['A', 'I', 'C'],
                example: 'A',
              },
            },
            {
              name: 'isActive',
              in: 'query',
              required: false,
              description: 'Filtrar por status de ativação',
              schema: {
                type: 'boolean',
                example: true,
              },
            },
          ],
          responses: {
            200: {
              description: 'Inscrições listadas com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionListResponseSchema,
                },
              },
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
        post: {
          tags: ['Inscrições'],
          summary: 'Criar inscrição',
          description:
            'Endpoint para criar uma nova inscrição. Se o usuário não existir, será criado automaticamente. Apenas uma inscrição ativa por usuário é permitida.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: createSubscriptionSchema.shape.body,
              },
            },
          },
          responses: {
            201: {
              description: 'Inscrição criada com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionCreateResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            409: {
              description: 'Usuário já possui uma inscrição ativa',
            },
          },
        },
      },
      '/api/v1/subscriptions/email/{email}': {
        get: {
          tags: ['Inscrições'],
          summary: 'Buscar inscrições por email',
          description:
            'Endpoint para buscar inscrições de um usuário específico pelo email',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'email',
              in: 'path',
              required: true,
              description: 'Email do usuário',
              schema: {
                type: 'string',
                format: 'email',
                example: 'joao@email.com',
              },
            },
          ],
          responses: {
            200: {
              description: 'Inscrições encontradas com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionListResponseSchema,
                },
              },
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
          },
        },
      },
      '/api/v1/subscriptions/{id}': {
        get: {
          tags: ['Inscrições'],
          summary: 'Buscar inscrição por ID',
          description: 'Endpoint para buscar uma inscrição específica pelo ID',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da inscrição',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Inscrição encontrada com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Inscrição não encontrada',
            },
          },
        },
        put: {
          tags: ['Inscrições'],
          summary: 'Atualizar inscrição',
          description: 'Endpoint para atualizar uma inscrição existente',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da inscrição',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: updateSubscriptionSchema.shape.body,
              },
            },
          },
          responses: {
            200: {
              description: 'Inscrição atualizada com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionUpdateResponseSchema,
                },
              },
            },
            400: {
              description: 'Dados inválidos',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Inscrição não encontrada',
            },
          },
        },
        delete: {
          tags: ['Inscrições'],
          summary: 'Excluir inscrição',
          description: 'Endpoint para excluir uma inscrição',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da inscrição',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Inscrição removida com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionDeleteResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Inscrição não encontrada',
            },
          },
        },
      },
      '/api/v1/subscriptions/{id}/activate': {
        patch: {
          tags: ['Inscrições'],
          summary: 'Ativar inscrição',
          description: 'Endpoint para ativar uma inscrição',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da inscrição',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Inscrição ativada com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionActivateResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Inscrição não encontrada',
            },
          },
        },
      },
      '/api/v1/subscriptions/{id}/deactivate': {
        patch: {
          tags: ['Inscrições'],
          summary: 'Desativar inscrição',
          description: 'Endpoint para desativar uma inscrição',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da inscrição',
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Inscrição desativada com sucesso',
              content: {
                'application/json': {
                  schema: subscriptionDeactivateResponseSchema,
                },
              },
            },
            400: {
              description: 'ID inválido',
            },
            401: {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            403: {
              description: 'Acesso negado - Apenas administradores',
            },
            404: {
              description: 'Inscrição não encontrada',
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  });

  const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');
  fs.writeFileSync(openapiPath, JSON.stringify(document, null, 2));

  return document;
};
