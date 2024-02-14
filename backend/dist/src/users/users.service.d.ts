import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<Users>);
    findAll(): Promise<Users[]>;
    findOne(id: number): Promise<Users>;
    create(createUserDto: CreateUserDto): Promise<Users>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<Users>;
    remove(id: number): Promise<void>;
}
