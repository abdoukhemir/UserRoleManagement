import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component'; 
import { UserDetailComponent } from './user-detail/user-detail.component'; // <--- Import UserDetailComponent
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component'; 
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostEditComponent } from './post-edit/post-edit.component';


export const routes: Routes = [{
    path: 'users', 
    component: UserListComponent 
  },
  {
    path: 'users/create', 
    component: UserCreateComponent
  },
  {
    
    
    path: 'users/edit/:id',
    component: UserEditComponent 
  },
  {
    
    path: 'users/:id',
    component: UserDetailComponent 
  },
  {
    path: 'roles', // Route for the role list
    component: RoleListComponent
  },
  {
    path: 'roles/create', // Route for the create role form
    component: RoleCreateComponent
  },
  {
    path: 'roles/edit/:id',
    component: RoleEditComponent // Load RoleEditComponent for this path
  },

  {
    path: 'posts', // Route for the post list
    component: PostListComponent
  },
   {
     path: 'posts/create', // Route for creating a post (place before dynamic ID route)
     component: PostCreateComponent
   },
   {
     path: 'posts/edit/:id', // Route for editing a post (place before dynamic ID route)
     component: PostEditComponent
   },
   {
     path: 'posts/:id', // Route for post details (dynamic ID)
     component: PostDetailComponent
   },
  {
    path: '', // The root path
    redirectTo: '/users', // Redirect to the '/users' path
    pathMatch: 'full' // Ensure the entire path matches exactly '' before redirecting
  }];

