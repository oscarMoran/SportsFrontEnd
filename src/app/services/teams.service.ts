import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { environment } from 'src/environments/environment.development';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private loginService: LoginService) { }
  baseUrl : string = environment.baseApiUrl;
  responseTeams : Team[] =[];
  async GetTeams(token:string):Promise<Team[]>{
    const response = await fetch(`${this.baseUrl}api/team/getteams`,{
        method: 'Get',
        headers : new Headers({
          Authorization: `Bearer ${token}`
        })
      });
      if(response.status == 200){
        this.responseTeams = await response.json()
          .catch(error =>{
            console.log(error);
          });
      }else if(this.responseTeams.length == 0 && response.status == 401){
        var refreshToken = await this.loginService.GetToken();
        this.responseTeams = await this.GetTeams(refreshToken);
      }
      return this.responseTeams;
  }
}


