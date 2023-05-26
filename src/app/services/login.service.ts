import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginRequest : Login = {
    password : environment.password,
    userName : environment.userName
  }
  baseUrl : string = environment.baseApiUrl;

  constructor() {  }

  async GetToken():Promise<string>{
    const response = await fetch(`${this.baseUrl}api/login/token`,{
        method: 'Post',
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify(this.loginRequest),
      });
      var serviceResponse = await response.json()
      .catch(error =>{
        console.log(error);
        return "";
      });
      sessionStorage.setItem("token",serviceResponse.token);
      return serviceResponse.token;
  }
}
