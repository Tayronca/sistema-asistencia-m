import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';


import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {


    this.afAuth.authState.subscribe(async user=>{
    

      if(user){
        this.userData = await JSON.parse(localStorage.getItem('user')!);

          if(!this.router.url.includes('admin')){
            await this.router.navigate(['admin']);
          }
             
      }
    })

  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then( async (result) => {
        var user = result.user

        if(user){

          this.userData = await this.getDataUser(user);
          await localStorage.setItem('user', JSON.stringify(this.userData));
          await JSON.parse(localStorage.getItem('user')!);
          await this.router.navigate(['admin']);
        }

       

       
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }


  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);

     return user !== null && user.emailVerified !== false ? true : false;
  }

  SetUserData(user: any,singUser:any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );


    const userData: User = {
      uid: user.uid,
      correo: user.correo,
      nombres: user.nombres,
      apellidos: user.apellidos,
      cedula: user.cedula,
      rol: user.rol,
      photoURL: user.photoURL,
      emailVerified: singUser.emailVerified,
      titulo:user.titulo
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }


  async getDataUser(u:any){

   
    var data = this.afs.firestore.collection('users').doc(u.uid).get()



   const user= await data.then(e=>{
              if(e.exists){

              

                return e.data()
              }
              return null
          })

    await this.SetUserData(user,u);

    return user

  }

  
}