import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment';
import { StorageKey, StorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  constructor(private httpClient: HttpClient,
    private storageService: StorageService) { }

  getScreenDetails(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}screenDetails/list`);
  }

  CheckUserCreditial(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/login`, data);
  }

  ConfigurationbyCode(code: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/getconfigurationbycode?code=${code}`);
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    var token = this.storageService.getValue(StorageKey.authToken);
    var currentUser = this.storageService.getValue(StorageKey.currentUser);

    if (token && currentUser)
      return true;
    else
      return false;
  }

}
