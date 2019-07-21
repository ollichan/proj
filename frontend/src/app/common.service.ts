import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { getComponentViewDefinitionFactory } from '@angular/core/src/view';



@Injectable({
  providedIn: 'root'
})

export class CommonService {

  static starter :number;
  static ender:number;

  constructor(private http:HttpClient) {}

    getGOMO(){
      this.http.get('http://localhost:8080/api/getGOMO').pipe(map(data => {})).subscribe(result => {
        console.log(result);
      });
    }    
   

}
