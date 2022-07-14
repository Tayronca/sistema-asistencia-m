import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Matriz } from '../../Matriz';

import * as moment from 'moment';
moment.locale('es')

import { async } from '@firebase/util';
import { Docente } from '../../docentes/Docente';
import { Facultad } from '../../docentes/Facultad';



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
  listaMatrizSearch:Array<Matriz>=[]

  @ViewChild('file') file: any;
  fileName:string=''


  listaMatriz:Array<Matriz>=[]

 fechaInicio:string=''
 fechaFin:string =''



 mes:number=1
 years:Array<number>=[]
 year:number=0


 showReport=false
 matriz:Matriz={
   IdMatriz: '',
   Codigo: '',
   FechaInicio: '',
   FechaFin: '',
   FechaEntrega: '',
   UsuarioEntrega: '',
   UsuarioAprobado: '',
   UsuarioRecibido: '',
   Entregado: false,
   Aprobado: false,
   Recibido: false,
   Docentes: []
 }

 confirm:boolean=false
 TituloConfirm:string =''
 DescripcionConfirm:string = ''
 Id:string =''

  constructor(
    private db:AngularFirestore,
    
  ) { }

  ngOnInit(): void {
    
    this.getYears()

    this.getMatriz()


    this.mes = new Date().getMonth()+1


  }

 

  

  close(){
      this.show = false
      this.Titulo =''
      this.Descripcion = ''

      this.getMatriz()
  }

 async getMatriz(){

  this.listaMatriz = []

  var lista:Array<Matriz> = []

    await this.db.firestore.collection('matriz').where('Aprobado','==',false).get().then(resp=>{

      if(resp.docs.length>0){
        
        resp.docs.map(m=>{
            var matriz = m.data() as Matriz

            lista.push(matriz)
        })

      }
    })

    this.listaMatriz = await lista.sort((a,b)=>b.Codigo.localeCompare(a.Codigo))
     
  }



    async getYears(){

        this.years = []

        await this.db.firestore.collection('matriz').get().then(e=>{

          if(e.docs.length>0){

              e.docs.map(doc=>{

                var data = doc.data() as any


                var year = parseInt(moment(data.FechaEntrega).format('yyyy'))

          

                  if(!this.years.find(x=>x == year)){
                    this.years.push(year)

                    
                  }
              })
          }
        })  



        this.year = await this.years[0]
    }

    dateFormat(date: any, format: string) {


      return moment(date).format(format).toUpperCase()
    }
  
      getReport(Matriz:Matriz){
          this.matriz = Matriz
          this.showReport= true
      }

      closeReport(){
        this.showReport = false

        this.getMatriz()
      }

      delete(x:Matriz){
        
        this.Id = x.IdMatriz
        this.Titulo="¿Está seguro de eliminar la matriz "+ x.Codigo+" ?"
        this.DescripcionConfirm="La matriz será eliminada del sistema"
        this.confirm = true
        
      }

     async confirmDelete(Id:any){
          if(Id){

           await this.db.firestore.collection('matriz').doc(Id).delete()
            .then(()=>{
                this.getMatriz()
            }).catch(err=>{console.log(err)})

            this.closeConfirm()
          }
      }

      closeConfirm(){
        this.Id=''
        this.confirm = false
        this.Titulo=""
        this.DescripcionConfirm=""
      }


      
}
