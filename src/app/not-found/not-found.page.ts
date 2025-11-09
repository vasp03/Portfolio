import { Component } from "@angular/core";
import { IonHeader, IonContent, IonCol, IonGrid, IonRow, IonButton, IonText, IonCard } from "@ionic/angular/standalone";

import { addIcons } from "ionicons";
import { closeOutline } from "ionicons/icons";

import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.page.html",
  imports: [IonHeader, IonContent, IonGrid, IonRow, IonCol, IonButton, IonText, TranslateModule, IonCard],
  styleUrls: ["./not-found.page.scss"],
})
export class NotFoundPage {
  public selectedLanguage: string = "en";
  public doAnimation: boolean = true;

  constructor(private translate: TranslateService, private loadingCtrl: LoadingController) {
    addIcons({ closeOutline });
    this.selectedLanguage = localStorage.getItem("language") || "en";
    this.translate.setFallbackLang("en");
    this.translate.use(this.selectedLanguage);
    this.updateLanguageUnderline(this.selectedLanguage);
  }

  public changePage(page: string = "") {
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
      if (btn) {
        btn.style.color = "white";
      }
    } else {
      const btn = document.getElementById("animation-toggle-btn");
      if (btn) {
        btn.style.color = "red";
      }
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

    if (this.doAnimation) {
      const btn = document.getElementById("animation-toggle-btn");
      if (btn) {
        btn.style.color = "white";
      }
    } else {
      const btn = document.getElementById("animation-toggle-btn");
      if (btn) {
        btn.style.color = "red";
      }
    }
  }

  public dismissLoading() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  }
}
