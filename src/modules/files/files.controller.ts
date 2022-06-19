import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {
  editFileName,
  imageFileFilter,
} from '../../common/utils/file-upload.utils';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import fs from 'fs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesEnum } from '../../core/enums/roles.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { EApprovalRequest } from '../../core/enums/approval.request.enum';
import { File } from './entities/file.entity';
import { NotFoundException } from '../../common/exceptions/not-found.exception';

@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getFiles(@Request() req) {
    return this.filesService.findAll(req.user);
  }

  @Get('/all')
  getAllFiles() {
    return this.filesService.findAllFiles();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  async uploadedFile(@UploadedFile() file, @Request() req) {
    return await this.filesService.uploadedFile(file, req.user);
  }

  @Post('public/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  async uploadedPubFile(@UploadedFile() file) {
    return await this.filesService.uploadedFile(file);
  }

  @Post('uploadMultipleFiles')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      // fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileResponse);
    });
    return {
      status: HttpStatus.OK,
      message: 'Images uploaded successfully!',
      data: response,
    };
  }

  @Get('download/:id')
  async getFile(@Param('id') id, @Res() res) {
    const dbFile = await this.filesService.findOne(id);
    if (dbFile && dbFile?.isBlockListed) {
      return new NotFoundException('File is BlockListed', 400);
    } else {
      const file = dbFile.filename;
      const imagePath = file && file.split('|').join('/');
      const response = res.sendFile(imagePath, { root: './files/' });
      return {
        status: HttpStatus.OK,
        data: response,
      };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }

  @Put('request-for-unblock/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.USER)
  fileUnblockRequest(@Param('id') fileId) {
    return this.filesService.createUnblockRequest(fileId);
  }

  @Put('pub/request-for-unblock/:id')
  pubFileUnblockRequest(@Param('id') fileId) {
    return this.filesService.createUnblockRequest(fileId);
  }

  @Post('approval-resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  handleApproval(
    @Param('fileId') fileId,
    @Param('approvalReq') approvalReq: EApprovalRequest,
  ) {
    return this.filesService.unblockRequestApproval(fileId, approvalReq);
  }

  @Post('bulk-upload')
  async bulkUpload() {
    const success = 0;
    const fail = 0;
    const rootFloder = './files/products/';
    await fs.readdir(rootFloder, (err, files) => {
      files.forEach((singleFolder) => {
        fs.readdir(rootFloder + singleFolder, (err, files) => {
          const productId = rootFloder;
          const product = null;
          if (product) {
            const count = 0;
            files.forEach((file, index) => {
              console.log(singleFolder);
              try {
                const base64 = fs.readFileSync(
                  rootFloder + singleFolder + '/' + file,
                  'base64',
                );
                const buffer = Buffer.from(base64, 'base64');
                this.filesService
                  .uploadBulk(buffer, file, 'products')
                  .then(async (res) => {
                    // todo: insert res to db

                    console.log(res);
                    // const obj = new Image();
                    // obj.path = res.toString();
                    // obj.orderPosition = count;
                    // await this.imageRepository.save(obj);
                    // count++;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } catch (err) {
                console.log(err);
              }
            });
          }
        });
      });
    });
    return {
      success: 33,
      fail: fail,
    };
    // return await this.filesService.bulkUpload();
  }
}
