import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import {Chart, registerables} from 'chart.js'
import { LoginService } from 'src/app/services/login.service';
import { TokenResponse } from 'src/app/models/tokenResponse.model';
import { TeamsService } from 'src/app/services/teams.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  constructor(private loginService: LoginService, private teamService : TeamsService){

  }
  teams : Team[] =[];
  xLabels :string [] =[];
  xData : number[] =[];
  bgColors : string[] =[];
  borderColors : string[] =[];

  ngOnInit(): void {
    Chart.register(...registerables);
    
    this.GetTeamsInformation();
  }
  async GetTeamsInformation(){
    var getSession = sessionStorage.getItem("token");
    if(getSession == null){
      var newToken = await this.loginService.GetToken();
      await this.FillTable(newToken);
    }else{
      await this.FillTable(getSession.toString());
    }
    this.BuildGraphContainer();
  }

  async FillTable(token:string){
    var response = await this.teamService.GetTeams(token);
    if(response !== undefined)
      response.forEach(el => {
          this.teams.push(el);
      });
  }
  
  BuildGraphContainer(){
    this.teams.forEach(el=>{
      this.xLabels.push(el.nameTeam);
      this.xData.push(el.awardsWon);
      this.bgColors.push(`rgba(${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 3) + 1)})`);
      this.borderColors.push(`rgba(${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 255) + 1)},${Math.floor((Math.random() * 3) + 1)})`);
    });
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: this.xLabels,
          datasets: [{
              label: 'Team awards total',
              data : this.xData,
              backgroundColor : this.bgColors,
              borderColor : this.borderColors
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
}
