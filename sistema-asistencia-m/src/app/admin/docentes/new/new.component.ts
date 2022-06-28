import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';
import { Carrera } from '../Carrera';
import { Docente } from '../Docente';
import { Facultad } from '../Facultad';
import { Materia } from '../Materia';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  Facultades:Array<Facultad>=[]
  Carreras:Array<Carrera>=[]
  Docente:Docente={
    IdDocente:'',
    Facultad:'',
    Carrera:'',
    Cedula:'',
    Nombres:'',
    Apellidos:'',
    Correo:'',
    Telefono:'',
    Titulo:'',
    Materias:[]
  }

  valid:boolean = true;

  constructor(
    private db:AngularFirestore,
    private auth:AngularFireAuth,
    private router:Router,
  ) { 

   
  }

  ngOnInit(): void {

      this.loadFacultad()
  }

  async loadFacultad(){

    this.Facultades =[]

      await this.db.firestore.collection('facultad').get().then(async e=>{

        if(e.docs.length>0){
              
          await e.docs.map(doc=>{

              var i = doc.data() as Facultad
                this.Facultades.push(i)
            })

            this.Docente.Facultad = this.Facultades[0].Codigo

         //   await this.selectCarrera( this.Facultades[0].Codigo)
        }
      })
  }


  async selectCarrera(Codigo:string){

    this.Carreras = []

    await this.db.firestore.collection('facultad').doc(Codigo).collection('CARRERA').get().then(async e=>{


      if(e.docs.length>0){
          await e.docs.map(doc=>{
    

            var i = doc.data() as Carrera
              this.Carreras.push(i)
          })

          this.Docente.Carrera = this.Carreras[0].Codigo


        
      }
    })

  }

  onChange(e:Event){
    this.selectCarrera(e.toString())
  }

  save(){

    const{Docente} = this
    if(Docente.Nombres && Docente.Apellidos && Docente.Correo  && Docente.Cedula && Docente.Facultad && Docente.Telefono
      && Docente.Titulo){


            this.valid = true

            var ref = this.db.firestore.collection('docentes').doc();

            Docente.IdDocente= ref.id
          
              this.db.firestore.collection('docentes').doc(ref.id).set(Docente).then(e=>{

                this.clearInput()

                this.router.navigate(['admin/docentes'])
              })


        
     
    }else{
      this.valid = false
    }
  }

  clearInput(){
    
    this.Docente={
      IdDocente:'',
      Facultad:'',
      Carrera:'',
      Cedula:'',
      Nombres:'',
      Apellidos:'',
      Correo:'',
      Telefono:'',
      Titulo:'',
      Materias:[]
    }
  }
 

}
