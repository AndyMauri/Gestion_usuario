import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function configureCors(app) {
  // Configurar CORS aquí
  app.enableCors();
}

async function startApp() {
  const app = await NestFactory.create(AppModule);
  await configureCors(app);
  await app.listen(3000);
}

startApp();
