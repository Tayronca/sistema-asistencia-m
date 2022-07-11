import { Semana } from "./matriz/new-matriz/Semana";
import { zoom } from "./zoom";

export interface DocenteFicha{
    IdDocente: string,
    Nombre: string,
    Cedula:string,
    Facultad: string,
    TotalHorasMes: number,
    TotalHorasSemanal: number,
    Fichas:Array<zoom>,
    Semanas:Array<any>,
    Referencia:Semana,
    Observaciones: "", 
}