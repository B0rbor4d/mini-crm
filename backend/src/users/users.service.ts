import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto, ChangePasswordDto, UpdateUserDto, CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.findById(id);
    Object.assign(user, updateProfileDto);
    const updated = await this.userRepository.save(user);
    
    // Return without password
    const { password, ...result } = updated;
    return result;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(changePasswordDto.newPassword, salt);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    const saved = await this.userRepository.save(user);
    
    // Return without password
    const { password, ...result } = saved;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    const updated = await this.userRepository.save(user);
    
    // Return without password
    const { password, ...result } = updated;
    return result;
  }

  async remove(id: string) {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
