// src/app/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable
import { Post } from './post'; // Import the Post interface (make sure src/app/post.ts exists)

@Injectable({
  providedIn: 'root'
})
export class PostService {

  // === Define the base URL for the Backend Post API ===
  // IMPORTANT: Ensure the port matches your backend's port
  private apiUrl = 'http://localhost:5129/api/Posts'; // Adjust port if needed
  // ====================================================

  // Inject the HttpClient
  constructor(private http: HttpClient) { }

  // === CRUD Methods for Posts ===

  // GET: /api/Posts - Get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // GET: /api/Posts/5 - Get a specific post by ID
  getPostById(id: number): Observable<Post> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Post>(url);
  }
  
  // POST: /api/Posts - Create a new post
  // (This method's URL call appears correct already)
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post); 
  }
  
  // PUT: /api/Posts/5 - Update an existing post
  updatePost(post: Post): Observable<any> {
    const url = `${this.apiUrl}/${post.id}`;
    return this.http.put<any>(url, post);
  }
  
  // DELETE: /api/Posts/5 - Delete a specific post by ID
  deletePost(id: number): Observable<any> { 
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
  getPostsByUserId(userId: number): Observable<Post[]> {
    
    const url = `${this.apiUrl}/byuser/${userId}`; 
    return this.http.get<Post[]>(url);
 }
}