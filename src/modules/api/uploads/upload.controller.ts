import { Controller,
         Logger,
         Param,
         ParseFilePipe,
         Post,
         UploadedFile,
         UploadedFiles,
         UseGuards, 
         UseInterceptors} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

import { UploadsService } from "./upload.service";

import { User } from "../../../modules/users/entities/user.entity";
import { JwtAuthGuard } from "../../../modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../../modules/auth/decorators/current-user.decorator";
import { CategoriesService } from "../../../modules/categories/categories.service";
import { UsersService } from "../../../modules/users/users.service";

import { CustomError } from "../../../helpers/errors/custom.error";
import { FilesService } from "../../../helpers/uploads/files.service";
import { MaxFileSizeValidator } from "../../../helpers/validators/max-file-size-validator";
import { FileTypeValidator } from "../../../helpers/validators/file-type-validator";

import { ValidRoles } from "../../../constants/roles.enum";
import { IErrorImages } from "./interfaces/images.interfaces";
import { IResponseChargeImageUser, IResponseChargeRooms } from "./interfaces/charge-rooms.interface";



@Controller('uploads')
@UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
export class UploadsController {

    constructor(
        private readonly uploadsService: UploadsService,
        private readonly cloudinaryService: FilesService,
        private readonly categoryService: CategoriesService,
        private readonly userService: UsersService
    ) {}

    @Post('rooms/:id')
    @UseInterceptors(FilesInterceptor('imagesRooms', 10))
    async uploadImagesRooms(
        @Param('id') id: number,
        @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ): Promise<IResponseChargeRooms | CustomError> {

        const logger = new Logger('UploadsController - uploadImagesRooms');

        //Validamos que vengan archivos
        if( !files || files == null || files == undefined ){
            logger.error(`No se proporcionaron imágenes para usar la funcionalidad`);
            throw CustomError.badRequestError("No se proporcionaron imágenes para usar la funcionalidad");
        }

        //Traigamos la categoría asociada
        const getCategory = await this.categoryService.findOne(id);

        if( getCategory instanceof CustomError ){
            throw CustomError.badRequestError("No encontramos una categoría para anexar las imágenes");
        }

        //Validamos formatos Validamos tamaños
        const maxFileSizeValidator = new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }); // 4 MB
        const fileTypeValidator = new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' });

        let errorsImages: IErrorImages[] = [];
        let imagesNames: string[] = [];
        for (const iterImgs of files) {
            
            if (!maxFileSizeValidator.isValid(iterImgs)) {
              errorsImages.push({
                error: "El tamaño de la imagen sobrepasa las 4MB",
                fileError: iterImgs.originalname
              });
            }

            if (!fileTypeValidator.isValid(iterImgs)) {
              errorsImages.push({
                error: "El formato de la imagen es diferente a .(png|jpg|jpeg)",
                fileError: iterImgs.originalname
              });
            }

            imagesNames.push(iterImgs.originalname);
            
        }

        if( errorsImages.length > 0 ){
            return {
                information: "Hay errores en las imágenes que se desean adjuntar",
                category: getCategory,
                errors: errorsImages,
                images: imagesNames
            }
        }

        //Agregamos lo nuevo en Cloudinary (Imágenes)
        let urlsCloudinary: string[] = [];
        for (const iterUploadFiles of files) {

            let executeFile = await this.cloudinaryService.uploadFile(iterUploadFiles);
            urlsCloudinary.push(executeFile.url);
            
        }

        const saveDetailsImages = await this.uploadsService.uploadImagesRooms(id, urlsCloudinary, user);

        if( saveDetailsImages ){

            return {
                information: "Imágenes cargadas correctamente",
                category: getCategory,
                errors: [],
                images: urlsCloudinary
            }

        }

        throw CustomError.badRequestError("No puedo ser guardada la información de las imágenes");

    }

    @Post('user/:id')
    @UseInterceptors(FileInterceptor('imageUser'))
    async uploadImageUser(
        @Param('id') id: number,
        @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<IResponseChargeImageUser | CustomError> {

        const logger = new Logger('UploadsController - uploadImageUser');

        //Validamos que vengan archivos
        if( !file || file == null || file == undefined ){
            logger.error(`No se ha proporcionado ninguna imagen para usar la funcionalidad`);
            throw CustomError.badRequestError("No se ha proporcionado ninguna imagen para usar la funcionalidad");
        }

        //Traigamos el usuario asociado
        const getUser = await this.userService.findOneById(id);

        if( getUser instanceof CustomError ){
            throw CustomError.badRequestError("No encontramos un usuario para anexar la imagen");
        }

        //Validamos formatos Validamos tamaños
        const maxFileSizeValidator = new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }); // 4 MB
        const fileTypeValidator = new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' });

        if (!maxFileSizeValidator.isValid(file)) {
            return {
                information: "El tamaño de la imagen no puede exceder los 4MB",
                user: getUser,
                image: file.originalname
            }
        }
        
        if (!fileTypeValidator.isValid(file)) {
            return {
                information: "El tipo de archivo de la imagen no puede ser diferente a .(png|jpg|jpeg)",
                user: getUser,
                image: file.originalname
            }
        }

        const executeFile = await this.cloudinaryService.uploadFile(file);
        const getUrl: string = executeFile.url;

        const saveImage = await this.uploadsService.uploadImageUser(id, getUrl);

        if( saveImage ){

            return {
                information: "Imagen actualizada con éxito",
                user: getUser,
                image: file.originalname
            }

        }else{

            return {
                information: "Ocurrió un error al intentar actualizar la imagen",
                user: getUser,
                image: file.originalname
            }

        }

    }

}