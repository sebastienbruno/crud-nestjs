import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('CRUD Nestjs')
    .setDescription('This NestJS API allows you to get informations about barcode through the Open Food Facts API. <br/>The main services are protected by an authentification mode (json web token).<br/>The firts step is to register an user (/register).<br/> Then you have to log in (/login) with this user. In return of this service you will obtain a token.<br/>Finally you can consume with this token the API\'s services and get informations about product thanks to its barcode (/products/<barcode>).')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  //console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
