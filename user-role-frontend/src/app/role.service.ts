// src/app/role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable
import { Role } from './role'; // Import the Role interface

@Injectable({
  providedIn: 'root'
})
export class RoleService {


  private apiUrl = 'http://localhost:5129/api/Roles';

  constructor(private http: HttpClient) { }


  getRoles(): Observable<Role[]> {
   
    return this.http.get<Role[]>(this.apiUrl);
  }
  createRole(role: Omit<Role, 'id'>): Observable<Role> {
    
    return this.http.post<Role>(this.apiUrl, role);
  }
  deleteRole(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
  getRoleById(id: number): Observable<Role> {
   
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<Role>(url);
  }
  updateRole(role: Role): Observable<any> {

    const url = `${this.apiUrl}/${role.id}`; 
    return this.http.put<any>(url, role);
  }
  // We will add methods for create, update, delete roles later
}