import { db } from '@/db/db.connection';
import { templates } from '@/db/schema/v1/template.schema';
import { logger } from '@/utils/core/logger.utils';
import { TemplateVariable } from '@/enums/v1/modules/template/template-variables.enum';
import { eq, and } from 'drizzle-orm';

export async function seedTemplates() {
  try {
    logger.info('Seeding templates...');

    const defaultTemplates = [
      {
        name: 'newsletter-minimal',
        description:
          'Template minimalista para newsletter com design preto e laranja',
        html: `
          <div class="container">
            <header class="header">
              <h1 class="logo">{{title}}</h1>
            </header>
            
            <main class="main-content">
              <h2 class="newsletter-title">{{subject}}</h2>
              <div class="content">
                {{content}}
              </div>
              
              <div class="image-section">
                <img src="{{imageUrl}}" alt="Newsletter Image" class="newsletter-image" />
              </div>
            </main>
            
            <footer class="footer">
              <p class="footer-text">Obrigado por se inscrever!</p>
              <p class="unsubscribe">
                <a href="#" class="footer-link">Cancelar inscrição</a>
              </p>
            </footer>
          </div>
        `,
        text: `
{{title}}

{{subject}}

{{content}}

Imagem: {{imageUrl}}

---
Obrigado por se inscrever!
Cancelar inscrição: [link]
        `,
        css: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
            color: #ffffff;
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          
          .header {
            background-color: #ff6600;
            padding: 20px;
            text-align: center;
          }
          
          .logo {
            color: #000000;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          
          .main-content {
            padding: 30px 20px;
          }
          
          .newsletter-title {
            color: #ff6600;
            font-size: 20px;
            margin-bottom: 20px;
            border-bottom: 2px solid #ff6600;
            padding-bottom: 10px;
          }
          
          .content {
            margin-bottom: 30px;
            font-size: 16px;
            color: #cccccc;
          }
          
          .image-section {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .newsletter-image {
            max-width: 100%;
            height: auto;
            border: 2px solid #ff6600;
            border-radius: 8px;
          }
          
          .footer {
            background-color: #111111;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #ff6600;
          }
          
          .footer-text {
            color: #cccccc;
            margin-bottom: 10px;
          }
          
          .unsubscribe {
            margin: 0;
          }
          
          .footer-link {
            color: #ff6600;
            text-decoration: none;
          }
          
          .footer-link:hover {
            text-decoration: underline;
          }
        `,
        variables: [
          TemplateVariable.TITLE,
          TemplateVariable.SUBJECT,
          TemplateVariable.CONTENT,
          TemplateVariable.IMAGE_URL,
        ],
        isActive: true,
      },
      {
        name: 'welcome-minimal',
        description:
          'Template minimalista de boas-vindas com design preto e laranja',
        html: `
          <div class="container">
            <header class="header">
              <div class="welcome-badge">BEM-VINDO</div>
              <h1 class="title">{{title}}</h1>
            </header>
            
            <main class="main-content">
              <div class="welcome-message">
                <h2 class="subject">{{subject}}</h2>
                <div class="content-box">
                  {{content}}
                </div>
                
                <div class="highlight-section">
                  <img src="{{imageUrl}}" alt="Welcome Image" class="welcome-image" />
                </div>
                
                <div class="cta-section">
                  <a href="#" class="cta-button">Começar Agora</a>
                </div>
              </div>
            </main>
            
            <footer class="footer">
              <p class="footer-text">Console News - Sua fonte de informação</p>
            </footer>
          </div>
        `,
        text: `
BEM-VINDO

{{title}}

{{subject}}

{{content}}

Imagem: {{imageUrl}}

[Começar Agora]

---
Console News - Sua fonte de informação
        `,
        css: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
            color: #ffffff;
            font-family: 'Arial', sans-serif;
          }
          
          .header {
            background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
            padding: 40px 20px;
            text-align: center;
            position: relative;
          }
          
          .welcome-badge {
            background-color: #000000;
            color: #ff6600;
            font-size: 12px;
            font-weight: bold;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 15px;
            letter-spacing: 1px;
          }
          
          .title {
            color: #000000;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          
          .main-content {
            padding: 40px 30px;
          }
          
          .subject {
            color: #ff6600;
            font-size: 22px;
            margin-bottom: 25px;
            text-align: center;
          }
          
          .content-box {
            background-color: #111111;
            padding: 25px;
            border-left: 4px solid #ff6600;
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.7;
            color: #cccccc;
          }
          
          .highlight-section {
            text-align: center;
            margin-bottom: 35px;
          }
          
          .welcome-image {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(255, 102, 0, 0.3);
          }
          
          .cta-section {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .cta-button {
            background-color: #ff6600;
            color: #000000;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
            transition: background-color 0.3s ease;
          }
          
          .cta-button:hover {
            background-color: #ff8533;
          }
          
          .footer {
            background-color: #111111;
            padding: 25px;
            text-align: center;
            border-top: 2px solid #ff6600;
          }
          
          .footer-text {
            color: #888888;
            font-size: 14px;
          }
        `,
        variables: [
          TemplateVariable.TITLE,
          TemplateVariable.SUBJECT,
          TemplateVariable.CONTENT,
          TemplateVariable.IMAGE_URL,
        ],
        isActive: true,
      },
    ];

    for (const template of defaultTemplates) {
      const existingTemplate = await db
        .select()
        .from(templates)
        .where(
          and(
            eq(templates.name, template.name),
            eq(templates.isActive, template.isActive),
          ),
        )
        .limit(1);

      if (existingTemplate.length === 0) {
        await db.insert(templates).values(template);
      }
    }

    logger.info('Templates seeded successfully');
  } catch (error) {
    logger.error('Error seeding templates:', error);

    throw error;
  }
}

if (require.main === module) {
  seedTemplates()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Failed to seed templates:', error);
      process.exit(1);
    });
}
