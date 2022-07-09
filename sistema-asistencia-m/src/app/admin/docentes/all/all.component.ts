
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

  confirm:boolean=false
  Titulo:string =''
  Descripcion:string = ''
  Id:string =''

  alert:boolean = false
  TituloAlert:string =''
  DescripcionAlert:string=''


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

     var exist = await this.db.firestore.collection('zoom').where('IdDocente','==',IdDocente).get().then(docs=>{
        
        if(docs.docs.length>0){

          return true
        }

        return false
      })

      if(exist){
         
          this.TituloAlert ='No se pudo eliminar'
          this.DescripcionAlert='El Docente tiene información ingresada.'
          this.alert=true
      }
      else{
          await this.db.firestore.collection('docentes').doc(IdDocente).delete().then(e=>{

            this.getUsers()

            this.TituloAlert ='Docente eliminado!'
            this.DescripcionAlert='El docente fue eliminado del sistema'
            this.alert=true
        })
      }



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

  close(){
    this.confirm = false
    this.Titulo =''
    this.Descripcion = ''
    this.Id =''
  }

  alertConfirm(id:string,docente:string){
    this.Id = id
    this.Titulo ='¿Está seguro de eliminar el docente '+docente +"?"
    this.Descripcion = 'El docente será eliminado definitivamente del sistema.'
    this.confirm = true
  }

  confirmDelete(id:string){
    
    this.delete(id)
    this.close()
  }


  closeAlert(){
    this.alert = false
    this.TituloAlert =''
    this.DescripcionAlert = ''
    
  }


}
