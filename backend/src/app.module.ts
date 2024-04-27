import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoplistModule } from './shoplist/shoplist.module.js';
import { ShopListItemEntity } from './shoplist/shoplistitem.entity.js';
import { LoggerMiddleware } from './middleware/logger.middleware.js';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/app/frontend/',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cookie.db',
      entities: [ShopListItemEntity],
      synchronize: true,
    }),
    ShoplistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
