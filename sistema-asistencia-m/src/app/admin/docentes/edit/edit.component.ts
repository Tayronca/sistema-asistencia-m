import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import {Docente} from '../Docente';
import { Observable } from 'rxjs';
import { Facultad } from '../Facultad';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  Facultades:Array<Facultad>=[]
  docente:Docente={
    IdDocente:'',
    Cedula:'',
    Nombres:'',
    Apellidos:'',
    Titulo:'',
    Facultad:'',
    Correo:'',
    Telefono:'',
    Carrera:'',
    Materias:[]
  };
  valid:boolean= false;
  id:string='';

  constructor(
    private route:ActivatedRoute,
    private db:AngularFirestore,
    private router:Router
    
  ) {
   }

  ngOnInit(): void {

    this.loadFacultad()

      this.route.paramMap.forEach(params=>{

          var id  = String(params.get('id'));

          this.id = id;

          this.getUser(id)
        
    })
  }

  async loadFacultad(){

    this.Facultades =[]

      await this.db.firestore.collection('facultad').get().then(async e=>{

        if(e.docs.length>0){
              
          await e.docs.map(doc=>{

              var i = doc.data() as Facultad
                this.Facultades.push(i)
            })

            this.docente.Facultad = this.Facultades[0].Codigo

      
        }
      })
  }

   async getUser(id:string){

  await this.db.firestore.collection('docentes').doc(id).get().then(e=>{

    this.docente = e.data() as Docente


   })

  }

  async update(){

    await this.db.firestore.collection('docentes').doc(this.id).update(this.docente).then(e=>{

          this.router.navigate(['admin/docentes'])
  
     })
  }

}
