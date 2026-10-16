import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const email = this.normalizeEmail(createUserDto.email);
    this.ensureEmailIsFree(email);

    const user: User = {
      id: randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    if (updateUserDto.email !== undefined) {
      const email = this.normalizeEmail(updateUserDto.email);
      this.ensureEmailIsFree(email, id);
      updateUserDto.email = email;
    }

    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: string): void {
    const user = this.findOne(id);
    this.users.splice(this.users.indexOf(user), 1);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private ensureEmailIsFree(email: string, ignoreId?: string): void {
    const taken = this.users.some(
      (u) => u.email === email && u.id !== ignoreId,
    );
    if (taken) {
      throw new ConflictException(`O email já está cadastrado`);
    }
  }
}
