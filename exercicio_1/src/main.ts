import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('API de Empacotamento - Seu Manoel')
    .setDescription('API para calcular o empacotamento ideal de produtos nas caixas disponíveis')
    .setVersion('1.0')
    .addTag('packing')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(PORT);
  
  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log(`📚 Swagger documentation: http://localhost:${PORT}/api`);
}
bootstrap();