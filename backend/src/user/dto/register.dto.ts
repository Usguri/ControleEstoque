// import {
//   IsString,
//   IsNotEmpty,
//   MinLength,
//   IsBoolean,
//   IsOptional,
// } from 'class-validator';

// export class RegisterDto {
//   @IsString()
//   @IsNotEmpty({ message: 'Usuário é obrigatório' })
//   usuario: string;

//   @IsString()
//   @IsNotEmpty({ message: 'Senha é obrigatória' })
//   @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
//   senha: string;

//   @IsBoolean()
//   @IsOptional()
//   user_ativo?: boolean;
// }
