import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { HomeService } from './service/home.service';
import { VERSION } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subject, timer, takeUntil, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'LinkedIn Roaster App';
  description = 'Get your LinkedIn profile roasted! The LinkedIn Roaster App delivers sharp, no-nonsense feedback that’ll turn your profile from basic to blazing. Dare to get roasted?!';

  jobQueue: any = {}; // response from create job queue
  jobQueueResult: any = {}; // response from get job queue
  jobAdviceQueue: any = {}; // response from create job advice queue
  jobAdviceQueueResult: any = {}; // response from get job
  inputForm: any = {}; // input form

  isJobQueueLoading: boolean = false; // loading state
  isJobAdviceQueueLoading: boolean = false; // loading state for advice

  historyData: any = {}; // history data

  globalError: string = ''; // global error

  checkService: any = { // check service status
    status: 'neutral',
    message: 'Idle'
  }

  isConfetti: boolean = false; // confetti state

  test: any;

  currentTheme = "dark";
  svgSunClass = "";
  svgMoonClass = "";

  private ngUnsubscribe = new Subject<void>(); // unsubscribe subject


  constructor(public notificationService: NotificationService, private homeService: HomeService) { }

  ngOnInit(): void {
    this.getThemePreference();
    this.defaultData();
    this.checkServiceStatus();
    this.getHistory();
    // this.exampleData2();
    console.log("version", VERSION.full);
    // this.exampleData();
  }

  defaultData() {
    this.isJobQueueLoading = false;
    this.isJobAdviceQueueLoading = false;
    this.globalError = '';
    this.defaultJobQueue();
    this.defaultJobAdviceQueue();
    this.defaultJobQueueResult();
    this.defaultJobAdviceQueueResult();
    this.defaultInputForm();
  }

  defaultJobQueue() {
    this.jobQueue = {
      message: '',
      jobId: '',
    };
  }

  defaultJobAdviceQueue() {
    this.jobAdviceQueue = {
      message: '',
      jobId: '',
    };
  }

  defaultJobQueueResult() {
    this.jobQueueResult = {
      status: '',
      waitingCount: 0,
      response: {
        username: '',
        lang: '',
        result: '',
        createdAt: '',
      }
    };
  }

  defaultJobAdviceQueueResult() {
    this.jobAdviceQueueResult = {
      status: '',
      waitingCount: 0,
      response: {
        username: '',
        lang: '',
        result: '',
        createdAt: '',
      }
    };
  }

  defaultInputForm() {
    this.inputForm = {
      username: '',
      lang: 'indonesian',
    };
  }

  exampleData() {
    this.jobQueueResult = {
      status: 'success',
      response: {
        username: 'John Doe',
        lang: 'en',
        result: 'dsadsa',
        createdAt: '2021-01-01',
      }
    };
  }

  exampleData2() {
    this.test = {
      status: "completed",
      response: {
        username: "yogibagus",
        lang: "indonesian",
        result: "## Saran untuk Profil LinkedIn Anda\n\n**Bagian Pengalaman Kerja:**\n\n* **Buatlah daftar pengalaman kerja yang lebih terstruktur.**  Saat ini, beberapa judul pekerjaan Anda berulang dan tidak memberikan informasi yang jelas. Anda bisa menggunakan format \"Nama Perusahaan - Jabatan - Periode Kerja\" untuk setiap pengalaman.\n* **Jelaskan tanggung jawab dan pencapaian Anda secara lebih detail.** Misalnya, pada \"PT. Venturo Pro Indonesia,\" Anda bisa sebutkan proyek apa yang Anda kerjakan, teknologi apa yang Anda gunakan, dan hasil apa yang Anda capai. \n* **Tambahkan deskripsi singkat tentang perusahaan.** Sebutkan bidang usaha dan skala perusahaan agar pembaca lebih memahami konteks pekerjaan Anda.\n* **Hindari penggunaan bahasa yang terlalu informal.** Gunakan bahasa formal dan profesional untuk mencerminkan pengalaman kerja Anda.\n* **Tambahkan kata kunci yang relevan.** Pertimbangkan kata kunci yang sering digunakan oleh perusahaan dalam deskripsi pekerjaan untuk posisi yang Anda inginkan.\n* **Manfaatkan fitur \"Ringkasan\" untuk menceritakan lebih banyak tentang Anda.** Berikan gambaran umum tentang keahlian, pengalaman, dan tujuan karier Anda.\n\n**Contoh:**\n\n**PT. Venturo Pro Indonesia - Back End Developer - Februari 2021 - Sekarang**\n\nPT. Venturo Pro Indonesia adalah perusahaan teknologi yang fokus pada pengembangan aplikasi mobile dan web. Sebagai Back End Developer, saya bertanggung jawab untuk:\n\n* Mengembangkan API dengan Golang untuk Pusaka Super App dan NUCARE - LAZISNU.\n* Menerapkan integrasi seamless antara API Golang dengan frontend Angular dan platform mobile.\n* ... (Tambahkan pencapaian Anda, seperti peningkatan performa aplikasi atau penyelesaian proyek penting)\n\n**Semoga saran ini bermanfaat untuk memperkuat profil LinkedIn Anda!** \n",
        createdAt: "8/19/2024, 1:31:15 PM"
      }
    }
  }

  // get theme preference from local storage
  getThemePreference() {
    const theme = localStorage.getItem('theme');
    console.log("theme", theme);
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      // default theme
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    this.currentTheme = document.documentElement.getAttribute('data-theme') ?? '';
  }

  // handle theme
  toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (document.documentElement.getAttribute('data-theme') === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      // default theme
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    this.currentTheme = document.documentElement.getAttribute('data-theme') ?? '';
    // Save theme preference to local storage
    localStorage.setItem('theme', this.currentTheme);
  }

  // check string contain https or http, then return true
  checkContainHttp(url: string) {
    return url.includes('https://') || url.includes('http://');
  }

  // validate input form
  validateInputForm() {
    if (this.inputForm.username === '') {
      this.notificationService.showNotification('error', 'Ops!', 'Username required');
      return false;
    } else if (this.inputForm.lang === '') {
      this.notificationService.showNotification('error', 'Ops!', 'Language required');
      return false;
    }

    if (this.checkContainHttp(this.inputForm.username)) {
      this.notificationService.showNotification('error', 'Ops!', 'Please input the correct username without URL');
      return false;
    }
    return true;
  }

  // Function to create job queue
  createJobQueue() {
    this.globalError = '';
    this.defaultJobQueue();
    this.defaultJobAdviceQueue();
    this.defaultJobQueueResult();
    this.defaultJobAdviceQueueResult();
    if (!this.validateInputForm()) {
      return;
    }
    this.isJobQueueLoading = true;
    var params = this.inputForm;
    this.homeService.createJobQueue(params).subscribe(
      (res: any) => {
        this.jobQueue = res;
        this.getJobQueue();
      },
      (error: any) => {
        console.log("Error create job queue", error);
        // Handle different error formats:
        this.globalError = error?.error?.error
          || error?.error?.message // Check for common message properties
          || error?.message
          || error?.statusText // For HTTP errors
          || "An unknown error occurred. Please try again later.";
        this.isJobQueueLoading = false;
        this.notificationService.showNotification('error', 'Error!', this.globalError);
      }
    );
  }

  // Function to get job queue

  getJobQueue() {
    this.homeService.getJobQueue(this.jobQueue.jobId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((res: any) => {
          this.jobQueueResult = res;
          if (res.status === 'completed') {
            this.isJobQueueLoading = false;
            this.showConfetti();
            this.getHistory();
            this.notificationService.showNotification('success', 'Success!', 'Your profile has been roasted! 🔥');
            return []; // No further requests needed
          } else if (res.status === 'failed') {
            this.globalError = res.error;
            this.isJobQueueLoading = false;
            this.notificationService.showNotification('error', 'Error!', res.error);
            return []; // No further requests needed
          } else {
            return timer(2000); // Retry after 2 seconds
          }
        })
      )
      .subscribe(() => {
        // Handle retries here
        this.getJobQueue();
      },
        (error: any) => {
          console.error('Error fetching job queue:', error);
          this.globalError = error?.error?.error
            || error?.error?.message // Check for common message properties
            || error?.message
            || error?.statusText // For HTTP errors
            || "An unknown error occurred. Please try again later.";
          this.isJobQueueLoading = false;
          this.notificationService.showNotification('error', 'Error!', this.globalError);
        });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Function to create job advice queue
  createJobAdviceQueue() {
    this.globalError = '';
    if (!this.validateInputForm()) {
      return;
    }
    this.isJobAdviceQueueLoading = true;
    var params = {
      jobId: this.jobQueue.jobId,
    }
    this.homeService.createJobAdviceQueue(params).subscribe(
      (res: any) => {
        this.jobAdviceQueue = res;
        this.getJobAdviceQueue();
      },
      (error: any) => {
        this.globalError = error?.error?.error
          || error?.error?.message // Check for common message properties
          || error?.message
          || error?.statusText // For HTTP errors
          || "An unknown error occurred. Please try again later.";
        this.isJobAdviceQueueLoading = false;
        this.notificationService.showNotification('error', 'Error!', this.globalError);
      }
    );
  }

  // Function to get job advice queue
  getJobAdviceQueue() {
    this.homeService.getJobAdviceQueue(this.jobAdviceQueue.jobId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((res: any) => {
          console.log('Job Advice Queue Response:', res);
          this.jobAdviceQueueResult = res;

          if (res.status === 'completed') {
            this.isJobAdviceQueueLoading = false;
            this.showConfetti();
            this.notificationService.showNotification('success', 'Success!', 'Advice has been generated! 🧠');
            return [];
          } else if (res.status === 'failed') {
            this.globalError = res.error;
            this.isJobAdviceQueueLoading = false;
            this.notificationService.showNotification('error', 'Error!', res.error);
            return [];
          } else {
            return timer(2000);
          }
        })
      )
      .subscribe(() => {
        this.getJobAdviceQueue();
      },
        (error: any) => {
          console.error('Error fetching job advice queue:', error);
          this.globalError = error?.error?.error
            || error?.error?.message // Check for common message properties
            || error?.message
            || error?.statusText // For HTTP errors
            || "An unknown error occurred. Please try again later.";
          this.isJobAdviceQueueLoading = false;
          this.notificationService.showNotification('error', 'Error!', this.globalError);
        });
  }

  // Function to get history
  getHistory() {
    this.homeService.getHistory([]).subscribe(
      (res: any) => {
        this.historyData = res;
      },
      (error: any) => {
        console.log("Error get history", error);
        var errorLog = error.error.error ?? error.error ?? "An unknown error occurred, please try again later.";
        this.notificationService.showNotification('error', 'Error!', errorLog);
      }
    );
  }

  checkServiceStatus() {
    this.checkService = {
      status: 'warning',
      message: 'Connecting..'
    }
    this.homeService.checkStatus().subscribe(
      (res: any) => {
        this.checkService = {
          status: 'success',
          message: 'Connected'
        }
      },
      (error: any) => {
        console.log(error);
        this.checkService = 'error';
        this.checkService = {
          status: 'error',
          message: 'Disconnected'
        }
      }
    );
  }

  showTotalRoasted() {
    this.notificationService.showNotification("info", "Yay!", "Total roasted " + this.historyData.data.totalItems + ", thank you for being roasted! 🔥💀");
  }

  showConfetti() {
    this.isConfetti = true;
    setTimeout(() => {
      this.isConfetti = false;
    }, 3000);
  }


  showSuccessNotification() {
    this.notificationService.showNotification(
      'success',
      'Berhasil!',
      'Data berhasil disimpan.'
    );
  }

  showErrorNotification() {
    this.notificationService.showNotification(
      'error',
      'Error!',
      'Terjadi kesalahan.'
    );
  }
}
