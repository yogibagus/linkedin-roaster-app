import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { HomeService } from './service/home.service';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'Linkedin Roaster App';
  description = 'Get your LinkedIn profile roasted! The LinkedIn Roaster App delivers sharp, no-nonsense feedback that’ll turn your profile from basic toblazing. Dare to get roasted?!';

  jobQueue: any = {}; // response from create job queue
  jobQueueResult: any = {}; // response from get job queue
  jobAdviceQueue: any = {}; // response from create job advice queue
  jobAdviceQueueResult: any = {}; // response from get job
  inputForm: any = {}; // input form

  isJobQueueLoading: boolean = false; // loading state
  isJobAdviceQueueLoading: boolean = false; // loading state for advice

  historyData: any = []; // history data

  globalError: string = ''; // global error
  
  checkService: any = {
    status: 'neutral',
    message: 'Idle'
  }

  test: any;



  constructor(public notificationService: NotificationService, private homeService: HomeService) { }

  ngOnInit(): void {
    this.defaultData();
    this.checkServiceStatus();
    // this.exampleData2();
    console.log("version", VERSION.full);
    // this.exampleData();
  }

  defaultData() {
    this.globalError = '';

    this.jobQueue = {
      message: '',
      jobId: '',
    };

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

    if(this.checkContainHttp(this.inputForm.username)) {
      this.notificationService.showNotification('error', 'Ops!', 'Please input the correct username without URL');
      return false;
    }
    return true;
  }

  // Function to create job queue
  createJobQueue() {
    this.globalError = '';
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
        this.globalError = error.error.error;
        this.isJobQueueLoading = false;
        this.notificationService.showNotification('error', 'Error!', error.error.error);
      }
    );
  }

  // Function to get job queue
  getJobQueue() {
    var params = this.jobQueue.jobId;
    this.homeService.getJobQueue(params).subscribe(
      (res: any) => {
        console.log(res);
        this.jobQueueResult = res;
        if (res.status === 'completed') {
          this.isJobQueueLoading = false;
        } else if (res.status === 'failed') {
          this.globalError = res.error
          this.notificationService.showNotification('error', 'Error!', res.error);
          this.isJobQueueLoading = false
        } else if (res.status === 'waiting' || res.status === 'active' || res.status === 'delayed' || res.status === 'stuck') {
          // console.log(this.jobQueueResponse);
          setTimeout(() => {
            this.getJobQueue();
          }, 2000);
        }
      },
      (error: any) => {
        console.log(error);
        this.globalError = error.error.error;
        this.isJobQueueLoading = false;
        this.notificationService.showNotification('error', 'Error!', error.error.error);
      }
    );
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
        this.globalError = error.error.error;
        this.isJobAdviceQueueLoading = false;
        this.notificationService.showNotification('error', 'Error!', error.error.error);
      }
    );
  }

  // Function to get job advice queue
  getJobAdviceQueue() {
    var params = this.jobAdviceQueue.jobId;
    this.homeService.getJobAdviceQueue(params).subscribe(
      (res: any) => {
        this.jobAdviceQueueResult = res;
        if (res.status === 'completed') {
          this.isJobAdviceQueueLoading = false;
        } else if (res.status === 'failed') {
          this.globalError = res.error
          this.notificationService.showNotification('error', 'Error!', res.error);
          this.isJobAdviceQueueLoading = false
        } else if (res.status === 'waiting' || res.status === 'active' || res.status === 'delayed' || res.status === 'stuck') {
          setTimeout(() => {
            this.getJobAdviceQueue();
          }, 2000);
        }
      },
      (error: any) => {
        console.log(error);
        this.globalError = error.error.error;
        this.isJobAdviceQueueLoading = false;
        this.notificationService.showNotification('error', 'Error!', error.error.error);
      }
    );
  }

  // Function to get history
  getHistory() {
    this.homeService.getHistory([]).subscribe(
      (res: any) => {
        this.historyData = res;
      },
      (error: any) => {
        console.log(error);
        this.notificationService.showNotification('error', 'Error!', error.error.error);
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
