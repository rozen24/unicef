// Youth Health LMS - Main Application Logic

class YouthHealthLMS {
  constructor() {
    this.currentView = "home";
    this.currentUser = null;
    this.selectedCourse = null;
    this.currentlessionIndex = 0;
    this.showQuiz = false;
    this.quizState = {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0,
    };

    this.init();
  }

  init() {
    // Check for existing session
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentView = "dashboard";
    }

    this.render();
  }

  // Initialize or refresh AOS scroll animations across views
  initAOS() {
    if (typeof AOS === "undefined") return;
    if (this._aosInitialized) {
      try { AOS.refreshHard(); } catch (e) { AOS.refresh(); }
      // Ensure measurements after DOM settles
      setTimeout(() => {
        try { AOS.refresh(); } catch (e) {}
      }, 80);
    } else {
      AOS.init({
        duration: 800,
        once: true,
        offset: 60,
        easing: "ease-out-quart",
      });
      this._aosInitialized = true;
      // Defer a refresh to capture late layout changes in SPA renders
      setTimeout(() => {
        try { AOS.refresh(); } catch (e) {}
      }, 100);
    }
  }

  // Navigation methods
  navigateTo(view) {
    this.currentView = view;
    this.render();
  }

  // User authentication
  login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(
      (u) => u.email === email && u.password === password
    );

    if (userIndex !== -1) {
      const user = users[userIndex];

      // Update last login time
      user.lastLogin = new Date().toISOString();
      users[userIndex] = user;
      localStorage.setItem("users", JSON.stringify(users));

      this.currentUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        registeredAt: user.registeredAt,
      };
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));

      console.log(`✅ Login successful! User ID: ${user.id}`);

      this.navigateTo("dashboard");
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  }

  // Generate unique user ID
  generateUniqueUserId() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const randomChars = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const userId = `YHAP-${timestamp}-${randomChars}-${randomNum}`;

    // Log ID generation (helpful for debugging)
    console.log(`🆔 Generated User ID: ${userId}`);

    return userId;
  }

  register(name, email, password, confirmPassword) {
    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: "Please fill in all fields" };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }

    // Generate unique user ID
    let userId = this.generateUniqueUserId();

    // Ensure the ID is unique (extremely unlikely to collide, but good practice)
    while (users.find((u) => u.id === userId)) {
      userId = this.generateUniqueUserId();
    }

    const registrationDate = new Date().toISOString();

    const newUser = {
      id: userId,
      name,
      email,
      password,
      registeredAt: registrationDate,
      lastLogin: registrationDate,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    this.currentUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      registeredAt: newUser.registeredAt,
    };
    localStorage.setItem("currentUser", JSON.stringify(this.currentUser));

    // Log registration success with unique ID
    console.log(`✅ Registration successful! User ID: ${userId}`);

    this.navigateTo("dashboard");

    return { success: true, userId: userId };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    this.navigateTo("home");
  }

  // Course methods
  selectCourse(courseId) {
    this.selectedCourse = coursesData.find((c) => c.id === courseId);
    this.currentlessionIndex = 0;
    this.currentLessonIndex = 0;
    this.showQuiz = false;

    // Check if course uses new lesson system
    if (this.selectedCourse.lessons && this.selectedCourse.lessons.length > 0) {
      // New lesson slider system
      this.navigateTo("lesson-slider");
    } else {
      // Old lession system
      // Load progress and find first incomplete lession
      const progress = this.getUserProgress(courseId);
      if (progress) {
        const firstIncomplete = this.selectedCourse.lessions.findIndex(
          (lession) => !progress.completedlessions.includes(lession.id)
        );
        if (firstIncomplete !== -1) {
          this.currentlessionIndex = firstIncomplete;
        }
      }

      this.navigateTo("course");
    }
  }

  viewCertificate(courseId) {
    // Navigate within SPA to certificate view
    const course = (typeof coursesData !== 'undefined' ? coursesData : []).find(c => c.id === courseId);
    if (course) {
      this.selectedCourse = course;
      this.navigateTo('certificate');
    } else {
      alert('Course not found for certificate');
    }
  }

  // Progress tracking
  getUserProgress(courseId) {
    const key = `progress-${this.currentUser.id}-${courseId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  initializeProgress(courseId) {
    const progress = {
      userId: this.currentUser.id,
      courseId: courseId,
      completedlessions: [],
      quizScores: {},
      certificateIssued: false,
    };

    const key = `progress-${this.currentUser.id}-${courseId}`;
    localStorage.setItem(key, JSON.stringify(progress));
    return progress;
  }

  updateProgress(courseId, lessionId, score, passed) {
    const key = `progress-${this.currentUser.id}-${courseId}`;
    let progress = this.getUserProgress(courseId);

    if (!progress) {
      progress = this.initializeProgress(courseId);
    }

    progress.quizScores[lessionId] = score;

    if (passed && !progress.completedlessions.includes(lessionId)) {
      progress.completedlessions.push(lessionId);

      // Check if all lessions/lessons completed
      const total = this.selectedCourse.lessons
        ? this.selectedCourse.lessons.length
        : this.selectedCourse.lessions.length;
      if (progress.completedlessions.length === total) {
        progress.certificateIssued = true;
      }
    }

    localStorage.setItem(key, JSON.stringify(progress));
    return progress;
  }

  calculateProgress(course) {
    const progress = this.getUserProgress(course.id);
    if (!progress) return 0;
    const total = course.lessons
      ? course.lessons.length
      : course.lessions
      ? course.lessions.length
      : 1;
    return (progress.completedlessions.length / total) * 100;
  }

  isCourseCompleted(courseId) {
    const progress = this.getUserProgress(courseId);
    return progress?.certificateIssued || false;
  }

  // Quiz methods
  startQuiz() {
    this.showQuiz = true;
    this.quizState = {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0,
    };
    this.render();
  }

  selectAnswer(answerIndex) {
    this.quizState.selectedAnswers[this.quizState.currentQuestionIndex] =
      answerIndex;
    this.render();
  }

  nextQuestion() {
    const items = this.selectedCourse.lessons || this.selectedCourse.lessions;
    const idx = this.selectedCourse.lessons
      ? this.currentLessonIndex || 0
      : this.currentlessionIndex;
    const currentItem = items[idx];
    const isLastQuestion =
      this.quizState.currentQuestionIndex ===
      currentItem.quiz.questions.length - 1;

    if (isLastQuestion) {
      this.calculateQuizScore();
    } else {
      this.quizState.currentQuestionIndex++;
      this.render();
    }
  }

  previousQuestion() {
    if (this.quizState.currentQuestionIndex > 0) {
      this.quizState.currentQuestionIndex--;
      this.render();
    }
  }

  calculateQuizScore() {
    const items = this.selectedCourse.lessons || this.selectedCourse.lessions;
    const idx = this.selectedCourse.lessons
      ? this.currentLessonIndex || 0
      : this.currentlessionIndex;
    const currentItem = items[idx];
    let correct = 0;

    currentItem.quiz.questions.forEach((question, index) => {
      if (this.quizState.selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const percentage = (correct / currentItem.quiz.questions.length) * 100;
    this.quizState.score = percentage;
    this.quizState.showResults = true;
    this.render();
  }

  retryQuiz() {
    this.quizState = {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0,
    };
    this.render();
  }

  finishQuiz() {
    const usingLessons = !!this.selectedCourse.lessons;
    const items = this.selectedCourse.lessons || this.selectedCourse.lessions;
    const idx = usingLessons
      ? this.currentLessonIndex || 0
      : this.currentlessionIndex;
    const currentItem = items[idx];
    const passed = this.quizState.score >= currentItem.quiz.passingScore;

    this.updateProgress(
      this.selectedCourse.id,
      currentItem.id,
      this.quizState.score,
      passed
    );
    this.showQuiz = false;

    if (passed && idx < items.length - 1) {
      setTimeout(() => {
        if (usingLessons) {
          this.currentLessonIndex = idx + 1;
        } else {
          this.currentlessionIndex = idx + 1;
        }
        this.render();
      }, 1500);
    } else {
      this.render();
    }
  }

  changelession(index) {
    const progress =
      this.getUserProgress(this.selectedCourse.id) ||
      this.initializeProgress(this.selectedCourse.id);
    const items = this.selectedCourse.lessons || this.selectedCourse.lessions;
    const unlocked =
      index === 0 || progress.completedlessions.includes(items[index - 1]?.id);

    if (unlocked) {
      this.currentlessionIndex = index;
      this.currentLessonIndex = index;
      this.showQuiz = false;
      this.render();
    }
  }

  // Render methods
  render() {
    const app = document.getElementById("app");

    switch (this.currentView) {
      case "home":
        app.innerHTML = this.renderHome();
        this.initHomeScripts();
        this.initAOS();
        break;
      case "login":
        app.innerHTML = this.renderLogin();
        this.initAOS();
        this.attachLoginHandlers();
        break;
      case "register":
        app.innerHTML = this.renderRegister();
        this.initAOS();
        this.attachRegisterHandlers();
        break;
      case "dashboard":
        app.innerHTML = this.renderDashboard();
        this.initAOS();
        break;
      case "course":
        app.innerHTML = this.renderCourse();
        this.initAOS();
        this.initLessonAudio();
        break;
      case "lesson-slider":
        app.innerHTML = this.renderLessonSlider();
        // Initialize lesson audio controls/state after DOM is ready
        this.initLessonAudio();
        this.initAOS();
        break;
      case "certificate":
        app.innerHTML = this.renderCertificate();
        this.initAOS();
        break;
    }
  }

  initHomeScripts() {
    // Initialize AOS (if available)
    this.initAOS();

    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      const scrollToTop = document.getElementById("scrollToTop");

      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add("scrolled");
          if (scrollToTop) scrollToTop.classList.add("show");
        } else {
          navbar.classList.remove("scrolled");
          if (scrollToTop) scrollToTop.classList.remove("show");
        }
      }

      // Active nav link on scroll
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");

      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        if (this.getAttribute("href").length > 1) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById("scrollToTop");
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    // Counter Animation Function
    const animateCounter = (element, target, duration = 2000, suffix = "") => {
      let startTime = null;
      const startValue = 0;

      let numericTarget = target;
      let targetSuffix = suffix;

      if (typeof target === "string") {
        const match = target.match(/^([\d.]+)([MBK%]?)$/);
        if (match) {
          numericTarget = parseFloat(match[1]);
          targetSuffix = match[2];
        }
      }

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue =
          startValue + (numericTarget - startValue) * easeProgress;

        let displayValue;
        if (numericTarget >= 10) {
          displayValue = Math.floor(currentValue);
        } else {
          displayValue = currentValue.toFixed(1);
        }

        element.textContent = displayValue + targetSuffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = numericTarget + targetSuffix;
        }
      };

      requestAnimationFrame(animate);
    };

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("animated")
          ) {
            entry.target.classList.add("animated");
            const target = entry.target.getAttribute("data-target");
            animateCounter(entry.target, target, 2500);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all stat numbers and stat values
    document.querySelectorAll(".stat-number").forEach((stat) => {
      const originalText = stat.textContent.trim();
      stat.setAttribute("data-target", originalText);
      stat.textContent = "0";
      counterObserver.observe(stat);
    });

    document.querySelectorAll(".stat-value").forEach((stat) => {
      const originalText = stat.textContent.trim();
      stat.setAttribute("data-target", originalText);
      stat.textContent = "0";
      counterObserver.observe(stat);
    });
  }

  renderHome() {
    return `
      <!-- Navigation -->
      <nav class="navbar navbar-expand-lg fixed-top">
          <div class="container">
              <a class="navbar-brand" href="#" onclick="app.navigateTo('home'); return false;">
                  <img src="img/UNICEF_Logo.png" alt="" style="width: 120px; height: 50px;">
              </a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link active transition-base" href="#home">Home</a></li>
            <li class="nav-item"><a class="nav-link transition-base" href="#about">About</a></li>
            <li class="nav-item"><a class="nav-link transition-base" href="#components">Core Components</a></li>
            <li class="nav-item"><a class="nav-link transition-base" href="#roles">Roles</a></li>
            <li class="nav-item"><a class="nav-link transition-base" href="#eligibility">How to Join</a></li>
            <li class="nav-item"><a class="nav-link transition-base" href="#statistics">Statistics</a></li>
            <li class="nav-item"><a href="#" class="btn-modern btn-gradient ms-3 hover-lift-sm focus-visible-ring transition-base" onclick="app.navigateTo('login'); return false;">Login</a></li>
                  </ul>
              </div>
          </div>
      </nav>

      <!-- Hero Section -->
      <section id="home" class="hero-section">
          <div class="container">
              <div class="row align-items-center">
                  <div class="col-lg-7" data-aos="fade-right">
                      <div class="hero-content">
                          <h1 class="hero-title">Youth Health Ambassador Programme</h1>
                          <p class="hero-description">
                              A strategic joint initiative designed to empower youth by enhancing their health awareness and building their capacity in primary prevention and health promotion, enabling them to serve as informed health ambassadors.
                          </p>
                          <div class="d-flex gap-3 flex-wrap">
                <a href="#eligibility" class="btn-modern btn-gradient hover-lift-sm focus-visible-ring transition-base">Become an Ambassador</a>
                <a href="#" class="btn-modern btn-outline-gradient hover-lift-sm focus-visible-ring transition-base" onclick="app.navigateTo('login'); return false;">Access Login</a>
                          </div>
                      </div>
                      <div class="hero-stats">
                          <div class="stat-item">
                              <span class="stat-number">49.5M</span>
                              <span class="stat-label">Young People in <br> Bangladesh</span>
                          </div>
                          <div class="stat-item">
                              <span class="stat-number">15-24</span>
                              <span class="stat-label">Age Group</span>
                          </div>
                          <div class="stat-item">
                              <span class="stat-number">30% </span>
                              <span class="stat-label">of <br>Total Population</span>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-5" data-aos="fade-left">
                      <div class="animate-float">
                          <img src="img/Asset 2.png" alt="Youth Health" class="img-fluid" style="position: relative; z-index: 2;">
                      </div>
                  </div>
              </div>
          </div>
      <!-- Floating background elements -->
      <div class="floating-bg" aria-hidden="true">
      <span class="float-elem" style="top:10%; left:5%;"></span>
      <span class="float-elem" style="top:20%; right:8%;"></span>
      <span class="float-elem" style="bottom:15%; left:12%;"></span>
      <span class="float-elem" style="bottom:10%; right:10%;"></span>
      <span class="float-elem" style="top:50%; left:45%; width:80px; height:80px;"></span>
      </div>
      </section>

      <!-- Definitions Section -->
      <section id="about" class="section-padding bg-light">
          <div class="container">
              <div class="row justify-content-center">
                  <div class="col-lg-8 text-center mb-5" data-aos="fade-up">
                      <h2 class="section-title gradient-text">Understanding YHAP</h2>
                      <p class="section-subtitle">Key definitions that frame our mission</p>
                  </div>
              </div>
              <div class="row g-4 justify-content-center">
                  <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="modern-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="d-flex align-items-center mb-3">
                              <div class="card-icon bg-gradient-purple me-3">
                                  <i class="fas fa-users"></i>
                              </div>
                              <h3 class="card-title mb-0">Youth</h3>
                          </div>
                          <p class="card-text">
                              <strong>As per United Nations,</strong> youth refers to those persons aged between the ages of <strong>15 and 24</strong> without prejudice to other definitions by Member States. It is a period of transition from the dependence of childhood to adulthood's independence.
                          </p>
                      </div>
                  </div>
                 
                  <div class="col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div class="modern-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="d-flex align-items-center mb-3">
                              <div class="card-icon bg-gradient-teal me-3">
                                  <i class="fas fa-heartbeat"></i>
                              </div>
                              <h3 class="card-title mb-0">Health</h3>
                          </div>
                          <p class="card-text">
                              <strong>As per World Health Organization (WHO),</strong> health is defined as a state of complete <strong>physical, mental, and social well-being</strong>, and not merely the absence of disease or infirmity.
                          </p>
                      </div>
                  </div>
              </div>
              <div class="alert alert-info d-inline-block mt-5 w-100 text-centeralign-items-center justify-content-center">
                          <i class="fas fa-info-circle me-2"></i>
                        <em>Note: Young People covers the age range 10-24 years and Adolescents as individuals in the 10-19 years age group.</em>
              </div>  
          </div>
      </section>

      <!-- Core Components Section -->
      <section id="components" class="section-padding">
          <div class="container">
              <div class="row justify-content-center">
                  <div class="col-lg-8 text-center mb-5" data-aos="fade-up">
                      <h2 class="section-title gradient-text">Core Components of YHAP</h2>
                      <p class="section-subtitle">Six pillars that empower our Youth Health Ambassadors</p>
                  </div>
              </div>
              <div class="row g-4">
                  <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="100">
            <div class="info-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="info-icon bg-gradient-purple">
                              <i class="fas fa-book-medical"></i>
                          </div>
                          <h4 class="info-title">Health Literacy</h4>
                          <p class="info-description">
                              YHAP builds foundational health literacy through comprehensive training on essential health and wellbeing. This equips ambassadors with the expertise to act as credible sources of information.
                          </p>
                      </div>
                  </div>
                  <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="200">
            <div class="info-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="info-icon bg-gradient-blue">
                              <i class="fas fa-graduation-cap"></i>
                          </div>
                          <h4 class="info-title">Health Education & Awareness</h4>
                          <p class="info-description">
                              YHAs create health education through campaigns on key health issues, comprehensive trainings, and mentorships, ensuring accurate dissemination of crucial health information.
                          </p>
                      </div>
                  </div>
                  <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="300">
            <div class="info-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="info-icon bg-gradient-teal">
                              <i class="fas fa-users"></i>
                          </div>
                          <h4 class="info-title">Peer to Peer Influence</h4>
                          <p class="info-description">
                              Built on the principle that peer-to-peer engagement is a powerful catalyst for change, facilitating supportive mentorship and encouraging positive role-modeling.
                          </p>
                      </div>
                  </div>
                  <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="400">
            <div class="info-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="info-icon bg-gradient-orange">
                              <i class="fas fa-hand-fist"></i>
                          </div>
                          <h4 class="info-title">Empowerment</h4>
                          <p class="info-description">
                              YHAP empowers individuals by equipping them with tools, confidence, and skills needed to take effective control and contribute to economic development.
                          </p>
                      </div>
                  </div>
                  <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="500">
            <div class="info-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="info-icon bg-gradient-green">
                              <i class="fas fa-flag"></i>
                          </div>
                          <h4 class="info-title">Leadership</h4>
                          <p class="info-description">
                              The program cultivates leadership qualities in youth, preparing them to become effective, ethical, and inspiring agents of change in their communities.
                          </p>
                      </div>
                  </div>
                  <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="600">
            <div class="info-card hover-shadow-glow hover-lift-sm transition-base icon-spin-on-hover">
                          <div class="info-icon bg-gradient-pink">
                              <i class="fas fa-bullhorn"></i>
                          </div>
                          <h4 class="info-title">Advocacy</h4>
                          <p class="info-description">
                              YHAP builds foundational competencies in health advocacy, empowering youth to effectively raise voice and articulate public health priorities.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Roles Section -->
      <section id="roles" class="section-padding bg-light">
          <div class="container">
              <div class="row justify-content-center">
                  <div class="col-lg-10 text-center mb-5" data-aos="fade-up">
                      <h2 class="section-title gradient-text">Who Am I as a Health Ambassador?</h2>
                      <p class="section-subtitle">My roles and responsibilities in transforming community health</p>
                  </div>
              </div>
              <div class="row g-4">
          <div class="col-md-6" data-aos="fade-right" data-aos-delay="100">
            <div class="fact-item hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="fact-icon">
                              <i class="fas fa-shield-heart"></i>
                          </div>
                          <p class="fact-text">
                              I am equipped with expertise in safeguarding adolescent and youth health and well-being, enabling me to contribute meaningfully to society while harnessing the triple dividend of health, social, and economic benefits.
                          </p>
                      </div>
                  </div>
          <div class="col-md-6" data-aos="fade-left" data-aos-delay="200">
            <div class="fact-item hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="fact-icon">
                              <i class="fas fa-share-nodes"></i>
                          </div>
                          <p class="fact-text">
                              I actively empower my peers by sharing knowledge on health promotion, disease prevention, and holistic well-being, fostering informed decision-making among adolescents and youth.
                          </p>
                      </div>
                  </div>
          <div class="col-md-6" data-aos="fade-right" data-aos-delay="300">
            <div class="fact-item hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="fact-icon">
                              <i class="fas fa-handshake"></i>
                          </div>
                          <p class="fact-text">
                              Through advocacy, I engage policy makers, stakeholders and community influencer, gatekeepers to prioritize adolescent health, ensuring supportive policies and collaborative action.
                          </p>
                      </div>
                  </div>
          <div class="col-md-6" data-aos="fade-left" data-aos-delay="400">
            <div class="fact-item hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="fact-icon">
                              <i class="fas fa-chart-line"></i>
                          </div>
                          <p class="fact-text">
                              I drive awareness and demand creation within communities, inspiring collective responsibility and action toward better health outcomes for adolescents and youth.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

  <!-- Eligibility & Lessions Section -->
      <section id="eligibility" class="section-padding">
          <div class="container">
              <div class="row justify-content-center">
                  <div class="col-lg-8 text-center mb-5" data-aos="fade-up">
                      <h2 class="section-title gradient-text">How to Become a Youth Health Ambassador</h2>
                      <p class="section-subtitle">Follow these simple lessions to join the movement</p>
                      <div class="alert alert-info d-inline-block">
                          <i class="fas fa-info-circle me-2"></i>
                          <strong>Eligibility:</strong> Any person between 15-24 years of age is eligible
                      </div>
                  </div>
              </div>
              <div class="row g-4">
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">1</div>
                          <h5 class="step-title">Online Registration</h5>
                          <p class="step-description">Register in the Health Ambassador Programme platform</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">2</div>
                          <h5 class="step-title">Unique ID Generation</h5>
                          <p class="step-description">Receive your unique identification number</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">3</div>
                          <h5 class="step-title">Login to Platform</h5>
                          <p class="step-description">Access the Website/App with your credentials</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">4</div>
                          <h5 class="step-title">Access Course</h5>
                          <p class="step-description">Access comprehensive Health Ambassador course content</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">5</div>
                          <h5 class="step-title">Complete Course</h5>
                          <p class="step-description">Complete all online Health Ambassador modules</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">6</div>
                          <h5 class="step-title">Pass Assessment</h5>
                          <p class="step-description">Obtain passing marks in the final assessment</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="700">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">7</div>
                          <h5 class="step-title">System Certification</h5>
                          <p class="step-description">Receive system-generated certification</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="800">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">8</div>
                          <h5 class="step-title">Oath Taking</h5>
                          <p class="step-description">Complete self-declaration and oath ceremony</p>
                      </div>
                  </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="900">
            <div class="process-step hover-lift-sm hover-shadow-glow transition-base icon-spin-on-hover">
                          <div class="step-number">9</div>
                          <h5 class="step-title">Final Certificate</h5>
                          <p class="step-description">Receive Final Certificate (Valid for 2 years)</p>
                      </div>
                  </div>
              </div>
              <div class="text-center mt-5" data-aos="fade-up">
          <a href="#" class="btn-modern btn-gradient btn-lg hover-lift-sm focus-visible-ring transition-base" onclick="app.navigateTo('register'); return false;">
                      <i class="fas fa-rocket me-2"></i>Start Your Journey Now
                  </a>
              </div>
          </div>
      </section>

      <!-- Global Statistics -->
      <section id="statistics" class="section-padding bg-light">
          <div class="container">
              <div class="row justify-content-center">
                  <div class="col-lg-8 text-center mb-5" data-aos="fade-up">
                      <h2 class="section-title gradient-text">Youth Around the World</h2>
                      <p class="section-subtitle">Understanding the global and local landscape</p>
                  </div>
              </div>
              <div class="row g-4 mb-5">
          <div class="col-md-4" data-aos="zoom-in" data-aos-delay="100">
            <div class="stat-box hover-lift-sm hover-shadow-glow transition-base">
                          <div class="stat-icon-large">
                              <i class="fas fa-earth-americas"></i>
                          </div>
                          <span class="stat-value">1.8B</span>
                          <p class="stat-description">Youth Worldwide</p>
                          <p class="text-muted small">90% live in developing countries</p>
                      </div>
                  </div>
          <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
            <div class="stat-box hover-lift-sm hover-shadow-glow transition-base">
                          <div class="stat-icon-large">
                              <i class="fas fa-users-between-lines"></i>
                          </div>
                          <span class="stat-value">49.5M</span>
                          <p class="stat-description">Young People in </br> Bangladesh</p>
                          <p class="text-muted small">Approx. 30% of total population</p>
                      </div>
                  </div>
          <div class="col-md-4" data-aos="zoom-in" data-aos-delay="300">
            <div class="stat-box hover-lift-sm hover-shadow-glow transition-base">
                          <div class="stat-icon-large">
                              <i class="fas fa-user-group"></i>
                          </div>
                          <span class="stat-value">31.5M</span>
                          <p class="stat-description">Youth in Bangladesh</p>
                          <p class="text-muted small">Ages 15-24 years</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Triple Dividend Section -->
      

      <!-- Global Mortality Facts -->
      

      <!-- Bangladesh Context -->
      

      <!-- Key Facts -->
      

      <!-- Determinants Section -->
      

      <!-- CTA Section -->
      

      <!-- Footer -->
      <footer class="footer">
          <div class="container">
              <div class="row g-4">
                  <div class="col-lg-4">
                      <h3 class="footer-title">Youth Health Ambassador Programme</h3>
                      <p class="text-white-50">A strategic joint initiative of the Ministry of Health and Family Welfare (MOHFW) and UNICEF to empower youth through health education.</p>
                      <div class="footer-social">
                          <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                          <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                          <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                          <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
                      </div>
                  </div>
                  <div class="col-lg-2 col-md-6">
                      <h4 class="footer-title">Quick Links</h4>
                      <a href="#about" class="footer-link">About YHAP</a>
                      <a href="#components" class="footer-link">Core Components</a>
                      <a href="#roles" class="footer-link">Roles</a>
                      <a href="#eligibility" class="footer-link">How to Join</a>
                  </div>
                  <div class="col-lg-2 col-md-6">
                      <h4 class="footer-title">Resources</h4>
                      <a href="#" class="footer-link" onclick="app.navigateTo('login'); return false;">Login</a>
                      <a href="#statistics" class="footer-link">Statistics</a>
                      <a href="#" class="footer-link">Downloads</a>
                      <a href="#" class="footer-link">FAQs</a>
                  </div>
                  <div class="col-lg-4">
                      <h4 class="footer-title">Contact Us</h4>
                      <p class="text-white-50"><i class="fas fa-map-marker-alt me-2"></i>Ministry of Health and Family Welfare, Bangladesh</p>
                      <p class="text-white-50"><i class="fas fa-envelope me-2"></i>info@yhap.gov.bd</p>
                      <p class="text-white-50"><i class="fas fa-phone me-2"></i>+880 XXX-XXXXXXX</p>
                  </div>
              </div>
              <div class="footer-bottom">
                  <p class="mb-0">&copy; 2025 Youth Health Ambassador Programme (YHAP). All rights reserved.</p>
                  <p class="mb-0 small">A Joint Initiative of MOHFW & UNICEF</p>
              </div>
          </div>
      </footer>

      <!-- Scroll to Top Button -->
      <div id="scrollToTop">
          <i class="fas fa-arrow-up"></i>
      </div>
    `;
  }

  renderLogin() {
    return `
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="container py-3">
          <div class="d-flex align-items-center gap-2">
            <a class="navbar-brand" href="#" onclick="app.navigateTo('home'); return false;">
                  <img src="img/UNICEF_Logo.png" alt="" style="width: 120px; height: 50px;">
            </a>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <button class="btn btn-link text-decoration-none mb-3 p-0" onclick="app.navigateTo('home')">
              <i class="bi bi-arrow-left me-2"></i>Back to Home
            </button>

            <div class="card shadow-lg border-0">
              <div class="card-body p-4">
                <h2 class="text-center mb-2">Welcome Back</h2>
                <p class="text-center text-muted mb-4">Log in to continue your learning journey</p>

                <div id="loginError" class="alert alert-danger d-none"></div>

                <form id="loginForm">
                  <div class="mb-3">
                    <label for="loginEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="loginEmail" placeholder="your@email.com" required>
                  </div>

                  <div class="mb-3">
                    <label for="loginPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" id="loginPassword" placeholder="••••••••" required>
                  </div>

                  <button type="submit" class="btn btn-primary w-100">Log In</button>
                </form>

                <div class="text-center mt-4">
                  <p class="text-muted mb-0">
                    Don't have an account?
                    <a href="#" onclick="app.navigateTo('register'); return false;" class="text-decoration-none">Sign up</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRegister() {
    return `
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="container py-3">
          <div class="d-flex align-items-center gap-2">
            <a class="navbar-brand" href="#" onclick="app.navigateTo('home'); return false;">
                  <img src="img/UNICEF_Logo.png" alt="" style="width: 120px; height: 50px;">
            </a>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <button class="btn btn-link text-decoration-none mb-3 p-0" onclick="app.navigateTo('home')">
              <i class="bi bi-arrow-left me-2"></i>Back to Home
            </button>

            <div class="card shadow-lg border-0">
              <div class="card-body p-4">
                <h2 class="text-center mb-2">Create Your Account</h2>
                <p class="text-center text-muted mb-4">Start your health learning journey today</p>

                <div id="registerError" class="alert alert-danger d-none"></div>

                <form id="registerForm">
                  <div class="mb-3">
                    <label for="registerName" class="form-label">Full Name</label>
                    <input type="text" class="form-control" id="registerName" placeholder="John Doe" required>
                  </div>

                  <div class="mb-3">
                    <label for="registerEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="registerEmail" placeholder="your@email.com" required>
                  </div>

                  <div class="mb-3">
                    <label for="registerPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" id="registerPassword" placeholder="••••••••" required>
                  </div>

                  <div class="mb-3">
                    <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="registerConfirmPassword" placeholder="••••••••" required>
                  </div>

                  <button type="submit" class="btn btn-primary w-100">Create Account</button>
                </form>

                <div class="text-center mt-4">
                  <p class="text-muted mb-0">
                    Already have an account?
                    <a href="#" onclick="app.navigateTo('login'); return false;" class="text-decoration-none">Log in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderDashboard() {
    return `
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="container py-3">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <a class="navbar-brand" href="#" onclick="app.navigateTo('home'); return false;">
                  <img src="img/UNICEF_Logo.png" alt="" style="width: 120px; height: 50px;">
              </a>
            </div>
            <div class="d-flex align-items-center gap-3">
              <span>Welcome, ${this.currentUser.name}</span>
              <button class="btn btn-outline-secondary btn-sm" onclick="app.logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container py-5">
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 class="mb-2">My Learning Dashboard</h1>
              <p class="text-muted mb-2">Continue your health education journey</p>
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-primary-subtle text-primary px-3 py-2" style="font-family: 'Courier New', monospace; font-size: 0.875rem;">
                  <i class="bi bi-person-badge me-2"></i>User ID: ${
                    this.currentUser.id
                  }
                </span>
                ${
                  this.currentUser.registeredAt
                    ? `
                  <span class="badge bg-secondary-subtle text-secondary px-3 py-2" style="font-size: 0.875rem;">
                    <i class="bi bi-calendar-check me-2"></i>Joined: ${new Date(
                      this.currentUser.registeredAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Course Grid -->
        <div class="row g-4">
          ${coursesData
            .map((course, i) => {
              const progress = this.calculateProgress(course);
              const completed = this.isCourseCompleted(course.id);

              return `
              <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${(i%6)*100}">
                <div class="card h-100 shadow-sm hover-shadow hover-lift-sm transition-base">
                  <img src="${course.imageUrl}" class="card-img-top" alt="${
                course.title
              }" style="height: 200px; object-fit: cover;">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text text-muted flex-grow-1">${
                      course.description
                    }</p>
                    
                    ${
                      completed
                        ? `
                      <div class="alert alert-success py-2 mb-3">
                        <i class="bi bi-check-circle me-2"></i>Completed
                      </div>
                    `
                        : progress > 0
                        ? `
                      <div class="mb-3">
                        <div class="d-flex justify-content-between text-sm mb-2">
                          <span class="text-muted">Progress</span>
                          <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                          <div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                    `
                        : ""
                    }
                    
                    <div class="d-flex gap-2">
                      <button class="btn ${
                        completed ? "btn-outline-primary" : "btn-primary"
                      } flex-grow-1 hover-lift-sm focus-visible-ring transition-base" onclick="app.selectCourse('${course.id}')">
                        ${
                          progress === 0
                            ? "Start Course"
                            : completed
                            ? "Review"
                            : "Continue"
                        }
                      </button>
                      ${
                        completed
                          ? `
                        <button class="btn btn-outline-primary hover-lift-sm focus-visible-ring transition-base" onclick="app.viewCertificate('${course.id}')">
                          <i class="bi bi-award"></i>
                        </button>
                      `
                          : ""
                      }
                    </div>
                    
                    <div class="text-muted mt-3" style="font-size: 0.875rem;">
                      ${
                        course.lessons
                          ? course.lessons.length + " Lessons"
                          : course.lessions
                          ? course.lessions.length + " Lessions"
                          : "0 Lesson"
                      }
                    </div>
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  renderCourse() {
    const progress =
      this.getUserProgress(this.selectedCourse.id) ||
      this.initializeProgress(this.selectedCourse.id);
    const currentlession =
      this.selectedCourse.lessions[this.currentlessionIndex];
    const islessionCompleted = progress.completedlessions.includes(
      currentlession.id
    );
    const islessionUnlocked =
      this.currentlessionIndex === 0 ||
      progress.completedlessions.includes(
        this.selectedCourse.lessions[this.currentlessionIndex - 1]?.id
      );
    const overallProgress =
      (progress.completedlessions.length /
        this.selectedCourse.lessions.length) *
      100;

    if (this.showQuiz) {
      return this.renderQuiz();
    }

    return `
      <!-- Header -->
      <header class="bg-white shadow-sm sticky-top" data-aos="fade-down">
        <div class="container py-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <button class="btn btn-link text-decoration-none p-0" onclick="app.navigateTo('dashboard')">
              <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
            </button>
            <span class="text-muted">Lession ${
              this.currentlessionIndex + 1
            } of ${this.selectedCourse.lessions.length}</span>
          </div>
          <h2 class="mb-3">${this.selectedCourse.title}</h2>
          <div class="d-flex align-items-center gap-3">
            <div class="progress flex-grow-1" style="height: 10px;">
              <div class="progress-bar" role="progressbar" style="width: ${overallProgress}%" aria-valuenow="${overallProgress}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <span>${Math.round(overallProgress)}%</span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <!-- Lession Navigation -->
            <div class="card shadow-sm mb-4" data-aos="fade-up" data-aos-delay="100">
              <div class="card-body">
                <div class="d-flex flex-wrap gap-2">
                  ${this.selectedCourse.lessions
                    .map((lession, index) => {
                      const completed = progress.completedlessions.includes(
                        lession.id
                      );
                      const unlocked =
                        index === 0 ||
                        progress.completedlessions.includes(
                          this.selectedCourse.lessions[index - 1]?.id
                        );
                      const current = index === this.currentlessionIndex;

                      return `
                      <button 
                        class="btn ${
                          current
                            ? "btn-primary"
                            : completed
                            ? "btn-success"
                            : unlocked
                            ? "btn-outline-secondary"
                            : "btn-outline-secondary"
                        } hover-lift-sm focus-visible-ring transition-base"
                        ${!unlocked ? "disabled" : ""}
                        onclick="app.changelession(${index})"
                      >
                        ${
                          completed
                            ? '<i class="bi bi-check-circle me-1"></i>'
                            : ""
                        }
                        ${!unlocked ? '<i class="bi bi-lock me-1"></i>' : ""}
                        Lession ${index + 1}
                      </button>
                    `;
                    })
                    .join("")}
                </div>
              </div>
            </div>

            ${
              !islessionUnlocked
                ? `
              <!-- Locked Lession -->
              <div class="card shadow-sm text-center py-5">
                <div class="card-body">
                  <i class="bi bi-lock fs-1 text-muted mb-3"></i>
                  <h3>Lession Locked</h3>
                  <p class="text-muted">Complete the previous lession's quiz to unlock this lession.</p>
                </div>
              </div>
            `
                : `
              <!-- Lession Content -->
              <div class="card shadow-sm mb-4" data-aos="fade-up" data-aos-delay="150">
                <div class="card-body p-4">
                  <div class="position-relative">
                    ${
                      currentlession.audioFile
                        ? `
                    <div class="position-absolute top-0 end-0 m-2" style="z-index: 5;">
                      <button class="btn btn-primary hover-lift-sm focus-visible-ring transition-base" id="audioToggleBtn" onclick="app.toggleAudio()" style="min-width: 120px;">
                        <i class="bi bi-pause-fill" id="audioIcon"></i>
                        <span id="audioText">Pause</span>
                      </button>
                    </div>
                    `
                        : ""
                    }
                    <div class="lession-content">
                      ${currentlession.content
                        .map((item, index) => {
                          if (item.type === "text") {
                            return `<div class=\"mb-4\" data-aos=\"fade-up\" data-aos-delay=\"${index * 50}\">${item.data}</div>`;
                          }
                          if (item.type === "image") {
                            return `<div class=\"mb-4\" data-aos=\"zoom-in\" data-aos-delay=\"${index * 50}\"><img src=\"${item.data}\" class=\"img-fluid rounded\" alt=\"Lession content\"></div>`;
                          }
                          if (item.type === "video") {
                            return `<div class=\"ratio ratio-16x9 mb-4\" data-aos=\"fade-up\" data-aos-delay=\"${index * 50}\"><iframe src=\"${item.data}\" allowfullscreen></iframe></div>`;
                          }
                          return "";
                        })
                        .join("")}
                    </div>
                  </div>
                  ${
                    currentlession.audioFile
                      ? `
                  <audio id="lessonAudio" autoplay controls style="width:100%; margin-top: 1rem;">
                    <source src="${this.getAudioSource(
                      currentlession.audioFile
                    )}" type="${this.getAudioMimeType(
                          currentlession.audioFile
                        )}">
                    Your browser does not support the audio element.
                  </audio>
                  `
                      : ""
                  }
                </div>
              </div>

              <!-- Quiz Section -->
              <div class="card shadow-sm mb-4" data-aos="fade-up" data-aos-delay="200">
                <div class="card-body">
                  <h4 class="mb-3">${
                    islessionCompleted
                      ? "Quiz Completed"
                      : "Ready for the Quiz?"
                  }</h4>
                  
                  ${
                    islessionCompleted
                      ? `
                    <div class="alert alert-success mb-3">
                      <div class="d-flex align-items-center gap-3">
                        <i class="bi bi-check-circle fs-3"></i>
                        <div>
                          <p class="mb-1 fw-medium">You scored ${
                            progress.quizScores[currentlession.id]
                          }%</p>
                          <p class="mb-0 text-sm">You can retake the quiz to improve your score</p>
                        </div>
                      </div>
                    </div>
                  `
                      : ""
                  }
                  
                  <p class="text-muted mb-3">
                    Test your knowledge with a quiz. You need to score at least ${
                      currentlession.quiz.passingScore
                    }% to proceed to the next lession.
                  </p>
                  
                  <button class="btn btn-primary mt-3 hover-lift-sm focus-visible-ring transition-base" onclick="app.startQuiz()">
                    ${islessionCompleted ? "Retake Quiz" : "Start Quiz"}
                  </button>
                </div>
              </div>

              <!-- Certificate Section -->
              ${
                progress.certificateIssued
                  ? `
                <div class="card shadow-sm border-primary">
                  <div class="card-body">
                    <div class="d-flex align-items-center gap-3">
                      <i class="bi bi-award fs-1 text-primary"></i>
                      <div class="flex-grow-1">
                        <h4 class="mb-1">Congratulations!</h4>
                        <p class="text-muted mb-0">You've completed all lessions in this course and earned your certificate!</p>
                      </div>
                      <button class="btn btn-outline-primary hover-lift-sm focus-visible-ring transition-base" onclick="app.navigateTo('dashboard')">
                        View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              `
                  : ""
              }
            `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderQuiz() {
    const items = this.selectedCourse.lessons || this.selectedCourse.lessions;
    const idx = this.selectedCourse.lessons
      ? this.currentLessonIndex || 0
      : this.currentlessionIndex;
    const currentItem = items[idx];
    const { questions, passingScore } = currentItem.quiz;

    if (this.quizState.showResults) {
      const passed = this.quizState.score >= passingScore;

      return `
        <!-- Header -->
        <header class="quiz-header">
          <div class="container">
            <h2>${this.selectedCourse.title} - ${currentItem.title}</h2>
          </div>
        </header>

        <!-- Quiz Results -->
        <div class="container py-5">
          <div class="row justify-content-center">
            <div class="col-lg-9">
              <div class="quiz-result-card">
                <div class="text-center mb-5">
                  <div class="quiz-result-badge ${passed ? "success" : "fail"}">
                    <i class="bi ${
                      passed ? "bi-trophy-fill" : "bi-arrow-repeat"
                    }"></i>
                  </div>
                  <h2 class="quiz-result-title">${
                    passed ? "🎉 Congratulations!" : "💪 Keep Trying!"
                  }</h2>
                  <div class="quiz-result-score ${passed ? "pass" : "fail"}">
                    ${Math.round(this.quizState.score)}%
                  </div>
                  <p style="font-size: 1.25rem; color: #4a5568; font-weight: 600; margin-bottom: 1rem;">
                    ${Math.round(
                      (this.quizState.score / 100) * questions.length
                    )} out of ${questions.length} questions correct
                  </p>
                  <div class="alert ${
                    passed ? "alert-success" : "alert-warning"
                  }" style="border-radius: 12px; border: 2px solid ${
        passed ? "#48bb78" : "#f59e0b"
      }; font-size: 1.1rem; font-weight: 600;">
                    <i class="bi ${
                      passed ? "bi-check-circle-fill" : "bi-info-circle-fill"
                    } me-2"></i>
                    ${
                      passed
                        ? "You've passed the quiz and can proceed to the next lession!"
                        : `You need ${passingScore}% to pass. Review the material and try again.`
                    }
                  </div>
                </div>

                  <!-- Answer Review -->
                  <div class="mb-4">
                    <h4 class="mb-4" style="font-size: 1.75rem; font-weight: 700; color: #1a202c;">
                      <i class="bi bi-list-check me-2" style="color: #667eea;"></i>Review Your Answers
                    </h4>
                    ${questions
                      .map((question, qIndex) => {
                        const userAnswer =
                          this.quizState.selectedAnswers[qIndex];
                        const isCorrect = userAnswer === question.correctAnswer;

                        return `
                        <div class="card mb-3" style="border: 3px solid ${
                          isCorrect ? "#48bb78" : "#f56565"
                        }; border-radius: 16px; overflow: hidden;">
                          <div class="card-body p-4" style="background: ${
                            isCorrect
                              ? "linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%)"
                              : "linear-gradient(135deg, #fff5f5 0%, #ffe4e6 100%)"
                          };">
                            <div class="d-flex gap-3 mb-3 align-items-start">
                              <div style="width: 48px; height: 48px; border-radius: 50%; background: ${
                                isCorrect
                                  ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                                  : "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)"
                              }; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                                <i class="bi ${
                                  isCorrect ? "bi-check-lg" : "bi-x-lg"
                                } fs-4"></i>
                              </div>
                              <p class="mb-0" style="font-size: 1.125rem; font-weight: 600; color: #1a202c; line-height: 1.5;">
                                ${qIndex + 1}. ${question.question}
                              </p>
                            </div>
                            <div class="ms-5 ps-3">
                              <p class="mb-2" style="font-size: 1rem; font-weight: 600;">
                                <i class="bi bi-person-fill me-2" style="color: ${
                                  isCorrect ? "#48bb78" : "#f56565"
                                };"></i>
                                <strong>Your answer:</strong> 
                                <span style="color: ${
                                  isCorrect ? "#38a169" : "#e53e3e"
                                }; font-weight: 700;">${
                          question.options[userAnswer]
                        }</span>
                              </p>
                              ${
                                !isCorrect
                                  ? `
                                <p class="mb-0" style="font-size: 1rem; font-weight: 600;">
                                  <i class="bi bi-check-circle-fill me-2" style="color: #48bb78;"></i>
                                  <strong>Correct answer:</strong> <span style="color: #38a169; font-weight: 700;">${
                                    question.options[question.correctAnswer]
                                  }</span>
                                </p>
                              `
                                  : ""
                              }
                            </div>
                          </div>
                        </div>
                      `;
                      })
                      .join("")}
                  </div>

                  <div class="d-flex gap-3 justify-content-center mt-5">
                    ${
                      passed
                        ? `
                      <button class="quiz-nav-button btn btn-primary btn-lg" onclick="app.finishQuiz()">
                        <i class="bi bi-arrow-right-circle me-2"></i>Continue to Next Lession
                      </button>
                    `
                        : `
                      <button class="quiz-nav-button btn btn-outline-secondary btn-lg" onclick="app.showQuiz = false; app.render()">
                        <i class="bi bi-book me-2"></i>Review Material
                      </button>
                      <button class="quiz-nav-button btn btn-primary btn-lg" onclick="app.retryQuiz()">
                        <i class="bi bi-arrow-repeat me-2"></i>Try Again
                      </button>
                    `
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const currentQuestion = questions[this.quizState.currentQuestionIndex];
    const isLastQuestion =
      this.quizState.currentQuestionIndex === questions.length - 1;
    const progressPercent =
      ((this.quizState.currentQuestionIndex + 1) / questions.length) * 100;

    return `
      <!-- Header -->
      <header class="quiz-header">
        <div class="container">
          <h2>${this.selectedCourse.title} - Quiz</h2>
        </div>
      </header>

      <!-- Quiz Content -->
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-9">
            <div class="card shadow-lg border-0" style="border-radius: 20px;">
              <div class="card-body p-5">
                <!-- Progress -->
                <div class="quiz-progress-container">
                  <div class="d-flex justify-content-between quiz-progress-label mb-3">
                    <span><i class="bi bi-journal-text me-2"></i>Question ${
                      this.quizState.currentQuestionIndex + 1
                    } of ${questions.length}</span>
                    <span><i class="bi bi-trophy me-2"></i>Passing Score: ${passingScore}%</span>
                  </div>
                  <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" style="width: ${progressPercent}%"></div>
                  </div>
                </div>

                <!-- Question -->
                <div class="quiz-question">
                  <i class="bi bi-patch-question me-2" style="color: #667eea;"></i>${
                    currentQuestion.question
                  }
                </div>

                <!-- Options -->
                <div class="d-grid gap-3 mb-4">
                  ${currentQuestion.options
                    .map((option, index) => {
                      const isSelected =
                        this.quizState.selectedAnswers[
                          this.quizState.currentQuestionIndex
                        ] === index;

                      return `
                      <button 
                        class="quiz-option-button ${isSelected ? "active" : ""}"
                        onclick="app.selectAnswer(${index})"
                      >
                        <div class="d-flex align-items-center gap-3">
                          <div class="form-check">
                            <input class="form-check-input" type="radio" ${
                              isSelected ? "checked" : ""
                            } onclick="event.preventDefault()">
                          </div>
                          <span class="quiz-option-text">${option}</span>
                        </div>
                      </button>
                    `;
                    })
                    .join("")}
                </div>

                <!-- Warning if no answer selected -->
                ${
                  this.quizState.selectedAnswers[
                    this.quizState.currentQuestionIndex
                  ] === undefined
                    ? `
                  <div class="alert alert-warning d-flex align-items-center" style="border-radius: 12px; border-left: 4px solid #f59e0b;">
                    <i class="bi bi-exclamation-triangle fs-4 me-3"></i>
                    <span style="font-weight: 500;">Please select an answer to continue</span>
                  </div>
                `
                    : ""
                }

                <!-- Navigation -->
                <div class="d-flex justify-content-between mt-4">
                  <button 
                    class="quiz-nav-button btn btn-outline-secondary" 
                    onclick="${
                      this.quizState.currentQuestionIndex === 0
                        ? "app.showQuiz = false; app.render()"
                        : "app.previousQuestion()"
                    }"
                  >
                    <i class="bi bi-arrow-left me-2"></i>${
                      this.quizState.currentQuestionIndex === 0
                        ? "Cancel"
                        : "Previous"
                    }
                  </button>
                  <button 
                    class="quiz-nav-button btn btn-primary" 
                    ${
                      this.quizState.selectedAnswers[
                        this.quizState.currentQuestionIndex
                      ] === undefined
                        ? "disabled"
                        : ""
                    }
                    onclick="app.nextQuestion()"
                  >
                    ${
                      isLastQuestion
                        ? '<i class="bi bi-check-circle me-2"></i>Submit Quiz'
                        : 'Next Question<i class="bi bi-arrow-right ms-2"></i>'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderLessonSlider() {
    const course = this.selectedCourse;
    const currentLesson = course.lessons[this.currentLessonIndex || 0];
    if (this.showQuiz) {
      return this.renderQuiz();
    }

    return `
      <!-- Lesson Slider Container -->
      <div class="lesson-slider-container">
        <!-- Topbar -->
        <div class="lesson-topbar" data-aos="fade-down">
          <div class="container-fluid">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <button class="btn btn-link text-white text-decoration-none p-0" onclick="app.navigateTo('dashboard')">
                <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
              </button>
              <span class="badge bg-white text-primary px-3 py-2">Lesson ${
                (this.currentLessonIndex || 0) + 1
              } of ${course.lessons.length}</span>
            </div>
            <h2>${currentLesson.title}</h2>
            <div class="lesson-course-info">
              <div class="info-item">
                <i class="fas fa-book"></i>
                <span>${course.title}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-clock"></i>
                <span>${course.duration}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-signal"></i>
                <span>${course.level}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="container-fluid">
          <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3" data-aos="fade-right" data-aos-delay="50">
              <div class="lesson-sidebar">
                ${course.lessons
                  .map(
                    (lesson, index) => `
                  <div class="lesson-sidebar-item ${
                    index === (this.currentLessonIndex || 0) ? "active" : ""
                  }" onclick="app.changeLesson(${index})">
                    <div class="lesson-icon ${lesson.gradientClass}">
                      <i class="fas ${lesson.icon}"></i>
                    </div>
                    <div class="lesson-title">${lesson.title}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Main Content -->
            <div class="col-md-9" data-aos="fade-left" data-aos-delay="100">
              <div class="lesson-main-content">
                ${
                  currentLesson.audioFile
                    ? `
                <div class="d-flex justify-content-end" style="top: 0; z-index: 5; padding-top: .25rem; padding-bottom: 1.25rem;">
                  <button class="btn btn-primary hover-lift-sm focus-visible-ring transition-base" id="audioToggleBtn" onclick="app.toggleAudio()" style="min-width: 120px;">
                    <i class="bi bi-pause-fill" id="audioIcon"></i>
                    <span id="audioText">Pause</span>
                  </button>
                </div>
                <audio id="lessonAudio" autoplay controls style="width:100%; margin-bottom: 1rem; display: none;">
                  <source src="${this.getAudioSource(
                    currentLesson.audioFile
                  )}" type="${this.getAudioMimeType(currentLesson.audioFile)}">
                  Your browser does not support the audio element.
                </audio>
                `
                    : ""
                }
                ${currentLesson.content}

                <!-- Quiz Card for Lesson -->
                <div class="card shadow-sm mb-4">
                  <div class="card-body">
                    <h4 class="mb-3">${
                      this.getUserProgress(
                        course.id
                      )?.completedlessions?.includes(currentLesson.id)
                        ? "Quiz Completed"
                        : "Ready for the Quiz?"
                    }</h4>
                    ${
                      this.getUserProgress(course.id)?.quizScores?.[
                        currentLesson.id
                      ] !== undefined
                        ? `
                      <div class="alert alert-success mb-3">
                        <div class="d-flex align-items-center gap-3">
                          <i class="bi bi-check-circle fs-3"></i>
                          <div>
                            <p class="mb-1 fw-medium">You scored ${
                              this.getUserProgress(course.id).quizScores[
                                currentLesson.id
                              ]
                            }%</p>
                            <p class="mb-0 text-sm">You can retake the quiz to improve your score</p>
                          </div>
                        </div>
                      </div>
                    `
                        : ""
                    }
                    <p class="text-muted mb-3">
                      Test your knowledge with a quiz. You need to score at least ${
                        currentLesson.quiz.passingScore
                      }% to proceed.
                    </p>
                    <button class="btn btn-primary hover-lift-sm focus-visible-ring transition-base" onclick="app.startQuiz()">${
                      this.getUserProgress(
                        course.id
                      )?.completedlessions?.includes(currentLesson.id)
                        ? "Retake Quiz"
                        : "Start Quiz"
                    }</button>
                  </div>
                </div>

                

                <!-- Navigation -->
                <div class="lesson-navigation">
                  ${
                    (this.currentLessonIndex || 0) > 0
                      ? `
                    <button class="btn btn-outline-primary lesson-nav-btn hover-lift-sm focus-visible-ring transition-base" onclick="app.previousLesson()">
                      <i class="fas fa-arrow-left me-2"></i>Previous Lesson
                    </button>
                  `
                      : "<div></div>"
                  }
                  
                  ${
                    (this.currentLessonIndex || 0) < course.lessons.length - 1
                      ? `
                    <button class="btn btn-primary lesson-nav-btn hover-lift-sm focus-visible-ring transition-base" onclick="app.nextLesson()">
                      Next Lesson<i class="fas fa-arrow-right ms-2"></i>
                    </button>
                  `
                      : `
                    <button class="btn btn-success lesson-nav-btn hover-lift-sm focus-visible-ring transition-base" onclick="app.completeLesson()">
                      <i class="fas fa-check-circle me-2"></i>Complete Course
                    </button>
                  `
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  changeLesson(index) {
    this.currentLessonIndex = index;
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  nextLesson() {
    if (this.currentLessonIndex < this.selectedCourse.lessons.length - 1) {
      this.currentLessonIndex++;
      this.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  previousLesson() {
    if (this.currentLessonIndex > 0) {
      this.currentLessonIndex--;
      this.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  completeLesson() {
    // Mark all lessons as completed
    const progress =
      this.getUserProgress(this.selectedCourse.id) ||
      this.initializeProgress(this.selectedCourse.id);

    this.selectedCourse.lessons.forEach((lesson) => {
      if (!progress.completedlessions.includes(lesson.id)) {
        progress.completedlessions.push(lesson.id);
      }
    });

    progress.certificateIssued = true;
    const key = `progress-${this.currentUser.id}-${this.selectedCourse.id}`;
    localStorage.setItem(key, JSON.stringify(progress));

    // Show success message and redirect to certificate
    alert("🎉 Congratulations! You have completed all lessons!");
    this.viewCertificate(this.selectedCourse.id);
  }

  renderCertificate() {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const certificateId = `YHL-${this.currentUser.id
      .slice(-6)
      .toUpperCase()}-${this.selectedCourse.id.slice(-4).toUpperCase()}`;

    return `
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="container py-3">
          <button class="btn btn-link text-decoration-none p-0" onclick="app.navigateTo('dashboard')">
            <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="certificate-container mb-5">
              <div class="certificate bg-white rounded shadow-lg p-5 position-relative">
                <!-- Decorative Corners -->
                <div class="certificate-corner certificate-corner-tl"></div>
                <div class="certificate-corner certificate-corner-tr"></div>
                <div class="certificate-corner certificate-corner-bl"></div>
                <div class="certificate-corner certificate-corner-br"></div>

                <div class="text-center position-relative" style="z-index: 10;">
                  <p class="text-primary text-uppercase mb-4" style="letter-spacing: 0.3em; font-size: 0.875rem;">
                    CERTIFICATE OF COMPLETION
                  </p>
                  
                  <h2 class="mb-5">Youth Health LMS</h2>
                  
                  <p class="text-muted mb-3">This certifies that</p>
                  
                  <h1 class="text-primary mb-5" style="font-size: 2.5rem;">${
                    this.currentUser.name
                  }</h1>
                  
                  <p class="text-muted mb-3">has successfully completed the course</p>
                  
                  <h2 class="mb-5">${this.selectedCourse.title}</h2>
                  
                  <p class="text-muted mb-5">
                    Demonstrating proficiency in all course modules and assessments
                  </p>
                  
                  <div class="row justify-content-center mb-5">
                    <div class="col-md-5 mb-3 mb-md-0">
                      <div class="border-top border-2 border-dark pt-2">
                        <p class="text-muted mb-1" style="font-size: 0.875rem;">Date of Completion</p>
                        <p class="mb-0">${currentDate}</p>
                      </div>
                    </div>
                    
                    <div class="col-md-5">
                      <div class="border-top border-2 border-dark pt-2">
                        <p class="text-muted mb-1" style="font-size: 0.875rem;">Certificate ID</p>
                        <p class="mb-0" style="font-family: monospace;">${certificateId}</p>
                      </div>
                    </div>
                  </div>

                  <i class="bi bi-award display-3 text-primary"></i>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="text-center mb-5">
              <button class="btn btn-primary btn-lg me-3" onclick="alert('In a production app, this would download a PDF certificate')">
                <i class="bi bi-download me-2"></i>Download Certificate
              </button>
              <button class="btn btn-outline-primary btn-lg" onclick="app.navigateTo('dashboard')">
                Back to Courses
              </button>
            </div>

            <!-- Course Summary -->
            <div class="card shadow-sm">
              <div class="card-body">
                <h4 class="mb-4">Course Summary</h4>
                <div class="row g-4">
                  <div class="col-md-6">
                    <p class="text-muted mb-1 small">Course Title</p>
                    <p class="mb-0">${this.selectedCourse.title}</p>
                  </div>
                  <div class="col-md-6">
                    <p class="text-muted mb-1 small">Modules Completed</p>
                    <p class="mb-0">${
                      this.selectedCourse.lessons
                        ? this.selectedCourse.lessons.length + ' lessons'
                        : this.selectedCourse.lessions
                        ? this.selectedCourse.lessions.length + ' lessions'
                        : '0 lessons'
                    }</p>
                  </div>
                  <div class="col-md-6">
                    <p class="text-muted mb-1 small">Learner Name</p>
                    <p class="mb-0">${this.currentUser.name}</p>
                  </div>
                  <div class="col-md-6">
                    <p class="text-muted mb-1 small">Completion Date</p>
                    <p class="mb-0">${currentDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Event handlers
  attachLoginHandlers() {
    const form = document.getElementById("loginForm");
    const errorDiv = document.getElementById("loginError");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const result = this.login(email, password);

      if (!result.success) {
        errorDiv.textContent = result.error;
        errorDiv.classList.remove("d-none");
      }
    });
  }

  attachRegisterHandlers() {
    const form = document.getElementById("registerForm");
    const errorDiv = document.getElementById("registerError");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById(
        "registerConfirmPassword"
      ).value;

      const result = this.register(name, email, password, confirmPassword);

      if (!result.success) {
        errorDiv.textContent = result.error;
        errorDiv.classList.remove("d-none");
      }
    });
  }

  // Resolve audio file path relative to app root
  getAudioSource(file) {
    if (!file) return "";
    try {
      if (/^https?:\/\//i.test(file) || file.startsWith("/")) return file;
      return file.includes("/") ? file : `audio/${file}`;
    } catch (_) {
      return file;
    }
  }

  // Determine correct MIME type based on extension
  getAudioMimeType(file) {
    if (!file) return "audio/mpeg";
    const ext = (file.split(".").pop() || "").toLowerCase();
    switch (ext) {
      case "mp3":
        return "audio/mpeg";
      case "m4a":
        return "audio/mp4";
      case "wav":
        return "audio/wav";
      case "ogg":
        return "audio/ogg";
      default:
        return "audio/mpeg";
    }
  }

  // Initialize audio state in lesson slider, attempt autoplay gracefully
  initLessonAudio() {
    const audio = document.getElementById("lessonAudio");
    const icon = document.getElementById("audioIcon");
    const text = document.getElementById("audioText");
    const button = document.getElementById("audioToggleBtn");
    if (!audio) return;

    // If autoplay is present, try to play; update UI based on result
    if (audio.hasAttribute("autoplay")) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            if (icon) icon.className = "bi bi-pause-fill";
            if (text) text.textContent = "Pause";
            if (button) {
              button.classList.remove("btn-outline-primary");
              button.classList.add("btn-primary");
            }
          })
          .catch(() => {
            if (icon) icon.className = "bi bi-play-fill";
            if (text) text.textContent = "Play";
            if (button) {
              button.classList.remove("btn-primary");
              button.classList.add("btn-outline-primary");
            }
          });
      }
    } else {
      if (icon) icon.className = "bi bi-play-fill";
      if (text) text.textContent = "Play";
      if (button) {
        button.classList.remove("btn-primary");
        button.classList.add("btn-outline-primary");
      }
    }
  }

  toggleAudio() {
    const audio = document.getElementById("lessonAudio");
    const icon = document.getElementById("audioIcon");
    const text = document.getElementById("audioText");
    const button = document.getElementById("audioToggleBtn");

    if (audio) {
      if (audio.paused) {
        const p = audio.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            if (icon) icon.className = "bi bi-pause-fill";
            if (text) text.textContent = "Pause";
            if (button) {
              button.classList.remove("btn-outline-primary");
              button.classList.add("btn-primary");
            }
          }).catch(() => {
            if (icon) icon.className = "bi bi-play-fill";
            if (text) text.textContent = "Play";
            if (button) {
              button.classList.remove("btn-primary");
              button.classList.add("btn-outline-primary");
            }
          });
        } else {
          if (icon) icon.className = "bi bi-pause-fill";
          if (text) text.textContent = "Pause";
          if (button) {
            button.classList.remove("btn-outline-primary");
            button.classList.add("btn-primary");
          }
        }
      } else {
        audio.pause();
        if (icon) icon.className = "bi bi-play-fill";
        if (text) text.textContent = "Play";
        if (button) {
          button.classList.remove("btn-primary");
          button.classList.add("btn-outline-primary");
        }
      }
    }
  }
}

// Initialize the app
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new YouthHealthLMS();
});
