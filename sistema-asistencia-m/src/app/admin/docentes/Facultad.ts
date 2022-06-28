import { Carrera } from "./Carrera";

export interface Facultad{
    Codigo:string,
    Nombre:String,
    Carreras:Array<Carrera>
}