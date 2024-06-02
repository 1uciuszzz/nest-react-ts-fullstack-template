import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** global pipe */
  app.useGlobalPipes(new ValidationPipe());

  /** swagger api document */
  const docConfig = new DocumentBuilder()
    .setTitle("API Reference")
    .setDescription("API Reference")
    .setVersion("1.0")
    .build();
  const doc = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup("api", app, doc);

  await app.listen(3000);
}
bootstrap();
