import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { userRepository } from './user.repositories';
import { CryptoService } from './utils/bcrypt.util';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, userRepository, CryptoService],
})
export class UserModule {}
