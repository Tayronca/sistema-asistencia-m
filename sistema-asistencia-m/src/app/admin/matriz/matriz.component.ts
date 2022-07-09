import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Matriz } from '../Matriz';

import * as moment from 'moment';
import { async } from '@firebase/util';
import { Docente } from '../docentes/Docente';
import { zoom } from '../zoom';
import { Facultad } from '../docentes/Facultad';

moment.locale('es')

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css']
})
export class MatrizComponent implements OnInit {

  show:boolean =false
  Titulo:string = ''
  Descripcion:string = ''

  searchName:string=''

  @ViewChild('file') file: any;
  fileName:string=''


  matriz:Array<Matriz>=[]

 fechaInicio:string=''
 fechaFin:string =''

 confirm:boolean=false
 TituloConfirm:string =''
 DescripcionConfirm:string = ''
 Id:string =''
 mes:number=1
 years:Array<number>=[]
 year:number=0

  constructor(
    private db:AngularFirestore,
    
  ) { }

  ngOnInit(): void {
    
    this.getYears()

    this.getMatriz()


    this.mes = new Date().getMonth()+1


  }

 


  dateFormat(date:any){

 
    return moment(date.toDate()).format('MMMM').toUpperCase()
  }

   

  close(){
      this.show = false
      this.Titulo =''
      this.Descripcion = ''

      this.getMatriz()
  }

 async getMatriz(){

  this.matriz = []

    await this.db.firestore.collection('docentes').get().then(resp=>{

      if(resp.docs.length>0){
        
          resp.docs.map(async docente=>{

              var d = docente.data() as Docente
            var matriz:Matriz ={
              IdMatriz:"",
              IdDocente:d.IdDocente,
              Nombre:d.Nombres+" "+ d.Apellidos,
              Cedula:d.Cedula,
              Facultad:"",
              FechaInicio:"",
              FechaFin:"",
              FechaEntrega:"",
              TotalHorasMes:"",
              TotalHorasreferencia:"",
              Observaciones:"",
              UsuarioEntrega:"",
              UsuarioAprobado:"",
              UsuarioRecibido:"",
              Entregado:false,
              Aprobado:false,
              Recibido:false,
              Fichas:[]
              
            }

            var facultad = await this.getFacultad(d.Facultad)

            matriz.Facultad = facultad

             
            await this.db.firestore.collection('zoom').where("IdDocente",'==',matriz.IdDocente)
            .get().then( e=>{

              if(e.docs.length>0){

                var TotalHorasMes =0
                var exist = false

               e.docs.map(f=>{
                  var ficha = f.data() as any

                 

                  if(parseInt(moment(ficha.HoraInicio.toDate()).format('MM')) == this.mes && parseInt(moment(ficha.HoraInicio.toDate()).format('yyyy')) == this.year ){
                   
                    matriz.Fichas.push(ficha)

                    TotalHorasMes += Math.round(parseFloat(ficha.Duracion.toString())/60)
                  }

                })


                matriz.TotalHorasMes = TotalHorasMes.toString()
                if(matriz.Fichas.length>0){
               

                  this.matriz.push(matriz)
                }

              
              }

                console.log(this.matriz)
            })
          })

      
      }
    })

     
  }


 async  filterName(e:any){

      var name = e.target.value.toUpperCase()
      await this.getMatriz()

      var consulta:Array<Matriz> = []

      if(this.matriz.length>0 && name!=''){
          this.matriz.map(a=>{
              var matriz = a as any

            if(matriz.Nombre.toUpperCase().includes(name) ){
                consulta.push(a)
            }
          })

          
        this.matriz = consulta
      }
      
      else{
        this.getMatriz()
      }

  }


 


    
  
 


    async getFacultad(IdFacultad:string){

      var nombre:string=''

      nombre = await this.db.firestore.collection('facultad').doc(IdFacultad).get().then(e=>{

        if(e.exists){
            var facultad = e.data() as Facultad
            return facultad.Nombre.toString()
        }

        return ""
      })
     
  
      return nombre
    }

    async getYears(){

        this.years = []

        await this.db.firestore.collection('zoom').get().then(e=>{

          if(e.docs.length>0){

              e.docs.map(doc=>{

                var data = doc.data() as any


                var year = parseInt(moment(data.HoraInicio.toDate()).format('yyyy'))

          

                  if(!this.years.find(x=>x == year)){
                    this.years.push(year)

                    
                  }
              })
          }
        })  



        this.year = await this.years[0]
    }

}
