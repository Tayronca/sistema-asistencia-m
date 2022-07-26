import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/user';
import { Docente } from '../../docentes/Docente';
import { Matriz } from '../../Matriz';
import { Semana } from '../new-matriz/Semana';

@Component({
  selector: 'app-edit-matriz',
  templateUrl: './edit-matriz.component.html',
  styleUrls: ['./edit-matriz.component.css']
})
export class EditMatrizComponent implements OnInit {

  id:string='';
  temaId:string='';
  colorId:string=''

 
  fechaInicio: string = ''
  fechaFin: string = ''
  IdDocente: string = ''
  docentes: Array<Docente> = []
  referencia: Semana = {
    Total: 0
  }

  semanas: Array<any> = []
  totalMes:number=0

  facultad:string=""
  cedula:string=""

  Observaciones:string=''
  valid:boolean=false

  Matriz:Matriz={
    IdMatriz: '',
    Codigo:'',
    FechaInicio: '',
    FechaFin: '',
    FechaEntrega:'',
    UsuarioEntrega: '',
    UsuarioAprobado: '',
    UsuarioRecibido: '',
    Entregado: false,
    Aprobado: false,
    Recibido: false,
    Docentes: []
  }

  IdShow:string=''
  

  constructor(
    private db: AngularFirestore,
    public authService: AuthService,    
    private router:Router,
    private route:ActivatedRoute,
  ) { }

  ngOnInit(): void {

    
    this.route.paramMap.forEach(params=>{

          var id  = String(params.get('id'));

          this.id = id;

          this.getMatriz(id)
        
    })
  }

  async getMatriz(id:string){
     await this.db.firestore.collection('matriz').doc(id).get()
     .then(e=>{
      if(e.exists){

          this.Matriz = e.data() as Matriz
      }
     })
  }


  dateFormat(date: any, format: string) {


    return moment(date).format(format).toUpperCase()
  }

  showDocente(Id:string){

    if(Id ==this.IdShow){
      this.IdShow = ''
    }else{
      this.IdShow = Id
    }
  }

  //ACTUALIZAR MATRIZ

  async save(){

    if(this.Matriz.Docentes.length>0){

        var user = this.authService.userData as User

        this.Matriz.UsuarioEntrega =   user.titulo.split('.')[0] +". "+  user.nombres +" "+user.apellidos
        this.Matriz.Entregado = true
        this.Matriz.FechaEntrega = moment().format('yyyy-MM-DD')

    

        this.db.firestore.collection('matriz').doc(this.id).update(this.Matriz).then(()=>{
            
            this.router.navigate(['admin/asistencia'])
        }).
        catch(err=>{
          console.log(err)
        })
    }
  }

  cancelar(){
    this.router.navigate(['admin/asistencia'])
  }


  number(event:any){

    if(event.charCode >= 48 && event.charCode <= 57){

        return true
    }
    
    return false
  }

  //agregar horas de referencia
  addHourRef(index:number){
    console.log(this.Matriz.Docentes[index].Referencia)

   var lu = this.Matriz.Docentes[index].Referencia['lunes'] ?this.Matriz.Docentes[index].Referencia['lunes']:0
   var ma = this.Matriz.Docentes[index].Referencia['martes'] ? this.Matriz.Docentes[index].Referencia['martes']:0
   var mi = this.Matriz.Docentes[index].Referencia['miércoles'] ? this.Matriz.Docentes[index].Referencia['miércoles']: 0
   var ju = this.Matriz.Docentes[index].Referencia['jueves'] ? this.Matriz.Docentes[index].Referencia['jueves']: 0
   var vi = this.Matriz.Docentes[index].Referencia['viernes'] ? this.Matriz.Docentes[index].Referencia['viernes']:0
   var sa = this.Matriz.Docentes[index].Referencia['sábado'] ? this.Matriz.Docentes[index].Referencia['sábado']: 0

    this.Matriz.Docentes[index].Referencia.Total = lu+ma+mi+ju+vi+sa
    this.Matriz.Docentes[index].TotalHorasSemanal = lu+ma+mi+ju+vi+sa
   
  }

  addHourRefMes(index:number){

    var horasMes = 0
    
    this.Matriz.Docentes[index].Semanas.map(e=>{

        if(e['lunes']){
          horasMes += e['lunes'].Total
        }

        if(e['martes']){
          horasMes += e['martes'].Total
        }

        if(e['miércoles']){
          horasMes += e['miércoles'].Total
        }
        if(e['jueves']){
          horasMes += e['jueves'].Total
        }
        if(e['viernes']){
          horasMes += e['viernes'].Total
        }
        if(e['sábado']){
          horasMes += e['sábado'].Total
        }

        
    })

    this.Matriz.Docentes[index].TotalHorasMes = horasMes

   
  }

  addTema(fecha:string){

  

    this.temaId = fecha
  }

  hideTema(){
    this.temaId =''
  }

  //cambiar color del horario

  color(fecha:string){
    this.colorId = fecha
  }
  //asignar el color a las casilla
  setColor(numDocente:number,numSemana:number,day:string,color:string){

      this.Matriz.Docentes[numDocente].Semanas[numSemana][day].Color = color

      this.colorId = ''
  }
 


}
