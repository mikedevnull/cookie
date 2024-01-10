import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/app/frontend/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
