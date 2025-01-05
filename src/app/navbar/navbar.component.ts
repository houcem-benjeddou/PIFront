import { Component, HostListener, OnInit  } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  username: string = '';
  balance: number = 0.0;
  userId = 1;
  menuOpen: boolean = false; // Track menu toggle for responsive design
  activeRoute: string = ''; // Track the current active route

  constructor(private router: Router, private userService: UserService) {
    // Set the initial active route
    this.activeRoute = this.router.url;
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  // Method to toggle the menu visibility
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // Method to check if a route is active
  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  // Listen for route changes and update the activeRoute
  @HostListener('window:popstate', ['$event'])
  onPopState(): void {
    this.activeRoute = this.router.url;
  }

  getUserDetails(): void {
    this.userService.getUserDetails(this.userId).subscribe(
      (data) => {
        this.username = data.username;
        this.balance = data.balance;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }
}
