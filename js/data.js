// Youth Health LMS - Course Data

const coursesData = [
  {
    id: 'yhap-course',
    title: 'Youth Health Ambassador Programme',
    description: 'Comprehensive training program for Youth Health Ambassadors covering health literacy, advocacy, and community leadership.',
    duration: '10 Lessons',
    level: 'Comprehensive',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    enrolled: 0,
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to YHAP',
        icon: 'fa-heartbeat',
        gradientClass: 'bg-gradient-purple',
        audioFile: '1.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q1',
              question: '১. বিশ্বস্বাস্থ্য সংস্থার মতে বয়ঃসন্ধি কাল কোনটি?',
              options: [
                'ক) ১০ থেকে ১৯ বছর',
                'খ) ১১ থেকে ১৯ বছর',
                'গ) ০৯ থেকে ১৯ বছর',
                'ঘ) ০৯ থেকে ১৯ বছর'
              ],
              correctAnswer: 0
            },
            {
              id: 'q2',
              question: '২. বয়ঃসন্ধিকাল কেন বিপদজনক?',
              options: [
                'ক. বাস্তবতা থেকে অভিজ্ঞতা কম থাকে',
                'খ. অন্যের পরোচনায় বিপদগামী হয়',
                'গ. বুদ্ধির চেয়ে আবেগ বেশি কাজ করে',
                'ঘ. যৌন আচরণের ফলাফল সম্পর্কে ধারণা কম',
                'ঙ. উপরের সবকটি'
              ],
              correctAnswer: 4
            },
            {
              id: 'q3',
              question: '৩. খাদ্য দেহে কি কাজ করে',
              options: [
                'ক. বৃদ্ধি রোধ করে',
                'খ. ক্ষয়পূরণ',
                'গ. শক্তি দেয়',
                'ঘ. উপরের সবগুলো কাজ করে'
              ],
              correctAnswer: 3
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Youth Health Ambassador Program (YHAP)</h2>
            
            <div class="definition-card">
              <h4><i class="fas fa-users me-2"></i>Youth</h4>
              <p>As per United Nations, youth refers to those persons aged between the ages of <strong>15 and 24</strong> without prejudice to other definitions by Member States. It is a period of transition from the dependence of childhood to adulthood's independence. Young People covers the age range 10-24 years and Adolescents as individuals in the 10-19 years age group.</p>
            </div>

            <div class="definition-card">
              <h4><i class="fas fa-heartbeat me-2"></i>Health</h4>
              <p>As per World Health Organization (WHO), health is defined as a state of complete <strong>physical, mental, and social well-being</strong>, and not merely the absence of disease or infirmity.</p>
            </div>

            <div class="program-intro">
              <h4>About YHAP</h4>
              <p>The Youth Health Ambassador Programme (YHAP) is a strategic joint initiative of the Ministry of Health and Family Welfare (MOHFW) and UNICEF. The programme is designed to empower youth by enhancing their health awareness and building their capacity in primary prevention and health promotion thereby equipping them to serve as informed health ambassador.</p>
              
              <p>These programs equip youth with knowledge and skills in areas like physical health including SRH and mental wellbeing, enabling them to become active advocates for health and influence healthier choices within their communities and networks.</p>
            </div>
          </div>
        `
      },
      {
        id: 'lesson-2',
        title: 'Core Components',
        icon: 'fa-layer-group',
        gradientClass: 'bg-gradient-blue',
        audioFile: '2.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q4',
              question: '৪. বাল্য বিবাহের ফলে',
              options: [
                'ক. অল্পবয়সে গর্ভধারণ ঝুঁকিপূর্ণ হয়',
                'খ. মাতৃ-মৃত্যুরহার বৃদ্ধি পায়',
                'গ. অল্পবয়সি মেয়েদের অপুষ্টি ও রক্ত স্বল্পতার প্রকোপ বাড়ে',
                'ঘ. উপরের সব কটি'
              ],
              correctAnswer: 3
            },
            {
              id: 'q5',
              question: '৫. বাংলাদেশের মোট জনগোষ্ঠির কত জন কিশোর-কিশোরী?',
              options: [
                'ক. ৩৬ মিলিয়ন',
                'খ. ৩৭ মিলিয়ন',
                'গ. ৩২ মিলিয়ন',
                'ঘ. ৩৪ মিলিয়ন'
              ],
              correctAnswer: 3
            },
            {
              id: 'q6',
              question: '৬. জেন্ডার হলো',
              options: [
                'ক. সমাজ কর্তৃক সৃষ্ট',
                'খ. স্রষ্টা কর্তৃক সৃষ্ট',
                'গ. উপরের দুটিই',
                'ঘ. উপরের কোনটিই নয়'
              ],
              correctAnswer: 0
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Core Components of YHAP</h2>
            
            <div class="row g-4">
              <div class="col-md-6">
                <div class="component-card">
                  <div class="component-icon bg-gradient-purple">
                    <i class="fas fa-book-medical"></i>
                  </div>
                  <h5>Health Literacy</h5>
                  <p>YHAP builds foundational health literacy through comprehensive training on essential health and wellbeing. This equips ambassadors with the expertise to act as credible sources of information and effective advocates for prevention and promotion.</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="component-card">
                  <div class="component-icon bg-gradient-blue">
                    <i class="fas fa-graduation-cap"></i>
                  </div>
                  <h5>Health Education & Awareness</h5>
                  <p>Youth Health Ambassadors (YHAs) will create health education and awareness through campaigns on key health issues, comprehensive trainings, mentorships etc., ensuring accurate dissemination of crucial health information.</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="component-card">
                  <div class="component-icon bg-gradient-teal">
                    <i class="fas fa-users"></i>
                  </div>
                  <h5>Peer to Peer Influence</h5>
                  <p>The programme is built on the principle that peer-to-peer engagement is a powerful catalyst for change. By facilitating supportive mentorship and encouraging positive role-modeling among contemporaries.</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="component-card">
                  <div class="component-icon bg-gradient-orange">
                    <i class="fas fa-hand-fist"></i>
                  </div>
                  <h5>Empowerment</h5>
                  <p>YHAP empowers individuals by equipping them with the tools, confidence, and skills needed to take effective control and contribute to the economic development, creating a productive, resilient, and healthy workforce.</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="component-card">
                  <div class="component-icon bg-gradient-green">
                    <i class="fas fa-flag"></i>
                  </div>
                  <h5>Leadership</h5>
                  <p>The program cultivates leadership qualities in youth, preparing them to become effective, ethical, and inspiring agents of change in their communities.</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="component-card">
                  <div class="component-icon bg-gradient-pink">
                    <i class="fas fa-bullhorn"></i>
                  </div>
                  <h5>Advocacy</h5>
                  <p>YHAP builds foundational competencies in health advocacy, empowering youth to effectively raise voice, articulate public health priorities to drive systemic reform.</p>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'lesson-3',
        title: 'Roles & Responsibilities',
        icon: 'fa-user-shield',
        gradientClass: 'bg-gradient-teal',
        audioFile: '3.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q7',
              question: '৭. জীবন দক্ষতা হলো',
              options: [
                'ক. প্রতিকুল পরিস্থিতি দক্ষতার সাথে মোকাবেলা করা',
                'খ. তাড়াতাড়ি করে কিছুনা করা',
                'গ. কিছু করতে না পারা',
                'ঘ. কোনটিই নয়'
              ],
              correctAnswer: 0
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Roles and Responsibilities of Health Ambassador</h2>
            <h3 class="text-center mb-4 gradient-text">Who am I?</h3>
            
            <div class="row g-4">
              <div class="col-md-6">
                <div class="role-card">
                  <div class="role-icon">
                    <i class="fas fa-shield-heart"></i>
                  </div>
                  <p>I am equipped with expertise in safeguarding adolescent and youth health and well-being, enabling me to contribute meaningfully to society while harnessing the triple dividend of health, social, and economic benefits</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="role-card">
                  <div class="role-icon">
                    <i class="fas fa-share-nodes"></i>
                  </div>
                  <p>I actively empower my peers by sharing knowledge on health promotion, disease prevention, and holistic well-being, fostering informed decision-making among adolescents and youth</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="role-card">
                  <div class="role-icon">
                    <i class="fas fa-handshake"></i>
                  </div>
                  <p>Through advocacy, I engage policy makers, stakeholders and community influencer, gatekeepers to prioritize adolescent health, ensuring supportive policies and collaborative action for sustainable well-being</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="role-card">
                  <div class="role-icon">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <p>I drive awareness and demand creation within communities, inspiring collective responsibility and action toward better health outcomes for adolescents and youth</p>
                </div>
              </div>
            </div>

            <div class="text-center mt-4">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80" alt="Youth Health Ambassador" class="img-fluid rounded-4 shadow-lg" style="max-height: 300px; object-fit: cover;">
            </div>
          </div>
        `
      },
      {
        id: 'lesson-4',
        title: 'Eligibility & Steps',
        icon: 'fa-clipboard-check',
        gradientClass: 'bg-gradient-orange',
        audioFile: '4.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q8',
              question: '৮. একটি পদ্ধতির নাম লিখ যা জন্ম নিয়ন্ত্রণ করে এবং যৌনবাহিত রোগসমূহ প্রতিরোধ করে',
              options: [
                'ক. খাবার বড়ি',
                'খ. ইনজেকশন',
                'গ. আই ইউ ডি',
                'ঘ. কনডম'
              ],
              correctAnswer: 3
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Eligibility and Steps to be a YHA</h2>
            
            <div class="alert alert-info mb-4">
              <h5><i class="fas fa-info-circle me-2"></i>Eligibility Criteria</h5>
              <p class="mb-0">Any person between <strong>15-24 years of age</strong> is eligible to be a Youth Health Ambassador.</p>
            </div>

            <h4 class="mb-4">Steps to Become a Youth Health Ambassador</h4>

            <div class="row g-3">
              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">1</div>
                  <h6>Online Registration</h6>
                  <p>Register in Health Ambassador Programme platform</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">2</div>
                  <h6>Unique ID Generation</h6>
                  <p>Receive your unique identification number</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">3</div>
                  <h6>Login to Platform</h6>
                  <p>Access the Website/App with credentials</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">4</div>
                  <h6>Access Course</h6>
                  <p>Access Health Ambassador course content</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">5</div>
                  <h6>Complete Course</h6>
                  <p>Complete online Health Ambassador modules</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">6</div>
                  <h6>Pass Assessment</h6>
                  <p>Obtain passing marks in final assessment</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">7</div>
                  <h6>System Certification</h6>
                  <p>Receive system-generated certification</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">8</div>
                  <h6>Oath Taking</h6>
                  <p>Complete self-declaration ceremony</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="step-card">
                  <div class="step-number">9</div>
                  <h6>Final Certificate</h6>
                  <p>Receive Final Certificate (Valid 2 years)</p>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'lesson-5',
        title: 'Global Distribution',
        icon: 'fa-earth-americas',
        gradientClass: 'bg-gradient-green',
        audioFile: '5.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q9',
              question: '৯. এইড্স সংক্রামণের ফলে একজন ব্যক্তির -',
              options: [
                'ক. রোগপ্রতিরোধ ক্ষমতা ধীরে ধীরে লোপ পায়',
                'খ. সাথে সাথে এইড্স বিভিন্ন লক্ষণ দেখা দেয়',
                'গ. শরীরের ওজন সাথে সাথে হ্রাস পায়',
                'ঘ. রোগ প্রতিরোধ ক্ষমতা তাৎক্ষনিকভাবে লোপপায়'
              ],
              correctAnswer: 0
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Distribution of Young People</h2>
            
            <div class="stat-highlight mb-4">
              <h3>Global Youth Population</h3>
              <p class="lead">There are over <strong class="text-primary">1.8 billion youth</strong> in the world today, <strong>90%</strong> of whom live in developing countries, where they tend to make up a large proportion of the population.</p>
            </div>

            <div class="row g-4 mb-4">
              <div class="col-md-6">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-users-between-lines"></i>
                  </div>
                  <h4>49.5 Million</h4>
                  <p>Total Young Population in Bangladesh</p>
                  <span class="badge bg-primary">~30% of total population</span>
                </div>
              </div>

              <div class="col-md-6">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-user-group"></i>
                  </div>
                  <h4>31.5 Million</h4>
                  <p>Youth Population (15-24 years)</p>
                  <span class="badge bg-success">in Bangladesh</span>
                </div>
              </div>
            </div>

            <div class="info-box">
              <i class="fas fa-globe me-2"></i>
              <p class="mb-0">Young people represent a significant demographic force globally, with developing countries having the largest youth populations.</p>
            </div>
          </div>
        `
      },
      {
        id: 'lesson-6',
        title: 'Triple Dividend',
        icon: 'fa-chart-line',
        gradientClass: 'bg-gradient-pink',
        audioFile: '6.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q10',
              question: '১০. আয়োডিন ঘাটতি হলে কি হয়',
              options: [
                'ক. গলগণ্ড',
                'খ. খর্বতা',
                'গ. বুদ্ধি প্রতিবন্ধিতা',
                'ঘ. উপরের সবকটি'
              ],
              correctAnswer: 3
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Why Adolescent Health is Important?</h2>
            
            <div class="highlight-box mb-4">
              <h4>Investments in the current generation of 10-24-year-olds will reap a <span class="text-primary">triple dividend</span></h4>
            </div>

            <div class="row g-4 mb-4">
              <div class="col-md-4">
                <div class="dividend-card">
                  <div class="dividend-icon">
                    <i class="fas fa-heart-pulse"></i>
                  </div>
                  <h5>Healthy Young Population Now</h5>
                  <p>2 billion people aged 10-24 years</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="dividend-card">
                  <div class="dividend-icon">
                    <i class="fas fa-briefcase"></i>
                  </div>
                  <h5>Future Healthy Adult Workforce</h5>
                  <p>Productive and resilient workers</p>
                </div>
              </div>

              <div class="col-md-4">
                <div class="dividend-card">
                  <div class="dividend-icon">
                    <i class="fas fa-baby"></i>
                  </div>
                  <h5>Healthy Next Generation</h5>
                  <p>Breaking the cycle of poor health</p>
                </div>
              </div>
            </div>

            <div class="roi-card">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h4><i class="fas fa-dollar-sign me-2"></i>Return on Investment</h4>
                  <p class="lead mb-0">For every <strong class="text-primary">US$1</strong> invested in Adolescent Health & Wellbeing, we see a return of <strong class="text-success">US$5-10</strong></p>
                </div>
                <div class="col-md-4 text-center">
                  <div class="roi-visual">
                    <span class="roi-number">5-10×</span>
                    <p class="small">ROI</p>
                  </div>
                </div>
              </div>
              <p class="small text-muted mt-3 mb-0"><em>Source: Our Future: A Lancet Commission on Adolescent Health and Wellbeing; Patton et al. 2016.</em></p>
            </div>
          </div>
        `
      },
      {
        id: 'lesson-7',
        title: 'Global & Bangladesh Scenario',
        icon: 'fa-globe',
        gradientClass: 'bg-gradient-purple',
        audioFile: '7.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q11',
              question: '১১. বয়ঃসন্ধিকালে কিশোরদের যে সকল বিষয়ে জ্ঞান থাকা দরকার তা হলো',
              options: [
                'ক. স্বপ্নে বীর্যপাত',
                'খ. বয়ঃসন্ধিকালে যৌনতা',
                'গ. কৈশোর কালে নিজেকে যৌনতা থেকে মুক্ত রাখার উপায়',
                'ঘ. উপরের সবকটি'
              ],
              correctAnswer: 3
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Global and Bangladesh Scenario</h2>
            <h4 class="mb-4">Mortality and Morbidity of Young People</h4>
            
            <div class="row g-4 mb-4">
              <div class="col-12">
                <div class="fact-card alert-danger">
                  <i class="fas fa-exclamation-triangle"></i>
                  <p>Over <strong>1.5 million</strong> adolescents and young adults aged 10–24 years died in 2021, about <strong>4500 every day</strong></p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="fact-card alert-info">
                  <i class="fas fa-shield-halved"></i>
                  <p>Young adolescents aged 10–14 years have the <strong>lowest risk of death</strong> among all age groups</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="fact-card alert-warning">
                  <i class="fas fa-car-burst"></i>
                  <p>Injuries, interpersonal violence, self-harm and maternal conditions are the <strong>leading causes of death</strong></p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="fact-card alert-primary">
                  <i class="fas fa-brain"></i>
                  <p>Half of all mental health disorders in adulthood start by age 18, but <strong>most cases are undetected</strong></p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="fact-card alert-secondary">
                  <i class="fas fa-baby-carriage"></i>
                  <p>Globally, there were <strong>42 births per 1000</strong> to girls aged 15–19 years in 2021</p>
                </div>
              </div>
            </div>

            <div class="bangladesh-section">
              <h5 class="mb-3">Bangladesh Context (Bengali)</h5>
              <p>প্রতিবছর ১.১ মিলিয়ন কিশোর/ কিশোরী নিরাময়যোগ্য এমন কারণে অসুস্থ হয় বা মৃত্যুবরণ করে।</p>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="bengali-card">
                    <h6><i class="fas fa-mars text-primary me-2"></i>কিশোরদের মৃত্যুর প্রধান ৫টি কারণ:</h6>
                    <ol>
                      <li>সড়ক দুর্ঘটনা</li>
                      <li>ডায়রিয়া</li>
                      <li>পানিতে ডুবা</li>
                      <li>যক্ষা</li>
                      <li>আত্মহত্যা</li>
                    </ol>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="bengali-card">
                    <h6><i class="fas fa-venus text-danger me-2"></i>কিশোরীদের মৃত্যুর প্রধান ৫টি কারণ:</h6>
                    <ol>
                      <li>ডায়রিয়া</li>
                      <li>যক্ষা</li>
                      <li>সড়ক দুর্ঘটনা</li>
                      <li>মাতৃত্বজনিত কারণ</li>
                      <li>শ্বাসতন্ত্রের নিচের অংশের সংক্রমণ</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'lesson-8',
        title: 'Adolescent Health in Bangladesh',
        icon: 'fa-flag',
        gradientClass: 'bg-gradient-blue',
        audioFile: '8.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q12',
              question: '১২. স্বপ্নে বীর্যপাত একটি',
              options: [
                'ক. শারীরিক রোগ',
                'খ. মানসিক রোগ',
                'গ. দুরবলতা দেখা দেয়',
                'ঘ. ছেলেদের বয়ঃসন্ধিকালে স্বাভাবিক নিয়মে হয়'
              ],
              correctAnswer: 3
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Adolescent Health in Bangladesh</h2>
            
            <div class="alert alert-danger mb-4">
              <h5><i class="fas fa-exclamation-circle me-2"></i>Critical Issue</h5>
              <p class="mb-0">Bangladesh is among <strong>top 10 countries</strong> with highest level of Child Marriage</p>
            </div>

            <div class="health-stats">
              <h5 class="mb-3">Key Health Challenges</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="challenge-card">
                    <i class="fas fa-ring text-warning"></i>
                    <p><strong>Child Marriage:</strong> Adolescent girls face early marriage and maternal complications</p>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="challenge-card">
                    <i class="fas fa-user-injured text-danger"></i>
                    <p><strong>Violence:</strong> Sexual harassment, gender-based discrimination, and abuse</p>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="challenge-card">
                    <i class="fas fa-child text-info"></i>
                    <p><strong>Malnutrition:</strong> Stunting, underweight, and anemia issues</p>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="challenge-card">
                    <i class="fas fa-pills text-primary"></i>
                    <p><strong>Substance Use:</strong> Tobacco, drugs, and other addictions among adolescents</p>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="challenge-card">
                    <i class="fas fa-virus text-success"></i>
                    <p><strong>STIs:</strong> Sexually transmitted infections from unsafe practices</p>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="challenge-card">
                    <i class="fas fa-graduation-cap text-secondary"></i>
                    <p><strong>Education:</strong> High dropout rates, especially among girls</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center mt-4">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80" alt="Bangladesh Youth" class="img-fluid rounded-4 shadow" style="max-height: 300px; object-fit: cover;">
            </div>
          </div>
        `
      },
      {
        id: 'lesson-9',
        title: 'Key Facts',
        icon: 'fa-chart-bar',
        gradientClass: 'bg-gradient-teal',
        audioFile: '9.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q13',
              question: '১৩. কোনটি সত্য-',
              options: [
                'ক. মাসিক ঋতুস্রাব ৯-১২ বছর বয়সে শুরু হয়',
                'খ. ৫ দিন থেকে ৭ দিন থাকে',
                'গ. সাধারণত ২৮ দিন পর পর হয়',
                'ঘ. ঋতুস্রাব হরমোনের প্রভাবে হয়',
                'ঙ. উপরের সবকটি সত্য'
              ],
              correctAnswer: 4
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Key Facts About Adolescent Health</h2>
            
            <div class="row g-3">
              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-purple">
                    <i class="fas fa-brain"></i>
                  </div>
                  <p><strong>13.4%</strong> adolescents suffer from diagnosable mental health condition</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-blue">
                    <i class="fas fa-child"></i>
                  </div>
                  <p><strong>36%</strong> of married and <strong>32%</strong> of unmarried adolescent girls are stunted</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-orange">
                    <i class="fas fa-droplet"></i>
                  </div>
                  <p>About <strong>30%</strong> of adolescents suffer from anemia</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-green">
                    <i class="fas fa-weight-scale"></i>
                  </div>
                  <p><strong>16%</strong> of married and <strong>10%</strong> of unmarried girls are overweight/obese</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-pink">
                    <i class="fas fa-hand-dots"></i>
                  </div>
                  <p><strong>One-fifth</strong> of adolescent girls are victims of physical or sexual violence</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-teal">
                    <i class="fas fa-person-harassing"></i>
                  </div>
                  <p><strong>77%</strong> of married adolescent girls are abused by their husbands</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-purple">
                    <i class="fas fa-children"></i>
                  </div>
                  <p><strong>1.78 million</strong> adolescents are involved in child labor in Bangladesh</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="key-fact">
                  <div class="fact-icon bg-gradient-blue">
                    <i class="fas fa-graduation-cap"></i>
                  </div>
                  <p>Dropout rate: <strong>32.85%</strong> (Girls: <strong>34.87%</strong>, Boys: <strong>30.46%</strong>)</p>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'lesson-10',
        title: 'Health Determinants',
        icon: 'fa-heartbeat',
        gradientClass: 'bg-gradient-orange',
        audioFile: '10.mp3',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q14',
              question: '১৪. নিচের কোনগুলো যৌন রোগ',
              options: [
                'ক. সিফিলিস',
                'খ. গনোরিয়া',
                'গ. এইড্স',
                'ঘ. হেপাটাইটিস্-বি',
                'ঙ. উপরের সবকটি সত্য'
              ],
              correctAnswer: 4
            }
          ]
        },
        content: `
          <div class="lesson-slide">
            <h2 class="slide-title">Determinants for Adolescent Health & Well-being</h2>
            
            <p class="lead mb-4">Understanding the key factors that influence adolescent health</p>

            <div class="row g-3">
              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-car-burst"></i>
                  <h6>Unintentional Injury</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-hand-back-fist"></i>
                  <h6>Violence</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-venus-mars"></i>
                  <h6>SRH, HIV & STI</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-virus"></i>
                  <h6>Communicable Diseases</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-heartbeat"></i>
                  <h6>Non-Communicable Diseases</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-brain"></i>
                  <h6>Mental Health</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-wine-bottle"></i>
                  <h6>Alcohol & Drug Use</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-smoking"></i>
                  <h6>Tobacco Use</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-person-running"></i>
                  <h6>Physical Activity</h6>
                </div>
              </div>

              <div class="col-md-4 col-sm-6">
                <div class="determinant-card">
                  <i class="fas fa-utensils"></i>
                  <h6>Nutrition</h6>
                </div>
              </div>
            </div>

            <div class="completion-message mt-5">
              <div class="text-center">
                <i class="fas fa-award display-1 text-primary mb-3"></i>
                <h3>Congratulations!</h3>
                <p class="lead">You have completed all lessons of the Youth Health Ambassador Programme</p>
                <p>Continue to the final assessment to earn your certificate</p>
              </div>
            </div>
          </div>
        `
      }
    ],
    // Legacy steps array for backward compatibility
    steps: []
  }
];
