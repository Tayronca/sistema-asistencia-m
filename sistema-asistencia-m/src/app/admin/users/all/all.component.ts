import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  users:any = []

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

  async delUser(uid:string){

     /* await this.db.doc(uid).delete().then(e=>{

          this.auth.
      })*/

  }

}
