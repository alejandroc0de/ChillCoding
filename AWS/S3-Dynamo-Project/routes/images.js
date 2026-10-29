import { Router } from "express"; 

import multer from "multer"; // Para poder subir fotos
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { s3Client, ddbDocClient } from "../config/aws.js"; // Los clientes que inicialice en aws.js
import { randomUUID } from 'crypto';


const router = Router();
const upload = multer({storage: multer.memoryStorage() }) // guarda el binario de la foto en ram 

// Middleware, express no conoce binarios, el multer guarda el binario en ram mientras seteamos todo para subir a s3
router.post("/", upload.single("image"), async (req,res) => {
    try {
        const {userId} = req.body;
        const file = req.file; // multer empaqueta el file con la info del upload en req.file

        if(!file || !userId){
            return res.status(400).json({message:"Falta de usuario o foto"})
        }

        const imageId = randomUUID();
        const uploadDate = new Date().toISOString();
        const s3Key = `${userId}/${imageId}-${file.originalname}`;

        // 1. Subir a S3
        await s3Client.send(new PutObjectCommand({ // Se construye el obj que nos deja enviar comandos
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer, // binario de la foto guardado por multer 
        ContentType: file.mimetype,
        }));

        // 2. Guardar metadata en DynamoDB
        await ddbDocClient.send(new PutCommand({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Item: {
            userId,
            "uploadDate#imageId": `${uploadDate}#${imageId}`,
            imageId,
            fileName: file.originalname,
            size: file.size,
            uploadDate,
            s3Key,
        },
        }));

        res.status(201).json({ message: "Imagen subida", imageId, s3Key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al subir la imagen" });
    }
    });

router.post("/test-upload", async (req,res) => {
    try{
        const {userId} = req.body;
        const imageId = randomUUID();
        const uploadDate = new Date().toISOString();
    
        await ddbDocClient.send(new PutCommand({
            TableName : process.env.DYNAMO_TABLE_NAME,
            Item: {userId, "uploadDate#imageId":`${uploadDate}#${imageId}`, imageId, uploadDate},
        }));
        res.status(201).json({message: "Guardado en Dynamo"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Error en el server guardando a dynamo"})
    }
})



export default router;
