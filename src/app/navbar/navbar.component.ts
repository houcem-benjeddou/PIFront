import { Component, HostListener, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  user!: User;
  userId = 1; 
  username: string = '';
  balance: number = 0;
  menuOpen: boolean = false; // Track menu toggle for responsive design
  activeRoute: string = '';
  intervalId: any; // ID for the setInterval
  // Track the current active route
  subscription: Subscription = new Subscription(); // To manage observable subscriptions


  constructor(private router: Router, private userService: UserService) {
    // Set the initial active route
    this.activeRoute = this.router.url;
  }

  ngOnInit(): void {
    this.refreshBalance(); // Fetch balance immediately
    this.startAutoRefresh();
    this.fetchUserDetails();
  }
  refreshBalance(): void {
    const userSubscription = this.userService.getUserById(this.userId).subscribe(
      (user) => {
        this.username = user.username;
        this.balance = user.balance;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    this.subscription.add(userSubscription); // Add subscription to manage later
  }

  startAutoRefresh(): void {
    this.intervalId = setInterval(() => {
      this.refreshBalance(); // Refresh balance every second
    }, 1000);
  }

  stopAutoRefresh(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval
    }
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

  fetchUserDetails(): void {
    this.userService.getUserById(this.userId).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }
}
