import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/user';
import { DocenteFicha } from '../../DocenteFicha';
import { Docente } from '../../docentes/Docente';
import { Facultad } from '../../docentes/Facultad';
import { Matriz } from '../../Matriz';
import { Semana } from './Semana';

moment.locale('es')

@Component({
  selector: 'app-new-matriz',
  templateUrl: './new-matriz.component.html',
  styleUrls: ['./new-matriz.component.css']
})
export class NewMatrizComponent implements OnInit {

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



  constructor(
    private db: AngularFirestore,
    public authService: AuthService,    
    private router:Router,
  ) { }

  ngOnInit(): void {

    this.fechaInicio = moment(new Date()).format('yyyy-MM-DD')
    this.fechaFin = moment(new Date()).format('yyyy-MM-DD')

   this.getDocentes()

  }

  async getDocentes() {

    this.docentes = []

    await this.db.firestore.collection('docentes').orderBy('Apellidos', 'asc').get().then(e => {

      if (e.docs.length > 0) {

        e.docs.map(doc => {
          var docente = doc.data() as Docente

          this.docentes.push(docente)


        })
      }
    })



  }

  async getDocente() {

    var matriz: Matriz = {
      IdMatriz: "",
      Codigo:'',
      FechaInicio: this.fechaInicio,
      FechaFin: this.fechaFin,
      FechaEntrega:'',
      UsuarioEntrega: "",
      UsuarioAprobado: "",
      UsuarioRecibido: "",
      Entregado: false,
      Aprobado: false,
      Recibido: false,
      Docentes:[]
    }


      await this.db.firestore.collection('docentes')
        .get().then( e => {


          if (e.docs.length>0) {
            
              e.docs.map(async docente=>{

                

               await  this.getFichas(docente.data() as Docente,matriz)
              })

          
          }

        })

          
      this.Matriz =await matriz

      await  console.log(this.Matriz)
    
  }


  async getFichas(d: Docente,Matriz:Matriz) {
    
    
    var Docente:DocenteFicha ={
      IdDocente: d.IdDocente,
      Nombre:  d.Apellidos+" "+d.Nombres,
      Cedula: d.Cedula,
      Facultad: '',
      TotalHorasMes: 0,
      TotalHorasSemanal: 0,
      Fichas: [],
      Referencia:{Total:0},
      Semanas:[],
      Observaciones: ''
    }

    var facultad = await this.getFacultad(d.Facultad)

    Docente.Facultad = facultad,

    this.facultad = facultad
    this.cedula = d.Cedula

    this.referencia ={Total:0}

    await this.db.firestore.collection('zoom').where("IdDocente", '==', Docente.IdDocente)
      .get().then(async e => {

        if (e.docs.length > 0) {

          var TotalHorasMes = 0
    
         await e.docs.map(f => {
            var ficha = f.data() as any

            var fechaFicha = new Date(ficha.HoraInicio.toDate())

            var fechaInicio = new Date(this.fechaInicio)
            var fechaFin = new Date(this.fechaFin)

            if (fechaFicha >= fechaInicio && fechaFicha <= fechaFin) {

              Docente.Fichas.push(ficha)

              TotalHorasMes += Math.round(parseFloat(ficha.Duracion.toString()) / 60)
            }

          })

          Docente.TotalHorasMes = TotalHorasMes

        }

        if (Docente.Fichas.length > 0) {

          this.referencia = {
            Total: 0
          }

          await Docente.Fichas.map(ficha => {

            var date = ficha.HoraInicio as any

            var day = moment(date.toDate()).format('dddd') as string


            if (!this.referencia[day]) {

       
              Docente.TotalHorasSemanal = Math.round(parseFloat(ficha.Duracion.toString()) / 60)
              this.referencia[day] = Math.round(parseFloat(ficha.Duracion.toString()) / 60)
              this.referencia.Total += Math.round(parseFloat(ficha.Duracion.toString()) / 60)

              Docente.Referencia[day] = Math.round(parseFloat(ficha.Duracion.toString()) / 60)
              Docente.Referencia.Total += Math.round(parseFloat(ficha.Duracion.toString()) / 60)
            }

          })

     
             await this.getSemanasFecha(Docente)
       
         

        }

      })

      if(Docente.Fichas.length>0){
        await Matriz.Docentes.push(Docente)
      }   

    

    
   
      
  
     
  }

