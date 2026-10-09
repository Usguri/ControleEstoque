import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CategoriaModule } from './categoria/categoria.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ProdutosModule } from './produtos/produtos.module';
import { ListaComprasModule } from './lista-compras/lista-compras.module';
import { MailModule } from './mail/mail.module';
import { ClientesModule } from './clientes/clientes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      autoLoadEntities: true,
      extra: {
        max: 20,
        min: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      },
      synchronize: process.env.NODE_ENV != 'production',
    }),
    UserModule,
    CategoriaModule,
    EmpresaModule,
    ProdutosModule,
    ListaComprasModule,
    MailModule,
    AuthModule,
    ClientesModule,
  ],
  providers: [AppService],
})
export class AppModule {}
