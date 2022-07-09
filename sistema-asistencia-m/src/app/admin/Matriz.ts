import { zoom } from "./zoom";

export interface Matriz{
    IdMatriz:string,
    IdDocente:string,
    Nombre:string,
    Cedula:string,
    Facultad:string,
    FechaInicio:string,
    FechaFin:string,
    FechaEntrega:string,
    TotalHorasMes:string,
    TotalHorasreferencia:string,
    Observaciones:string,
    UsuarioEntrega:string,
    UsuarioAprobado:string,
    UsuarioRecibido:string,
    Entregado:boolean,
    Aprobado:boolean,
    Recibido:boolean,
    Fichas:Array<zoom>

}