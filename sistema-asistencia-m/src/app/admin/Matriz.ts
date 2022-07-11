import { DocenteFicha } from "./DocenteFicha";
import { zoom } from "./zoom";

export interface Matriz{
    IdMatriz:string,
    FechaInicio:string,
    FechaFin:string,
    UsuarioEntrega:string,
    UsuarioAprobado:string,
    UsuarioRecibido:string,
    Entregado:boolean,
    Aprobado:boolean,
    Recibido:boolean,
    Docentes:Array<DocenteFicha>

}