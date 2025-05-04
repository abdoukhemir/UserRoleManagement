import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable
import { User } from './user'; // Import the User interface we just created

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Define the base URL for your backend API's User endpoint
  // **IMPORTANT: Replace with your actual backend API URL and port**
  private apiUrl = 'http://localhost:5129/api/Users';

  // Inject HttpClient into the service's constructor
  constructor(private http: HttpClient) { }

  // Method to get all users from the API
  getUsers(): Observable<User[]> { // Specify the return type as an array of User
    // Make the GET request to the API URL
    return this.http.get<User[]>(this.apiUrl);
  }
  getUserById(id: number): Observable<User> {

    const url = `${this.apiUrl}/${id}`;

    return this.http.get<User>(url);
  }
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  updateUser(user: User): Observable<any> { 
    const url = `${this.apiUrl}/${user.id}`;

    return this.http.put<any>(url, user);
  }
  deleteUser(id: number): Observable<any> {
    
    const url = `${this.apiUrl}/${id}`;
   
    return this.http.delete<any>(url); 
  }
  getUserWithRoles(id: number): Observable<User> {
    
    const url = `${this.apiUrl}/${id}/WithRoles`;
    return this.http.get<User>(url);
 }
 assignRoleToUser(userId: number, roleId: number): Observable<any> {
  
  const url = `${this.apiUrl}/${userId}/AssignRole/${roleId}`; 
  return this.http.post<any>(url, null);
}
removeRoleFromUser(userId: number, roleId: number): Observable<any> {
  
  const url = `${this.apiUrl}/${userId}/RemoveRole/${roleId}`; 
  return this.http.delete<any>(url);
}

  // We will add methods for POST, PUT, DELETE here later
}