import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

//Add
import { CloudinaryResponse } from './files-response';
const streamifier = require('streamifier');

@Injectable()
export class FilesService {
  
  //Creación
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {

    return new Promise<CloudinaryResponse>(
      
      (resolve, reject) => {
        
        const uploadStream = cloudinary.uploader.upload_stream(
          
          (error, result) => {

            if (error) return reject(error);
            resolve(result);

          },

        );
        
        //Este es el archivo
        streamifier.createReadStream(file.buffer).pipe(uploadStream);

      }

    );

  }

  //El mismo crear de arriba pero SIN asignación automática de nombre
  uploadFileWithName(file: Express.Multer.File, publicId?: string): Promise<CloudinaryResponse> {

    return new Promise<CloudinaryResponse>(
      
      (resolve, reject) => {
        
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: publicId },
          (error, result) => {

            if (error) return reject(error);
            resolve(result);

          },

        );
        
        //Este es el archivo
        streamifier.createReadStream(file.buffer).pipe(uploadStream);

      }

    );

  }

  //Eliminación
  deleteFile(name: string): Promise<CloudinaryResponse> {
    return cloudinary.uploader.destroy(name);
  }

}
