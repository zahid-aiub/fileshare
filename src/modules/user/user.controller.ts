import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
  UploadedFiles, UseGuards, Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../../common/response/api.response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from '../../common/utils/file-upload.utils';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {EApprovalRequest} from "../../core/enums/approval.request.enum";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('test')
  async loginToTucPortal(): Promise<void> {
    return this.userService.loginToTucPortal();
  }

  @Post('uploadMultipleFiles')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalame: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return {
      status: HttpStatus.OK,
      message: 'Images uploaded successfully!',
      data: response,
    };
  }

  @Get(':fileName')
  findOne1(@Param('fileName') image, @Res() res) {
    const imagePath = image && image.split('|').join('/');
    const response = res.sendFile(imagePath, { root: './files/' });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
