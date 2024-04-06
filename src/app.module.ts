import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfig ]
    }),
    ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
