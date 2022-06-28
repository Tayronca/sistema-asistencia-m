import { Materia } from "./Materia";

export interface Docente{
    IdDocente:string,
    Facultad:string;
    Carrera:string;
    Nombres:string;
    Apellidos:string;
    Cedula:string;
    Correo:string;
    Telefono:string;
    Titulo:string;
    Materias:Array<Materia>;
  
}