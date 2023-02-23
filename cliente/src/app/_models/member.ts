//Bueno esto se obtuvo con json to typescrip
//pero se uso el del profe asi que si quisieramos usar el nuestro 
//tendriamos que cambiarlo y tambien Photo de la misma carpeta, se uso postman para obtener el json
import { Photo } from "./photo";

export interface Member {
    id: number;
    username: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
}