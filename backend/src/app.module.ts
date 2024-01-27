import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoplistModule } from './shoplist/shoplist.module';
import { ShopListItem } from './shoplist/shoplistitem.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/app/frontend/',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cookie.db',
      entities: [ShopListItem],
      synchronize: true,
    }),
    ShoplistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
