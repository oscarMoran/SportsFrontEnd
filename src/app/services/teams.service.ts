import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { environment } from 'src/environments/environment.development';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { LoginService } from './login.service';
import { TeamRequest } from '../models/teamRequest.model';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private loginService: LoginService) { }
  baseUrl : string = environment.baseApiUrl;
  responseTeams : Team[] =[];
  async GetTeams(token:string):Promise<Team[]>{
    const response = await fetch(`${this.baseUrl}api/team/get-all`,{
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
   async SaveTeam(teamRequest:TeamRequest):Promise<Boolean>{
    try{
      let token = await this.loginService.GetToken();
      const response = await fetch(`${this.baseUrl}api/team/add`,{
        method: 'Post',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body : JSON.stringify(teamRequest),
      });
      if(response.status == 200){
          return true;
      }
      console.log(response);
      return false;
    }catch(error){
      console.log(error);
      return false;
    }
   }

   async UpadateTeam(team:TeamRequest):Promise<Boolean>{
    try{
      var request :TeamRequest={
        id:team.id,
        nameTeam: team.nameTeam,
        playersNumber:team.playersNumber,
        awardsWon : team.awardsWon,
        foundationDate: team.foundationDate,
        idCategory: team.idCategory,
        idCountry: team.idCategory,
        idSport:team.idSport
      };
      let token = await this.loginService.GetToken();
      const response = await fetch(`${this.baseUrl}api/team/update`,{
        method: 'Put',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body : JSON.stringify(request),
      });
      if(response.status == 200){
          return true;
      }
      console.log(response);
      return false;
    }catch(error){
      console.log(error);
      return false;
    }
   }

   async DeleteTeam(idTeam:number):Promise<Boolean>{
    try{
      
      let token = await this.loginService.GetToken();
      const response = await fetch(`${this.baseUrl}api/team/delete?teamId=${idTeam}`,{
        method: 'Delete',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status == 200){
          return true;
      }
      console.log(response);
      return false;
    }catch(error){
      console.log(error);
      return false;
    }
   }
}