  async getFacultad(IdFacultad: string) {

    var nombre: string = ''

    nombre = await this.db.firestore.collection('facultad').doc(IdFacultad).get().then(e => {

      if (e.exists) {
        var facultad = e.data() as Facultad
        return facultad.Nombre.toString()
      }

      return ""
    })


    return nombre
  }


  dateFormat(date: any, format: string) {


    return moment(date).format(format).toUpperCase()
  }

  getNameDocente() {
    var docente = this.docentes.find(e => e.IdDocente == this.IdDocente)


    return docente?.Apellidos + " " + docente?.Nombres
  }

 async getSemanasFecha(Docente:DocenteFicha) {

    var currentDate = new Date(this.fechaInicio)
    var fechaFin = new Date(this.fechaFin)

    currentDate.setDate(currentDate.getDate() + 1)
    fechaFin.setDate(fechaFin.getDate() + 1)


    var dates = [];

    while (currentDate <= fechaFin) {


      dates.push(currentDate);


      var d = new Date(currentDate.valueOf());
      d.setDate(d.getDate() + 1);
      currentDate = d;

    }


   await this.getWeekends(dates,Docente)
  }


  async getWeekends(dates: any,Docente:DocenteFicha) {

    this.totalMes =0

    this.semanas = []


    var count = 0

    var semana: any = {}


    await dates.forEach(async (day: any) => {



            var d = moment(day).format('dddd')
            var fecha = moment(day).format('DD')
            var month = moment(day).format('MM')

      
            semana[d] = {
              Fecha: fecha
            }

 

          if (d != 'domingo') {


           Docente.Fichas.map(zoom=>{

                var data = zoom as any
  
                var fechaZoom = moment(data.HoraInicio.toDate()).format('DD-MM-YYYY')
  
                var fechaDay = moment(day).format('DD-MM-YYYY')
  
  
                if (fechaZoom == fechaDay) {

                  semana[d].Total = Math.round(parseFloat(data.Duracion.toString()) / 60)
                  semana[d].Tema = zoom.Tema

                  this.totalMes += Math.round(parseFloat(data.Duracion.toString()) / 60)
  
                }
  
              })

          } else if (d == 'domingo') {

            Docente.Semanas.push(semana)
            this.semanas.push(semana)
            semana = {}

          }
          count++



          if (dates.length == count && d != 'domingo') {
            Docente.Semanas.push(semana)
            this.semanas.push(semana)
            semana = {}
          }


  
        })



  }

  //GUARDAR LA MATRIZ

  async save(){

    if(this.Matriz.Docentes.length>0){

        var ref = await this.db.firestore.collection('matriz').doc()
        var num =0
        num = await this.db.firestore.collection('matriz').get().then(e=>{
          if(e.docs.length>0){
              return e.docs.length + 1
          }

          return 0+1
        })

        var user = this.authService.userData as User

        this.Matriz.UsuarioEntrega = user.nombres +" "+user.apellidos
        this.Matriz.Entregado = true
        this.Matriz.FechaEntrega = moment().format('DD-MM-yyyy')
        this.Matriz.IdMatriz = ref.id

        this.Matriz.Codigo = 'MT-'+("00000" + num).slice(-5)

    

        this.db.firestore.collection('matriz').doc(ref.id).set(this.Matriz).then(()=>{
            
            this.router.navigate(['admin/asistencia'])
        }).
        catch(err=>{
          console.log(err)
        })
    }
  }


}
