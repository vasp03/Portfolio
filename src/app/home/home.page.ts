import { Component, AfterViewInit, OnDestroy } from "@angular/core";
import { IonHeader, IonContent, IonCol, IonGrid, IonRow, IonButton, IonText, IonTitle, IonCard } from "@ionic/angular/standalone";

import { addIcons } from "ionicons";
import { closeOutline } from "ionicons/icons";

import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [IonHeader, IonContent, IonGrid, IonRow, IonCol, IonButton, IonText, TranslateModule, IonTitle, IonCard],
  providers: [LoadingController],
})
export class HomePage implements AfterViewInit, OnDestroy {
  private starAnimationFrame: number | null = null;
  private stars: any[] = [];
  private starCanvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private numStars = 1000;
  public selectedLanguage: string = "en";
  public doAnimation: boolean = true;
  private changingPageInProgress: boolean = false;

  constructor(private translate: TranslateService, private loadingCtrl: LoadingController) {
    addIcons({ closeOutline });
    this.selectedLanguage = localStorage.getItem("language") || "en";
    this.translate.setFallbackLang("en");
    this.translate.use(this.selectedLanguage);
    this.updateLanguageUnderline(this.selectedLanguage);
  }

  ngAfterViewInit() {
    this.initStarCanvas();
    window.addEventListener("resize", this.resizeStarCanvas);
  }

  ngOnDestroy() {
    if (this.starAnimationFrame) {
      cancelAnimationFrame(this.starAnimationFrame);
    }

    window.removeEventListener("resize", this.resizeStarCanvas);
  }

  private initStarCanvas = () => {
    this.starCanvas = document.getElementById("star-canvas") as HTMLCanvasElement;
    if (!this.starCanvas) return;
    this.ctx = this.starCanvas.getContext("2d");
    this.resizeStarCanvas();
    this.createStars();
    this.animateStars();
  };

  private resizeStarCanvas = () => {
    if (!this.starCanvas) return;
    this.starCanvas.width = window.innerWidth;
    this.starCanvas.height = window.innerHeight;
    this.createStars();
  };

  private createStars() {
    if (!this.starCanvas) return;

    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.starCanvas.width,
        y: Math.random() * this.starCanvas.height,
        radius: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.15 + 0.05,
        alpha: Math.random(),
        alphaChange: (Math.random() - 0.5) * 0.02,
      });
    }
  }

  private animateStars = () => {
    if (!this.ctx || !this.starCanvas) return;

    this.ctx.clearRect(0, 0, this.starCanvas.width, this.starCanvas.height);

    for (let star of this.stars) {
      // Twinkle
      star.alpha += star.alphaChange;
      if (star.alpha <= 0.2 || star.alpha >= 1) star.alphaChange *= -1;

      // Drift
      star.y += star.speed;
      if (star.y > this.starCanvas.height) {
        star.y = 0;
        star.x = Math.random() * this.starCanvas.width;
      }

      this.ctx.save();
      this.ctx.globalAlpha = star.alpha;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#fff";
      this.ctx.shadowColor = "#fff";
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.starAnimationFrame = requestAnimationFrame(this.animateStars);
  };

  public changePage(page: string = "") {
    if (this.changingPageInProgress) return;

    this.changingPageInProgress = true;

    const overlay = document.getElementById("loading-overlay");

    if (overlay && this.doAnimation) {
      const animation = overlay.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(0%)" }], {
        duration: 1000,
        fill: "forwards",
        easing: "ease-in-out",
      });

      animation.onfinish = () => {
        this.changePageAddress(page);
      };

      overlay.style.transform = "translateX(0%)";
    } else {
      if (!overlay) {
        console.log("Overlay element not found");
      }
      this.changePageAddress(page);
    }
  }

  private changePageAddress(page: string) {
    window.location.href = page;
  }

  public onLanguageButtonClick(language: string) {
    this.changeLanguage(language);
  }

  public changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
    localStorage.setItem("language", lang);
    this.updateLanguageUnderline(lang);
  }

  private updateLanguageUnderline(lang: string) {
    const svBtn = document.getElementById("sv-btn");
    const enBtn = document.getElementById("en-btn");

    if (svBtn && enBtn) {
      if (lang === "sv") {
        svBtn.classList.add("underline");
        enBtn.classList.remove("underline");
      } else {
        svBtn.classList.remove("underline");
        enBtn.classList.add("underline");
      }
    }
  }

  ngOnInit() {
    this.selectedLanguage = localStorage.getItem("language") || "en";
    this.translate.setFallbackLang("en");
    this.translate.use(this.selectedLanguage);
    this.updateLanguageUnderline(this.selectedLanguage);

    localStorage.getItem("doAnimation") === "false" ? (this.doAnimation = false) : (this.doAnimation = true);

    if (this.doAnimation) {
      const btn = document.getElementById("animation-toggle-btn");
      btn!.style.color = "white";
    } else {
      const btn = document.getElementById("animation-toggle-btn");
      btn!.style.color = "red";
    }

    const overlay = document.getElementById("loading-overlay");
    if (overlay && this.doAnimation) {
      overlay.animate([{ transform: "translateX(0)" }, { transform: "translateX(-100%)" }], {
        duration: 1000,
        fill: "forwards",
        easing: "ease-in-out",
      });
    } else {
      if (overlay) {
        overlay.style.display = "none";
      } else {
        console.log("Overlay element not found");
      }
    }
  }

  public animationToggle() {
    this.doAnimation = !this.doAnimation;
    localStorage.setItem("doAnimation", this.doAnimation ? "true" : "false");
    const btn = document.getElementById("animation-toggle-btn");

    if (this.doAnimation) {
      btn!.style.color = "white";
    } else {
      btn!.style.color = "red";
    }
  }

  public dismissLoading() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  }
}
