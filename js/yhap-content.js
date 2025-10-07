// Youth Health Ambassador Programme - Content and Data

const yhapContent = {
  hero: {
    title: "Youth Health Ambassador Programme",
    subtitle: "YHAP",
    tagline: "Empowering Youth Through Health Education",
    description: "A strategic joint initiative of the Ministry of Health and Family Welfare (MOHFW) and UNICEF designed to empower youth by enhancing their health awareness and building their capacity in primary prevention and health promotion."
  },
  
  definitions: [
    {
      term: "Youth",
      definition: "As per United Nations, youth refers to those persons aged between the ages of 15 and 24 without prejudice to other definitions by Member States. It is a period of transition from the dependence of childhood to adulthood's independence.",
      note: "Young People covers the age range 10-24 years and Adolescents as individuals in the 10-19 years age group."
    },
    {
      term: "Health",
      definition: "As per World Health Organization (WHO), health is defined as a state of complete physical, mental, and social well-being, and not merely the absence of disease or infirmity."
    }
  ],
  
  coreComponents: [
    {
      id: 1,
      title: "Health Literacy",
      icon: "fa-book-medical",
      gradient: "bg-gradient-purple",
      description: "YHAP builds foundational health literacy through comprehensive training on essential health and wellbeing. This equips ambassadors with the expertise to act as credible sources of information and effective advocates for prevention and promotion."
    },
    {
      id: 2,
      title: "Health Education & Awareness",
      icon: "fa-graduation-cap",
      gradient: "bg-gradient-blue",
      description: "Youth Health Ambassadors (YHAs) will create health education and awareness through campaigns on key health issues, comprehensive trainings, mentorships etc., ensuring the accurate dissemination of crucial health information."
    },
    {
      id: 3,
      title: "Peer to Peer Influence",
      icon: "fa-users",
      gradient: "bg-gradient-teal",
      description: "The programme is built on the principle that peer-to-peer engagement is a powerful catalyst for change. By facilitating supportive mentorship and encouraging positive role-modeling among contemporaries."
    },
    {
      id: 4,
      title: "Empowerment",
      icon: "fa-hand-fist",
      gradient: "bg-gradient-orange",
      description: "YHAP empowers individuals by equipping them with the tools, confidence, and skills needed to take effective control and contribute to the economic development, creating a productive, resilient, and healthy workforce for the future."
    },
    {
      id: 5,
      title: "Leadership",
      icon: "fa-flag",
      gradient: "bg-gradient-green",
      description: "The program cultivates leadership qualities in youth, preparing them to become effective, ethical, and inspiring agents of change in their communities."
    },
    {
      id: 6,
      title: "Advocacy",
      icon: "fa-bullhorn",
      gradient: "bg-gradient-pink",
      description: "YHAP builds foundational competencies in health advocacy, empowering youth to effectively raise voice, articulate public health priorities to drive systemic reform through strategic engagement with key stakeholders."
    }
  ],
  
  roles: [
    {
      icon: "fa-shield-heart",
      text: "I am equipped with expertise in safeguarding adolescent and youth health and well-being, enabling me to contribute meaningfully to society while harnessing the triple dividend of health, social, and economic benefits"
    },
    {
      icon: "fa-share-nodes",
      text: "I actively empower my peers by sharing knowledge on health promotion, disease prevention, and holistic well-being, fostering informed decision-making among adolescents and youth"
    },
    {
      icon: "fa-handshake",
      text: "Through advocacy, I engage policy makers, stakeholders and community influencer, gatekeepers to prioritize adolescent health, ensuring supportive policies and collaborative action for sustainable well-being"
    },
    {
      icon: "fa-chart-line",
      text: "I drive awareness and demand creation within communities, inspiring collective responsibility and action toward better health outcomes for adolescents and youth"
    }
  ],
  
  eligibilitySteps: [
    { step: 1, title: "Online Registration", description: "Register in Health Ambassador Programme" },
    { step: 2, title: "Unique ID Generation", description: "Receive your unique identification" },
    { step: 3, title: "Login", description: "Log in to the Website/App" },
    { step: 4, title: "Access Course", description: "Access Health Ambassador course content" },
    { step: 5, title: "Complete Course", description: "Complete online Health Ambassador course" },
    { step: 6, title: "Assessment", description: "Obtain passing marks in final assessment" },
    { step: 7, title: "System Certification", description: "Receive system generated certification" },
    { step: 8, title: "Oath Taking", description: "Self declaration/Oath Taking" },
    { step: 9, title: "Final Certificate", description: "Final Certificate (Course Validity-2 years)" }
  ],
  
  globalStats: [
    {
      icon: "fa-earth-americas",
      number: "1.8B",
      label: "Youth Worldwide",
      description: "90% live in developing countries"
    },
    {
      icon: "fa-users-between-lines",
      number: "49.5M",
      label: "Young People in Bangladesh",
      description: "Approx. 30% of total population"
    },
    {
      icon: "fa-user-group",
      number: "31.5M",
      label: "Youth in Bangladesh",
      description: "Ages 15-24 years"
    }
  ],
  
  tripleDividend: {
    title: "Why adolescent health is important?",
    subtitle: "Investments in the current generation of 10-24-year-olds will reap a triple dividend",
    benefits: [
      {
        icon: "fa-heart-pulse",
        title: "Healthy young population now",
        description: "2 billion people aged 10-24 years"
      },
      {
        icon: "fa-briefcase",
        title: "Future healthy adult workforce",
        description: "Productive and resilient workers"
      },
      {
        icon: "fa-baby",
        title: "Healthy next generation of children",
        description: "Breaking the cycle of poor health"
      }
    ],
    roi: "Investing in Adolescent Health & Wellbeing, for investment of US$1 yielding a return of US$5-10."
  },
  
  mortalityFacts: [
    { text: "Over 1.5 million adolescents and young adults aged 10–24 years died in 2021, about 4500 every day." },
    { text: "Young adolescents aged 10–14 years have the lowest risk of death among all age groups." },
    { text: "Injuries (including road traffic injuries and drowning), interpersonal violence, self-harm and maternal conditions are the leading causes of death among adolescents and young adults." },
    { text: "Half of all mental health disorders in adulthood start by age 18, but most cases are undetected and untreated." },
    { text: "Early onset of substance use is associated with higher risks of developing dependence and other problems during adult life." },
    { text: "Globally, there were 42 births per 1000 to girls aged 15–19 years in 2021." }
  ],
  
  bangladeshMortality: {
    general: "প্রতিবছর ১.১ মিলিয়ন কিশোর/ কিশোরী নিরাময়যোগ্য এমন কারণে অসুস্থ হয় বা মৃত্যুবরণ করে।",
    boys: [
      "সড়ক দুর্ঘটনা",
      "ডায়রিয়া",
      "পানিতে ডুবা",
      "যক্ষা",
      "আত্মহত্যা"
    ],
    girls: [
      "ডায়রিয়া",
      "যক্ষা",
      "সড়ক দুর্ঘটনা",
      "মাতৃত্বজনিত কারণ",
      "শ্বাসতন্ত্রের নিচের অংশের সংক্রমণ"
    ],
    girlsIssues: "বাংলাদেশে কিশোরীরা বাল্যবিয়ে ও মাতৃত্বজনিত সমস্যা ছাড়াও অনিরাপদ গর্ভপাত, লিঙ্গভিত্তিক বৈষম্য, যৌন হয়রানি ও সহিংসতা/নির্যাতন, যৌনবাহিত সংক্রমণ, খর্বাকৃতি, কৃশাকৃতি ও রক্তস্বল্পতার মতো অপুষ্টিজনিত সমস্যার শিকার হয়ে থাকে।",
    boysIssues: "কিশোরদের সমস্যার মধ্যে রয়েছে মাদক, ধূমপান বা অন্যান্য ধরনের আসক্তি ও অনিরাপদ যৌনমিলনের ফলে বিভিন্ন ধরনের যৌনবাহিত রোগ।"
  },
  
  keyFacts: [
    { icon: "fa-brain", text: "13.4% adolescents suffer from diagnosable mental health condition" },
    { icon: "fa-child", text: "36% of married adolescent girls and 32% of unmarried adolescent girls are stunted, and 4% of married adolescent girls and 8% of unmarried adolescent girls are underweight" },
    { icon: "fa-droplet", text: "About one-third (30%) of adolescents suffer from anemia" },
    { icon: "fa-weight-scale", text: "16% of married adolescent girls and 10% of unmarried adolescent girls are overweight or obese" },
    { icon: "fa-hand-dots", text: "One-fifth of adolescent girls and women, regardless of their marital status are victims of physical or sexual violence" },
    { icon: "fa-person-harassing", text: "77% of the married adolescent girls are abused by their husbands" },
    { icon: "fa-children", text: "About 1.78 million adolescents are involved in child labor in Bangladesh" },
    { icon: "fa-graduation-cap", text: "The dropout rate from secondary education is 32.85%. The dropout rate among adolescents (34.87%) is higher than that of boys (30.46%)" }
  ],
  
  determinants: [
    { icon: "fa-car-burst", title: "Unintentional Injury", color: "#e74c3c" },
    { icon: "fa-hand-back-fist", title: "Violence", color: "#c0392b" },
    { icon: "fa-venus-mars", title: "SRH, HIV and STI", color: "#9b59b6" },
    { icon: "fa-virus", title: "Communicable Diseases", color: "#8e44ad" },
    { icon: "fa-heartbeat", title: "Non-Communicable Diseases", color: "#2980b9" },
    { icon: "fa-brain", title: "Mental Health", color: "#3498db" },
    { icon: "fa-wine-bottle", title: "Alcohol and Drug Use", color: "#16a085" },
    { icon: "fa-smoking", title: "Tobacco use", color: "#27ae60" },
    { icon: "fa-person-running", title: "Physical Activity", color: "#f39c12" },
    { icon: "fa-utensils", title: "Nutrition", color: "#e67e22" }
  ]
};