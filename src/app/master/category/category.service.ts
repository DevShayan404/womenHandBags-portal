import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  headers = { 'content-type': 'application/json' };

  constructor(private http: HttpClient) {}

  uploadImage(file: any): Observable<any> {
    debugger
    const formData = new FormData();
    formData.append('avatar', file);
    console.log(formData);

    return this.http.post<any>('your_api_url_here', formData);
  }
  uploadFile(formData: FormData) {
    return this.http.post(environment.HOST + '/upload', formData);
  }

  getCategoryList(): Observable<any> {
    return this.http.get<any>(environment.HOST + `/api/getAllCategory`);
  }

  postCategory(data: any[]): Observable<any> {
    return this.http.post<any>(environment.HOST + `/api/createCategory`, data, {
      headers: this.headers,
      responseType: 'json',
    });
  }
}
