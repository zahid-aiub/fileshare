import {
  HttpStatus,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { User } from '../user/entities/user.entity';
import { FileRepository } from './file.repository';
import { File } from './entities/file.entity';
const crypto = require('crypto');
const fs = require('fs');

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  async uploadedFile(file: Express.Multer.File, user: User) {
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
    file1.hash = finalHex;
    file1.userId = user.userId;
    dbFile ? (file1.isBlockListed = true) : false;
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

  /* async uploadedFileToS3(file: Express.Multer.File, subFolder: string) {
         this.storageService.s3_upload(
             file,
             'islamiboiv2',
             file.filename,
             file.mimetype,
         );
         const response = {
             originalName: file.originalname,
             filename: file.filename,
         };
         return {
             status: HttpStatus.OK,
             message: 'Image uploaded successfully!',
             data: response,
         };
     }*/

  /*async upload(file, folderName: any = 'banner') {
    const originalName = file.originalname;
    const bucketS3 = 'islamiboiv2';
    // return await this.uploadS3(file.buffer, bucketS3, originalName, folderName);
  }*/

  async uploadBulk(file, fileName: string, folderName: string) {
    // const bucketS3 = '';
    // return await this.uploadS3Bulk(file, bucketS3, fileName, folderName);
  }

  /*async uploadS3(file, bucket, name, folderName) {
    const s3 = this.s3();
    const urlKey = folderName + '/' + name;
    const params = {
      Bucket: bucket,
      Key: urlKey,
      Body: file,
      ACL: 'public-read-write',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve({
          status: HttpStatus.OK,
          message: 'Image uploaded successfully!',
          data: {
            originalName: name,
            filename: data.Location,
          },
        });
      });
    });
  }*/

  /*async uploadS3Bulk(file, bucket, name, folderName) {
    const s3 = this.s3();
    const urlKey = folderName + '/' + name;
    const params = {
      Bucket: bucket,
      Key: urlKey,
      Body: file,
      ACL: 'public-read-write',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data.Location);
      });
    });
  }*/

  /*s3() {
    return new S3({
      accessKeyId: 'AKIA4BDQYL4CQRVHDVW5',
      secretAccessKey: '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',
    });
  }*/

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

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
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
}
