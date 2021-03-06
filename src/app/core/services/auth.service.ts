import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Apollo } from 'apollo-angular';
import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION } from './auth.graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apollo: Apollo
  ) { 
    /*this.signinUser({email: 'deadpool@marvel.com', password: '12345'})
      .subscribe( res => console.log(res))
    
    this.signupUser({name: 'Doctor Strange', email: 'strange@marvel.com', password: '12345'})
    .subscribe( res => console.log(res))*/
  }

  signinUser(variables: {email: string, password: string}): Observable<{id:string, token: string}>{

    return this.apollo.mutate({
      mutation: AUTHENTICATE_USER_MUTATION,
      variables
    }).pipe(
      map(res=>res.data.authenticateUser)
    )
  }

  signupUser(variables: {name: string, email: string, password: string}): Observable<{id:string, token: string}>{

    return this.apollo.mutate({
      mutation: SIGNUP_USER_MUTATION,
      variables
    }).pipe(
      map(res=>res.data.signupUser)
    )
  }
}
