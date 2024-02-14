// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<Users> {
    return this.userRepository.findOne({where: {id}});
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const existingUser = await this.userRepository.findOne({where: {id}}); // Buscar el usuario existente
    if (!existingUser) {
      throw new Error('User not found'); // Manejar el caso en el que el usuario no existe
    }

    // Actualizar solo los campos proporcionados en el DTO de actualización
    if (updateUserDto.name) {
      existingUser.name = updateUserDto.name;
    }
    if (updateUserDto.email) {
      existingUser.email = updateUserDto.email;
    }
    if (updateUserDto.age) {
      existingUser.age = updateUserDto.age;
    }

    await this.userRepository.save(existingUser); // Guardar los cambios en la base de datos
    return existingUser;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
