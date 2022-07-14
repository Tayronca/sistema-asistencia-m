import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/user';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  users:any = []

  Id:string =''
  confirm:boolean=false
  Titulo:string=''
  Descripcion:string=''


  constructor(
    private db:AngularFirestore,
    public authService: AuthService,
    private router:Router,
    private auth:AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

 async getUsers(){
    var users:any=[]
    await this.db.collection('users').get().forEach(e=>{
      
      if(e.docs.length>0){
        e.docs.forEach(doc=>{
   
            users.push(doc.data())

          
        })
      }
    });

    this.users =  await users
  }

  editUser(uid:string){
    
    this.router.navigate(['/admin/users/edit/'+uid])
  }

  async delete(user:User){
  

    this.Id = user.uid
    this.confirm = true
    this.Titulo = '¿Está seguro de eliminar al usuario '+ user.nombres + " "+ user.apellidos + "?"
    this.Descripcion = "El usuario será eliminado del sistema"

    

  }

  async deleteUser(Id:any){
    await this.db.firestore.collection('users').doc(Id).delete().then(e=>{

        this.getUsers()
    }).catch(err=>console.log(err))

    await this.close()

  }

  close(){
    this.confirm = false
    this.Titulo =''
    this.Descripcion =""
    this.Id = ""
  }

}
