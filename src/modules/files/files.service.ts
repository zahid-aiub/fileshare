import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { User } from '../user/entities/user.entity';
import { FileRepository } from './file.repository';
import { File } from './entities/file.entity';
import { EApprovalRequest } from '../../core/enums/approval.request.enum';
import { NotFoundException } from '../../common/exceptions/not-found.exception';

const crypto = require('crypto');
const fs = require('fs');

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  async uploadedFile(file: Express.Multer.File, user?: User) {
    if (file.size / 1000000 > 10) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry! File size grater than 10MB',
      };
    }

    console.log(file.path);
    const fileBuffer = fs.readFileSync(file.path);
    const hash = crypto.createHash('sha256');
    const finalHex = hash.update(fileBuffer).digest('hex');
    console.log(finalHex);
    const dbFile = await this.findFileByHash(finalHex);

    const file1 = new File();
    file1.filename = file.filename;
    file1.size = file.size;
    file1.hash = finalHex;
    file1.userId = user?.userId;
    dbFile ? (file1.isBlockListed = true) : false;
    dbFile ? (file1.approvalRequest = EApprovalRequest.BLOCK_LISTED) : null;
    await this.fileRepository.save(file1);

    const response = {
      originalName: file.originalname,
      filename: file.filename,
    };
    return {
      status: HttpStatus.OK,
      message: 'Image uploaded successfully!',
      data: response,
    };
  }

  async uploadBulk(file, fileName: string, folderName: string) {
    return null;
  }

  async moveToOriginalDirectory(pathToFile: any, pathToNewDestination: any) {
    await fs.copyFile(pathToFile, pathToNewDestination, function (err) {
      if (err) {
        throw err;
      } else {
        console.log('Successfully copied and moved the file!');
        try {
          fs.unlinkSync(pathToFile);
          console.log(pathToFile + ' File is Removed from old directory.');
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  findAll(user: User) {
    return this.fileRepository.find({
      where: {
        userId: user.userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findAllFiles() {
    return this.fileRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.fileRepository.findOne(id);
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  private findFileByHash(finalHex: string) {
    return this.fileRepository.findOne({
      where: {
        hash: finalHex,
      },
    });
  }

  async createUnblockRequest(fileId) {
    const file = await this.fileRepository.findOne(fileId);
    if (file) {
      file.approvalRequest = EApprovalRequest.REQUEST_FOR_UNBLOCK;
      return this.fileRepository.save(file);
    } else {
      return new NotFoundException('File Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async unblockRequestApproval(fileId, request: EApprovalRequest) {
    const file = await this.fileRepository.findOne(fileId);
    if (file) {
      file.approvalRequest = request;
      if (request == EApprovalRequest.APPROVED) {
        file.isBlockListed = false;
      }
      return this.fileRepository.save(file);
    } else {
      return new NotFoundException('File Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
