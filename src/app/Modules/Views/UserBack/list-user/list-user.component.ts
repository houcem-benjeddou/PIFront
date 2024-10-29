import { Component, OnInit } from '@angular/core';
import { User } from '../../../Classes/user';
import { UserService } from '../../../Services/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  selectedUserId?: number;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.totalItems = users.length;
        this.users = this.paginate(users, this.currentPage, this.itemsPerPage);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  paginate(array: User[], currentPage: number, itemsPerPage: number): User[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }

  navigateToUpdate(id: number): void {
    this.router.navigate(['/update-user/', id]);
  }

  deleteUser(id: number): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.deleteUser(id).subscribe(() => {
        this.fetchUsers();
      });
    }
  }

  filterUsers(): void {
    if (this.searchTerm.trim() !== '') {
      this.userService.searchUsers(this.searchTerm).subscribe(users => {
        this.totalItems = users.length;
        this.users = this.paginate(users, this.currentPage, this.itemsPerPage);
      });
    } else {
      this.fetchUsers();
    }
  }
  onUserSelected(userId: number): void {
    this.selectedUserId = userId;
  }

  calculateTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
