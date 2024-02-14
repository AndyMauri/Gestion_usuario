import { UserService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<import("./users.entity").Users[]>;
    findOne(id: string): Promise<import("./users.entity").Users>;
    create(createUserDto: CreateUserDto): Promise<import("./users.entity").Users>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./users.entity").Users>;
    remove(id: string): Promise<void>;
}
