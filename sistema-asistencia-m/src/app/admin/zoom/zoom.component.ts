import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as XLSX from "xlsx";
import { Docente } from '../docentes/Docente';
import { zoom } from '../zoom';

import * as moment from 'moment';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.css']
})
export class ZoomComponent implements OnInit {
  show:boolean =false
  Titulo:string = ''
  Descripcion:string = ''

  @ViewChild('file') file: any;
  fileName:string=''


  datosExcel:Array<zoom>=[]

  fichas:Array<zoom>=[]

 

  constructor(
    private db:AngularFirestore,
    
  ) { }

  ngOnInit(): void {

    this.getFichas()
  }

 

  fileInput(ev:any):void {

    this.datosExcel =[]
    if(ev){
      

      this.file =null

      let workBook:any = null;
      let jsonData = null;
      const reader = new FileReader();
      this.file = ev.target.files[0];
      this.fileName = ev.target.files[0].name

      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial:any, name:any) => {
          
          const sheet = workBook.Sheets[name];

    
          initial[name] = XLSX.utils.sheet_to_json(sheet);

          var list = initial[name]
          
          
          for(var x =0;x<list.length;x++){
            
            var clase ={
              IdDocente:'',
              Cedula:'',
              Tema:list[x]['Tema'],
              Nombre:list[x]['Nombre de usuario'],
              Correo:list[x]['E-mail del usuario'],
              HoraInicio:new Date(list[x]['Hora de inicio']),
              HoraFin:new Date(list[x]['Hora de finalización']),
              Duracion:list[x]['Duración (minutos)']
            }

     
            this.setData(clase)
           
              ev.target.value =null
              
          }
     
          return initial;
        }, {});

      }
      reader.readAsBinaryString(this.file);

      
    }


  }

  async setData(clase:any){
    
    var docente:any =null 

    docente=  await this.db.firestore.collection('docentes').where('Correo','==',clase.Correo).get()
     .then(e=>{
       if(e.docs.length>0){
          var d = e.docs[0].data() as Docente

           return d

       }

     return null

     }).catch(err=>{
       console.log(err)
     })

     if(docente){

        if(clase.Correo == docente.Correo)
        {
           var Docente = docente as Docente

           clase.Nombre = Docente.Nombres +" "+Docente.Apellidos
           clase.IdDocente = Docente.IdDocente
           clase.Cedula = Docente.Cedula

        }
     
     }

  

     await this.datosExcel.push(clase)

    
  }

  dateFormat(date:Date){

    return moment(date).format('DD/MM/yyyy HH:mm:ss')
  }

   async save(){

      var count = 0;

      await this.datosExcel.map(async row=>{

        var exist =await  this.db.firestore.collection('zoom').where('IdDocente','==',row.IdDocente).where('HoraInicio','==',row.HoraInicio).get().then(doc=>{

          if(doc.docs.length>0){

            return true
          }

          return false
        })

   
        count ++;
        if(!exist){
          
          await this.db.firestore.collection('zoom').doc().set(row).catch(err=>console.log())
      


            if(count == this.datosExcel.length){
      
              this.datosExcel =[]
      
                  console.log('Ingresado')
            }
        }else{

              this.Titulo ='Ups! Ya existe una documento con la misma fecha y hora ingresada!'
           
              this.Descripcion += row.Cedula +" " + row.Nombre + " "+row.HoraInicio + "-" + row.HoraFin + "<br>"
            
        }



         
      })

      this.datosExcel = await []

      this.file =null
      this.fileName = ''

    
  
      this.show = true


      await this.getFichas()
    
   
  }


  close(){
      this.show = false
      this.Titulo =''
      this.Descripcion = ''
  }

 async getFichas(){

  this.fichas = []

      await this.db.firestore.collection('zoom').get().then(e=>{

        if(e.docs.length>0){
          e.docs.map(doc=>{
            this.fichas.push(doc.data() as zoom)
          })
        }
      })
  }

}
