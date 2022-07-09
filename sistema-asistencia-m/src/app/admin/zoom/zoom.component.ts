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

  searchName:string=''

  @ViewChild('file') file: any;
  fileName:string=''


  datosExcel:Array<zoom>=[]

  fichas:Array<zoom>=[]

 fechaInicio:string=''
 fechaFin:string =''

 confirm:boolean=false
 TituloConfirm:string =''
 DescripcionConfirm:string = ''
 Id:string =''

  constructor(
    private db:AngularFirestore,
    
  ) { }

  ngOnInit(): void {

    this.getFichas()

    this.fechaInicio =moment(new Date()).format('yyyy-MM-DD')
    this.fechaFin =moment(new Date()).format('yyyy-MM-DD')
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

            console.log(list[x]['Hora de finalización'].trim())
            
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

  dateFormat(date:any){

 
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

          var ref = await this.db.firestore.collection('docentes').doc()

          var zoom={
            ...row,
            IdZoom:ref.id
            
          
          }
          
          await this.db.firestore.collection('zoom').doc(ref.id).set(zoom).catch(err=>console.log())
      


            if(count == this.datosExcel.length){
      
              this.datosExcel =[]
      
            }
        }else{

              this.Titulo ='Ups! Ya existe una documento con la misma fecha y hora ingresada!'
           
              this.Descripcion += row.Cedula +" " + row.Nombre + " "+row.HoraInicio + "-" + row.HoraFin + "<br>"
            
        }


   
         
      })

      this.datosExcel = await []

      this.file =null
      this.fileName = ''

    
      await this.getFichas()

      this.show = true


  
    
   
  }


  close(){
      this.show = false
      this.Titulo =''
      this.Descripcion = ''

      this.getFichas()
  }

 async getFichas(){

  this.fichas = []

      await this.db.firestore.collection('zoom').orderBy('HoraInicio','desc').limit(100).get().then(e=>{

        if(e.docs.length>0){
          e.docs.map(doc=>{
              var data = doc.data() as any
            var ficha={
              ...data,
                HoraInicio:data.HoraInicio.toDate(),
                HoraFin:data.HoraFin.toDate()
            }
            this.fichas.push(ficha as zoom)
          })
        }
      })
  }


 async  filterName(e:any){

      var name = e.target.value.toUpperCase()
      await this.getFichas()

      var consulta:Array<zoom> = []

      if(this.fichas.length>0 && name!=''){
          this.fichas.map(a=>{
              var zoom = a as any

            if(zoom.Nombre.toUpperCase().includes(name) ){
                consulta.push(a)
            }
          })

          
        this.fichas = consulta
      }
      
      else{
        this.getFichas()
      }

  }


  
    async  filterCI(e:any){

      this.fichas=[]

      var ci = e.target.value.toUpperCase()
      await this.getFichas()

      var consulta:Array<zoom> = []

      if(this.fichas.length>0){
          this.fichas.map(e=>{

            if(e.Cedula.toUpperCase().includes(ci)){
                consulta.push(e)
            }
          })
      }

      this.fichas = consulta
    }


    async  filterRange(e:any){

      this.fichas=[]

      var ci = e.target.value.toUpperCase()
      await this.getFichas()

      var consulta:Array<zoom> = []

      if(this.fichas.length>0){
          this.fichas.map(e=>{

            var inicio = moment(e.HoraInicio).format('yyyy-MM-DD')
            var fin = moment(e.HoraFin).format('yyyy-MM-DD')

            if(inicio>=this.fechaInicio && inicio <= this.fechaFin){
                consulta.push(e)
            }
          })
      }

      this.fichas = consulta
    }


    
      alertConfirm(id:string,docente:any){
        this.Id = id
        this.TituloConfirm ='¿Está seguro de eliminar la ficha del docente '+docente +"?"
        this.DescripcionConfirm = 'El la ficha del docente será eliminada definitivamente del sistema.'
        this.confirm = true
      }

      confirmDelete(id:string){
      
        this.delete(id)
        this.closeConfirm()
      }

      closeConfirm(){
        this.Id = ''
        this.TituloConfirm =''
        this.DescripcionConfirm = ''
        this.confirm = false
      }

    async delete(IdZoom:string){

      await this.db.firestore.collection('zoom').doc(IdZoom).delete()

      await  this.getFichas()
    }


}
