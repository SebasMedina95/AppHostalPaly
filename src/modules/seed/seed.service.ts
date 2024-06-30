import { Injectable,
         Logger, 
         UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaService } from '../../config/prisma/prisma.service';
import { FilesService } from '../../helpers/uploads/files.service';

import { SEED_USERS } from './data/users.data';
import { SEED_COMFORTS } from './data/comforts.data';
import { SEED_PLANS } from './data/plans.data';


@Injectable()
export class SeedService {

    private stage : boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly cloudinaryService: FilesService,
        private prisma: PrismaService
    ){
        this.stage = configService.get('STAGE') === "pdxn";
    }


    async executeSeed(): Promise<boolean>{

        const logger = new Logger('executeSeed');
        //1. Verificar que estemos en desarrollo para ejecutarlo
        if( this.stage ){
            logger.log(`Esta instrucción no puede ser ejecutada en PDXN`);
            throw new UnauthorizedException("Esta instrucción no puede ser ejecutada en PDXN");
        }

        //2. Limpiamos la base de datos
        const cleanDataBase = await this.cleanDataBase();

        if( !cleanDataBase ){
            logger.log(`Ocurrió un error ejecutando la LIMPIEZA DE LA BASE DE DATOS`);
            return false;
        }

        //3. Reseteamos los indices
        const resetSecuencesDb = await this.resetSecuencesDb();

        if( !resetSecuencesDb ){
            logger.log(`Ocurrió un error ejecutando el RESETEO DE LOS ÍNDICES DE LA BASE DE DATOS`);
            return false;
        }

        //4. Poblamos la base de datos
        const seedUser = await this.seedUsers();
        if( !seedUser ){
            logger.log(`Ocurrió un error ejecutando el SEED de USUARIOS`);
            return false;
        }

        const seedPlan = await this.seedPlans();
        if( !seedPlan ){
            logger.log(`Ocurrió un error ejecutando el SEED de PLANES`);
            return false;
        }

        const seedCategories = await this.seedCategories();
        if( !seedCategories ){
            logger.log(`Ocurrió un error ejecutando el SEED de CATEGORIAS`);
            return false;
        }

        const seedComforts = await this.seedComforts();
        if( !seedComforts ){
            logger.log(`Ocurrió un error ejecutando el SEED de COMODIDADES`);
            return false;
        }

        const seedRooms = await this.seedRooms();
        if( !seedRooms ){
            logger.log(`Ocurrió un error ejecutando el SEED de HABITACIONES`);
            return false;
        }

        const seedReservations = await this.seedReservations();
        if( !seedReservations ){
            logger.log(`Ocurrió un error ejecutando el SEED de RESERVACIONES`);
            return false;
        }

        return true;

    }

    async cleanDataBase(): Promise<boolean>{

        const logger = new Logger('cleanDataBase');

        //Limpiamos en orden, muy importante
        //1. Eliminamos imágenes de habitación. //*NOTA: También del Cloudinary
        const getImages = await this.prisma.tBL_DTL_IMAGES_CATEGORIES.findMany({});
        if( getImages.length > 0 ){
            for (const iterDelete of getImages) {
                const getImg = iterDelete.url;
                if( getImg != null || getImg != "default.png" ){
                    const arrayName = getImg.split('/'); 
                    const getName = arrayName[arrayName.length - 1];
                    const [ name , ext ] = getName.split('.');
                    await this.cloudinaryService.deleteFile(name);
                }
            }
        }
        await this.prisma.tBL_DTL_IMAGES_CATEGORIES.deleteMany({});

        //2. Detalles de comodidades
        await this.prisma.tBL_DTL_COMFORTS_CATEGORIES.deleteMany({});

        //3. Comodidades
        await this.prisma.tBL_COMFORTS.deleteMany({});

        //4. Reservas
        await this.prisma.tBL_RESERVATIONS.deleteMany({});

        //5. Habitaciones
        await this.prisma.tBL_ROOMS.deleteMany({});

        //6. Categorías
        await this.prisma.tBL_CATEGORIES.deleteMany({});

        //7. Planes. //*NOTA: También del Cloudinary
        const getPlans = await this.prisma.tBL_PLANS.findMany({});
        if( getPlans.length > 0 ){
            for (const iterDelete of getPlans) {
                const getImg = iterDelete.urlImage;
                if( getImg != null || getImg != "default.png" ){
                    const arrayName = getImg.split('/'); 
                    const getName = arrayName[arrayName.length - 1];
                    const [ name , ext ] = getName.split('.');
                    await this.cloudinaryService.deleteFile(name);
                }
            }
        }
        await this.prisma.tBL_PLANS.deleteMany({});

        //8. Usuarios. //*NOTA: También eliminar avatar de Cloudinary
        const getUsers = await this.prisma.tBL_USERS.findMany({});

        if( getUsers.length > 0 ){
            for (const iterDelete of getUsers) {
                const getImg = iterDelete.img;
                if( getImg || 
                    getImg != undefined || 
                    getImg != null || 
                    getImg != "default.png" 
                ){

                    const arrayName = getImg.split('/'); 
                    const getName = arrayName[arrayName.length - 1];
                    const [ name , ext ] = getName.split('.');
                    await this.cloudinaryService.deleteFile(name);

                }
            }
        }
        await this.prisma.tBL_USERS.deleteMany({});

        logger.log(`SEED de cleanDataBase ejecutado con éxito`);
        return true;
    }

    async resetSecuencesDb(): Promise<boolean>{

        const sequences: { sequence_name: string }[] = await this.prisma.$queryRaw`
            SELECT sequence_name
            FROM information_schema.sequences
            WHERE sequence_schema = 'public';
        `;

        let count = 0;
        for (const { sequence_name } of sequences) {
            if (count !== 0) {
                await this.prisma.$executeRawUnsafe(`ALTER SEQUENCE "${sequence_name}" RESTART WITH 1`);
            }
            count++;
        }

        return true

    }

    async seedUsers(): Promise<boolean> {

        const logger = new Logger('seedUsers');
        await this.prisma.tBL_USERS.createMany({ data: SEED_USERS });

        //Vamos a cargar las imágenes
        const userImagesDir = path.join(__dirname, '../../../src/modules/seed/images/users');
        const imageFiles = fs.readdirSync(userImagesDir);
        let urlsCloudinary: string[] = [];

        for (const file of imageFiles){

            const filePath = path.join(userImagesDir, file);
            const fileContent = fs.readFileSync(filePath);

            // Simular Express.Multer.File ya que recibimos es un Buffer en este caso
            const multerFile: Express.Multer.File = {
                fieldname: file,
                originalname: file,
                encoding: '7bit',
                mimetype: 'image/jpeg', // Cambia esto según el tipo de archivo
                size: fileContent.length,
                buffer: fileContent,
                destination: '',
                filename: '',
                path: '',
                stream: fs.createReadStream(filePath),
            };

            const uploadResult = await this.cloudinaryService.uploadFileWithName(multerFile, file);
            urlsCloudinary.push(uploadResult.url);

        }

        //Ahora adjuntemos las imágenes a los registros:
        for (const iterImages of urlsCloudinary) {
            //Obtengamos el nombre de la imagen
            const arrayName = iterImages.split('/');
            const getName = arrayName[arrayName.length - 1];
            const [ name , ext ] = getName.split('.');
            const nameNumeric: number = Number(name);

            await this.prisma.tBL_USERS.update({
                where: { id: nameNumeric },
                data: { img: iterImages } 
            })

        }

        logger.log(`SEED de seedUsers ejecutado con éxito`);
        return true;
    }

    async seedCategories(): Promise<boolean> {
        const logger = new Logger('seedCategories');
        logger.log(`SEED de seedCategories ejecutado con éxito`);
        return true;
    }

    async seedComforts(): Promise<boolean> {
        const logger = new Logger('seedComforts');

        await this.prisma.tBL_COMFORTS.createMany({ data: SEED_COMFORTS });

        logger.log(`SEED de seedComforts ejecutado con éxito`);
        return true;
    }

    async seedRooms(): Promise<boolean> {
        const logger = new Logger('seedRooms');
        logger.log(`SEED de seedRooms ejecutado con éxito`);
        return true;
    }

    async seedPlans(): Promise<boolean> {

        const logger = new Logger('seedPlans');
        await this.prisma.tBL_PLANS.createMany({ data: SEED_PLANS });

        //Vamos a cargar las imágenes
        const userImagesDir = path.join(__dirname, '../../../src/modules/seed/images/plans');
        const imageFiles = fs.readdirSync(userImagesDir);
        let urlsCloudinary: string[] = [];

        for (const file of imageFiles){

            const filePath = path.join(userImagesDir, file);
            const fileContent = fs.readFileSync(filePath);

            // Simular Express.Multer.File ya que recibimos es un Buffer en este caso
            const multerFile: Express.Multer.File = {
                fieldname: file,
                originalname: file,
                encoding: '7bit',
                mimetype: 'image/jpeg', // Cambia esto según el tipo de archivo
                size: fileContent.length,
                buffer: fileContent,
                destination: '',
                filename: '',
                path: '',
                stream: fs.createReadStream(filePath),
            };

            const uploadResult = await this.cloudinaryService.uploadFileWithName(multerFile, `${file}p`);
            urlsCloudinary.push(uploadResult.url);

        }

        //Ahora adjuntemos las imágenes a los registros:
        for (const iterImages of urlsCloudinary) {
            //Obtengamos el nombre de la imagen
            const arrayName = iterImages.split('/');
            const getName = arrayName[arrayName.length - 1];
            const [ name , ext ] = getName.split('.');

            //Hacemos esta conversión porque los nombres son del tipo #p.jpg/png
            const number = name.match(/\d+/)[0]; // Extrae el número
            const letter = name.match(/[a-zA-Z]/)[0]; // Extrae la letra (quedará p)

            const nameNumeric: number = Number(number);

            await this.prisma.tBL_PLANS.update({
                where: { id: nameNumeric },
                data: { urlImage: iterImages } 
            })

        }

        logger.log(`SEED de seedPlans ejecutado con éxito`);
        return true;
    }

    async seedReservations(): Promise<boolean> {
        const logger = new Logger('seedReservations');
        logger.log(`Ocurrió un error ejecutando el SEED de seedReservations`);
        return true;
    }

}
