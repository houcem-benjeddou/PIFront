import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen: boolean = false; // Track menu toggle for responsive design
  activeRoute: string = ''; // Track the current active route

  constructor(private router: Router) {
    // Set the initial active route
    this.activeRoute = this.router.url;
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
}
