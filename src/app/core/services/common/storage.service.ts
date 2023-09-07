import { Injectable } from '@angular/core';
export class StorageKey {
   public static currentUser = 'currentUser';
   public static authToken = 'authToken';
   public static dateformat = 'dateformat';
   public static menuData = 'menuData';
   public static defaultscreenvalues = 'defaultscreenvalues';
   public static offervalidfromcreation = 'offervalidfromcreation';
   public static sprFormJsonData = 'sprFormJsonData';
   public static allDefaultScreenValues = 'allDefaultScreenValues';
   public static datetimeformat = 'datetimeformat';
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor() { }

  getValue(key: string): string {
    return localStorage.getItem(key);
  }

  setValue(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeValue(key: string): void {
    localStorage.removeItem(key);
  }
}
