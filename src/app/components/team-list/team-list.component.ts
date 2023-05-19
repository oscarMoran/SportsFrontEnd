import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import {Chart, registerables} from 'chart.js'

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  
  teams : Team[] =[
    {
      id: 1,
      name : 'Zorros',
      adwardsWon : 20,
      playersNumber : 35,
      sport : 'Soccer',
      category : 'Male',
      country : 'Mex',
      foundationDate : '25-02-2023'
    },
    {
      id: 2,
      name : 'Tigres',
      adwardsWon : 30,
      playersNumber : 15,
      sport : 'Soccer',
      category : 'Male',
      country : 'USA',
      foundationDate : '25-04-2023'
    },
    {
      id: 3,
      name : 'Culones',
      adwardsWon : 10,
      playersNumber : 20,
      sport : 'Soccer',
      category : 'Male',
      country : 'CAN',
      foundationDate : '15-07-2023'
    },
    {
      id: 4,
      name : 'Pozoleros',
      adwardsWon : 30,
      playersNumber : 21,
      sport : 'Soccer',
      category : 'Male',
      country : 'Mex',
      foundationDate : '14-08-2023'
    }
  ];
  ngOnInit(): void {
    Chart.register(...registerables);
    this.BuildGraphContainer();
  }

  BuildGraphContainer(){
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 30],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
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
