import { DocenteFicha } from "./DocenteFicha";
import { zoom } from "./zoom";

export interface Matriz{
    IdMatriz:string,
    Codigo:string,
    FechaInicio:string,
    FechaFin:string,
    FechaEntrega:string,
    UsuarioEntrega:string,
    UsuarioAprobado:string,
    UsuarioRecibido:string,
    Entregado:boolean,
    Aprobado:boolean,
    Recibido:boolean,
    Docentes:Array<DocenteFicha>

}