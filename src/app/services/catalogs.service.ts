import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ICatalog } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {
  baseUrl : string = environment.baseApiUrl;
  constructor() { }
  responseCatalog :ICatalog[]=[];

  async GetCountryCatalog():Promise<ICatalog[]>{
    this.responseCatalog=[];
    const response = await fetch(`${this.baseUrl}api/catalog/get-countries`,{
        method: 'Get'
      });
      if(response.status == 200){
        this.responseCatalog = await response.json()
          .catch(error =>{
            console.log(error);
          });
      }
      return this.responseCatalog;
  }
  async GetCategoryCatalog():Promise<ICatalog[]>{
    this.responseCatalog=[];
    const response = await fetch(`${this.baseUrl}api/catalog/get-categories`,{
        method: 'Get'
      });
      if(response.status == 200){
        this.responseCatalog = await response.json()
          .catch(error =>{
            console.log(error);
          });
      }
      return this.responseCatalog;
  }
  async GetSportCatalog():Promise<ICatalog[]>{
    this.responseCatalog=[];
    const response = await fetch(`${this.baseUrl}api/catalog/get-sports`,{
        method: 'Get'
      });
      if(response.status == 200){
        this.responseCatalog = await response.json()
          .catch(error =>{
            console.log(error);
          });
      }
      return this.responseCatalog;
  }
}
