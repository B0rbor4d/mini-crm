import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AuthModule } from '../auth/auth.module';
import { Customer, Contact } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Contact]), AuthModule],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule {}
