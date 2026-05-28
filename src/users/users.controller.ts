import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    await this.usersService.create(body.email, body.password);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }
}
