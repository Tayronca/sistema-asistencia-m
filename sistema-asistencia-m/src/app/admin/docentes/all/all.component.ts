import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Docente } from '../Docente';
import { Facultad } from '../Facultad';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  Facultades:Array<Facultad>=[]
  docentes:Array<Docente> = []


  constructor(
    private db:AngularFirestore,
    public authService: AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
    
    this.loadFacultad();
    this.getUsers();
  }

 async getUsers(){
    var docentes:any=[]
    await this.db.firestore.collection('docentes').get().then(e=>{
      
      if(e.docs.length>0){
        e.docs.forEach(doc=>{

          var docente = doc.data() as Docente
            docentes.push(docente)

          
        })
      }
    });

    this.docentes =  await docentes
  }

  edit(IdDocente:string){
    
    this.router.navigate(['/admin/docentes/edit/'+IdDocente])
  }

  async delete(IdDocente:string){
      await this.db.firestore.collection('docentes').doc(IdDocente).delete().then(e=>{

          this.getUsers()
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

      
        }
      })
  }

  getFacultad(id:string){
    
      var facultad = this.Facultades.filter(e=>{return e.Codigo == id})

   return facultad[0].Nombre
  }

}
