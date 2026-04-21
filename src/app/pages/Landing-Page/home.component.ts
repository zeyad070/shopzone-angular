import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface Feature {
  icon: SafeHtml;
  title: string;
  desc: string;
}

export interface FeaturedProduct {
  name: string;
  category: string;
  price: string;
  image: string;
  reviews: number;
  badge?: string;
}

export interface WhyPoint {
  icon: SafeHtml;
  title: string;
  desc: string;
}

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  searchQuery = '';
  private observer?: IntersectionObserver;

  features: Feature[] = [];
  featuredProducts: FeaturedProduct[] = [];
  whyPoints: WhyPoint[] = [];
  testimonials: Testimonial[] = [];

  private initData(): void {
    this.features = [
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`),
        title: 'Premium Quality',
        desc: 'Every product is sourced from trusted artisans and undergoes rigorous quality inspection.',
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4l3 3"/>
        </svg>`),
        title: 'Fast Delivery',
        desc: 'Free express shipping on all orders over $200. Delivered right to your door in 2–5 days.',
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>`),
        title: 'Affordable Prices',
        desc: "Transparent pricing with no hidden fees. Beautiful interiors shouldn't break the bank.",
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>`),
        title: 'Secure Shopping',
        desc: 'End-to-end encrypted checkout and hassle-free 30-day returns, always guaranteed.',
      },
    ];

    this.featuredProducts = [
      {
        name: 'PC',
        category: 'PC Setups',
        price: '1,299',
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6',
        reviews: 124,
        badge: 'Best Seller',
      },
      {
        name: 'Laptop',
        category: 'Laptops',
        price: '649',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
        reviews: 87,
        badge: 'New',
      },
      {
        name: 'Wireless Headphone',
        category: 'Accessories',
        price: '100',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944',
        reviews: 56,
      },
    ];

    this.whyPoints = [
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>`),
        title: 'High-Performance Hardware',
        desc: 'We source powerful laptops, GPUs, keyboards, and accessories built for maximum speed and efficiency.',
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>`),
        title: 'Expert Tech Support',
        desc: "Our team helps you choose the perfect setup whether you're a gamer, developer, or creator.",
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>`),
        title: 'Official Warranty Included',
        desc: 'All products come with manufacturer warranty and reliable after-sales support.',
      },
    ];

    this.testimonials = [
      {
        text: 'Absolutely in love with my new laptop. The performance is insane and everything runs so smoothly. ShopZone made the whole buying process super easy.',
        name: 'Sarah Mitchell',
        role: 'Interior Designer',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        text: ' I’ve ordered multiple gaming accessories and every single product exceeded my expectations. Fast delivery, great quality, and amazing customer support.',
        name: 'James Okonkwo',
        role: 'Homeowner, Lagos',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        text: 'The gaming keyboard looks even better in real life. The build quality is premium and it feels amazing to use. I’ll definitely be ordering more tech gear soon.',
        name: 'Amina Rashid',
        role: 'Architect',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
    ];
  }

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
  ) {
    this.initData();
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'landing-page');
    this.initScrollAnimations();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'landing-page');
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/products'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  private initScrollAnimations(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lp-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    setTimeout(() => {
      document.querySelectorAll('.lp-animate').forEach((el) => {
        this.observer!.observe(el);
      });
    }, 150);
  }
}
