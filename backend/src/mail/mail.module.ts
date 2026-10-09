import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'princesa.acessorios2024@gmail.com', // prod - empresa
          pass: 'emax yaxl wctf qzfw', // prod - empresa
          // user: 'vinemendes176@gmail.com',
          // pass: 'nrbr fdfh lvje gpak', // dev meu
        },
      },
      defaults: {
        from: '"Princesa Acessórios" <princesa.acessorios2024@gmail.com>',
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
