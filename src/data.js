import team from "../src/assets/Icons/team.png";
import consultation from "../src/assets/Icons/consultation.png";
import ratio from "../src/assets/Icons/ratio.png";
import india from "../src/assets/Icons/india.png";
import tech from "../src/assets/Icons/tech.png";
import framework from "../src/assets/Icons/framework.png";

import earning from "../src/assets/Icons/earning.png";

import tax from "../src/assets/Icons/tax.png";

import retirement from "../src/assets/Icons/retirement.png";
import {IoBulbSharp} from "react-icons/io5";
import {GiHealthNormal,GiOpenBook, GiWallet, GiCharacter} from "react-icons/gi";

import equityImg1 from "../src/assets/illustrations/equityImg1.svg";
import equityImg2 from "../src/assets/illustrations/equityImg2.svg";
import equityImg3 from "../src/assets/illustrations/equityImg3.svg";

import partnerDataImg1 from '../src/assets/illustrations/partnerTrust.svg';
import partnerDataImg2 from '../src/assets/illustrations/partnerTechnology.svg';
import partnerDataImg3 from '../src/assets/illustrations/partnerInvestment.svg';
import {
  Chart, ArcElement, Tooltip, Legend
} from 'chart.js';




Chart.register(ArcElement, Tooltip, Legend);


export const featuresData = [
  {
    title: "Systematic Investment Plan",
    text: "Chhoti hi sahi lekin shuruaat jaroori hai !!",
  },
  {
    title: "Income Planning",
    text: "Design & Development",
  },
  {
    title: "Retirement Planning",
    text: "Retirement se pehle Retirement Planning kar lo !!",
  },
  {
    title: "Financial Freedom",
    text: "Get out of rat-race with our Financial Freedom planning",
  },
];
export const whyanupaatData = [
  {
    id: 1,
    icon: tech,
    title: "Techno-Functional Recommendation",
    text: "Our Investing models are periodically reviewed and rule based, built with combination of Science and Math.",
  },
  {
    id: 2,
    icon: team,
    title: "SKIN IN THE GAME",
    text: "Having our own skin in the game demonstrates the willingness to link our financial well-being with yours.",
  },
  {
    id: 3,
    icon: consultation,
    title: "Personalized Advisory",
    text: "We provide you the service of Dedicated relationship manager to handle your investment related queries.",
  },
  {
    id: 4,
    icon: framework,
    title: "पंचम: FRAMEWORK PORTFOLIO",
    text: "Our portfolio building involve five different style of investing which are Value, Growth, Emerging, Global & Quality.",
  },
  {
    id: 5,
    icon: ratio,
    title: "Right Proportional Investment",
    text: "We match your objectives to the have right allocation to suit your investment needs and boost your portfolio retunrs.",
  },
  {
    id: 6,
    icon: india,
    title: "Made with Love in INDIA",
    text: "Our aim is to introduce Value Investing to all Indians with long term wealth creation.",
  },
];
/*------TESTIMONIALS------*/
const Avatar1 = require("../src/assets/TestimonialImages/swati.webp");
const Avatar2 = require("../src/assets/TestimonialImages/priya.webp");
const Avatar3 = require("../src/assets/TestimonialImages/aditya.webp");
const Avatar4 = require("../src/assets/TestimonialImages/rupinder.webp");
const Avatar5 = require("../src/assets/TestimonialImages/naveen.webp");
const Avatar6 = require("../src/assets/TestimonialImages/jaspal.webp");

export const testimonials = [
  {
    id: 1,
    name: "Swati Vashisth",
    quote:
      "I went on a saving spree with Anupaat Nivesh with the exact emotion as my Nani had whilst keeping bucks in kitchen containers. I have been a part of Anupaat Nivesh for more than a year now, and I had always found them taking my calls on high priority no matter how naive my context has been. So appreciative and grateful for the service AN provided!",
    job: "Lecturer",
    avatar: Avatar1,
  },
  {
    id: 2,
    name: "Priya Kumari",
    quote:
      "I would like to share my experience as I am client of Anupaat Nivesh since 2020. The returns I received are phenomenal. I’m very much satisfied with the service. I recommend them to everyone and especially to those who are new to Investment in Mutual Funds, you will get best guidance and handsome returns.",
    job: "IES/Gate Content Creator",
    avatar: Avatar2,
    socials: [
      "https://instagram.com/",
      "https://twitter.com/",
      "https://facebook.com/",
      "https://linkedin.com/",
    ],
  },
  {
    id: 3,
    name: "Aditya Sethi",
    quote:
      "Anupaat Nivesh is truly living up to its name. Founder, Mr. Akash helped me earning excellent returns from Mutual Fund Investing. Some of my portfolio's investments DOUBLED in just 3 years. I wholeheartedly recommend them to all my colleagues and family members. Akash is full of cutting edge talent , dedication, and passion with his job in Investing.",
    job: "Pharmacist",
    avatar: Avatar3,
    socials: [
      "https://instagram.com/",
      "https://twitter.com/",
      "https://facebook.com/",
      "https://linkedin.com/",
    ],
  },
  {
    id: 4,
    name: "Rupinder Kaur",
    quote:
      "मैं अनुपात निवेश के साथ 2018 से निवेश कर रही हूं। मैं खुद को खुशकिस्मत मानती हूं कि मैं उनसे मिली और उन्होंने टैक्स सेविंग के लिए निवेश का सुझाव देने में मेरी मदद की। मुझे विश्वास नहीं हो रहा है कि टैक्स बचाने वाले म्युचुअल फंड इतने High रिटर्न दे सकते हैं। मैं उन्हें अपने सभी सरकारी कर्मचारियों और विशेष रूप से Working महिलाओं को recommend करती हूं।",
    job: "Government Teacher",
    avatar: Avatar4,
    socials: [
      "https://instagram.com/",
      "https://twitter.com/",
      "https://facebook.com/",
      "https://linkedin.com/",
    ],
  },
  {
    id: 5,
    name: "Naveen Goyal",
    quote:
      "I have been extremely impressed with Anupaat Nivesh. They have helped me navigate the confusing world of investing and have provided me with a clear and concise plan for achieving my financial goals. They are responsive, knowledgeable, and truly care about their clients. I highly recommend Anupaat Nivesh.",
    job: "Software Engineer",
    avatar: Avatar5,
    socials: [
      "https://instagram.com/",
      "https://twitter.com/",
      "https://facebook.com/",
      "https://linkedin.com/",
    ],
  },
  {
    id: 6,
    name: "Jaspal Singh",
    quote:
      "I started investing in 2018 with the guidance of Akash (founder). I have two instances to share. One, I needed money to pay-off debt in 2019 and he strategised redemption to maximise gain and lower tax-outgo.Second, during covid he convinced me continue SIPs and invest more when I was skeptical for the future of Equity market. But I was proven wrong happily and I made handsome returns after one year of covid-lockdown.",
    job: "Educator & Influencer",
    avatar: Avatar6,
    socials: [
      "https://instagram.com/",
      "https://twitter.com/",
      "https://facebook.com/",
      "https://linkedin.com/",
    ],
  },
];

export const faqsData = [
  {
    id: 1,
    question: "How does this work?",

    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    id: 2,
    question: "How does this work?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    id: 3,
    question: "How does this work?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    id: 4,
    question: "How does this work?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    id: 5,
    question: "How does this work?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    id: 6,
    question: "How does this work?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
];


/*=====================CHART DATA=======================*/ 
const data1 = {

  datasets: [{
      label: 'Core Portfolio (पंचम: Framework Investment)',
      data: [25, 20, 20, 20, 15],
      backgroundColor: [
          'rgb(13,93,127)',
          'rgb(49,148,183)',
          'rgb(77,182,172)',
          'rgb(129,199,132)',
          'rgb(205,231,117)',
      ],
      hoverOffset: 4
  }],
  labels: [
      'Fund 1 : Flexi Cap',
      'Fund 2 : Mid Cap',
      'Fund 3 : Value Fund',
      'Fund 4 : Mid Cap',
      'Fund 4 : Large Cap'
  ]
};


const data2 = {

  datasets: [{
      label: 'Tax-Saver',
      data: [30,30,40],
      backgroundColor: [
         
        'rgb(13,93,127)',
        'rgb(49,148,183)',
        'rgb(77,182,172)',
          
      ],
      hoverOffset: 4
  }],
  labels: [
      'Fund 1 : Tax-Saver',
      'Fund 2 : Tax-Saver',
      'Fund 3 : Tax-Saver'
      
  ]
};
const data3 = {

  datasets: [{
      label: 'Active-Passive Combo',
      data: [35,25,20,20],
      backgroundColor: [
         
        'rgb(49,148,183)',
        'rgb(77,182,172)',
        'rgb(129,199,132)',
        'rgb(205,231,117)',
      ],
      hoverOffset: 4
  }],
  labels: [
    'Fund 1 : Large Cap',
    'Fund 2 : Large Cap',
    'Fund 3 : Mid Cap',
    'Fund 4 : Multi Cap'
     
  ]
};
const data4 = {

  datasets: [{
      label: 'Income Generation',
      data: [35,35,30],
      backgroundColor: [
         
        'rgb(49,148,183)',
        'rgb(77,182,172)',
        'rgb(129,199,132)',
      ],
      
     
      hoverOffset: 4
  }],
  labels: [
    'Fund 1 : Multi Cap',
    'Fund 2 : Flexi Cap',
    'Fund 3 : Flexi Cap'
     
  ]
};
/*========================CHART DATA ENDS HERE =====================*/


/*=====================MUTUAL FUND DATA BASKET PAGE DATA============================*/
export const mutualFundData = [
  {
    id: 1,
    icon: earning,
    title:"Core Portfolio (5FF)",
    hreturn:"14-16%",
    ihorizon:"5Y+",
    mode:"SIP/LUMP SUM",
    lockin:"NO",
    chart:data1,
    riskprofile:"Very High",
    color: "#ff2300",
    description: "Inflation beating growth while managing risk",
  },
  {
    id: 2,
    icon: tax,
    title: "Tax-Saver",
    hreturn:"11-14%",
    ihorizon:"3Y+",
    mode:"SIP/LUMP SUM",
    lockin:"YES",
    chart:data2,
    riskprofile:"Moderate",
    color: "#ffbf00",
    description: "Achieve short term goals and get better taxation than FDs",
  },
  {
    id: 3,
    icon: tax,
    title: "Active-Passive Combo",
    hreturn:"11-14%",
    ihorizon:"3Y+",
    mode:"SIP/LUMP SUM",
    lockin:"NO",
    chart:data3,
    riskprofile:"Moderate",
    color: "#ffbf00",
    description: "Save taxes AND grow your wealth with LESS funds",
  },
  {
    id: 4,
    icon: retirement,
    title: "Income Generation",
    hreturn:"10-14%",
    ihorizon:"5Y+",
    mode:"SIP/LUMP SUM",
    lockin:"NO",
    chart: data4,
    riskprofile:"Low",
    color: "#008000",
    description: "Plan and invest for hassle-free sunset years",
  }
  
];

/*=====================EQUITY BASKET PAGE DATA============================*/

export const equityBasketData = [
  {
    id: 1,
    icon: equityImg1,
    title: "Simple to Understand",
    description: "iBaskets are modern investing products based on simple ideas you can understand",
    color: "#EEF8F9",
  },
  {
    id: 2,
    icon:equityImg2,
    title: "Scientific Investment Models",
  
    description: "Models are rule based and systematic investing techniques. They are built and proved with Science and Math",
    color:"#fcf2f2",
  },
  {
    id: 3,
    icon:equityImg3,
    title: "Make Productive Portfolio",
   
    description: "Right proportional investment can generate alpha returns for your portfolio",
    color:"#f2f2ff",
  }
  ];


  /*=====================PARTNER WITH US  PAGE DATA============================*/

export const partnerData = [
  {
    id: 1,
    icon: partnerDataImg1,
    title: "A PARTNER YOU AND YOUR CLIENTS CAN TRUST",
    description: "Inflation beating growth while managing risk",
    color: "#EEF8F9",
  },
  {
    id: 2,
    icon:partnerDataImg2,
    title: "EMPOWER YOURSELF WITH EMERGING TECHNOLOGY",
    description: "We offer the Technology to help your business grows",
    color:"#fcf2f2",
  },
  {
    id: 3,
    icon:partnerDataImg3,
    title: "BE A PART OF CHANGE IN THE INVESTMENT INDUSTRY",
   description: "Get Access to our curated Mutual Fund Basket & iBaskets for your customers",
   color:"#f2f2ff",
  }
  ];
/*=====================CORPORATE  PAGE DATA============================*/

export const corporateData = [
  {
    id: 1,
    icon:<IoBulbSharp/>,
    title: "Productivity",
    description: "Hands-on learning through simulated activities changes behavior. Anupaat Nivesh Coach is for all ages and has limitless potential for implementation in schools, community groups, and employees at your organization.",
  },
  {
    id: 2,
    icon:<GiHealthNormal/>,
    title: "Health",
    description: "We’ve always known that stress is bad for our health—and it’s never been truer than with financial stress. Nearly half of Indians say their lack of money has created obstacles to living a healthy lifestyle.",
  },
  {
    id: 3,
    icon:<GiOpenBook/>,
    title: "Attendance",
    description: "Tardiness and absenteeism tends to increase when employees struggle financially, which can also negatively affect their ability to perform well at work.",
  },
  {
    id: 4,
    icon:<GiWallet/>,
    title: "Well-Being",
    description: "  Many people are struggling to save as a result of poor financial education. In fact, 37% of respondents in one large survey admitted to having no specific savings goal.",
  },
  {
    id: 5,
    icon:<GiCharacter/>,
    title: "The Anupaat Nivesh Coach",
    description: "The Coach has no peer or precedent in financial education. It is a unique, virtual financial mentor that asks sophisticated questions and gives sophisticated answers. Your employees can create specific plans when they use the Coach to understand their own situation.",
  }
  ];








export const socialLogos = [
  {
    name: "facebook",
    link: "https://www.facebook.com/anupaatnivesh",
    logo: require("../src/assets/facebook-logo.png"),
  },
  {
    name: "whatsapp",
    link: "https://wa.me/919501195200",
    logo: require("../src/assets/whatsapp.png"),
  },
  {
    name: "twitter",
    link: "https://twitter.com/Anupaatnivesh",
    logo: require("../src/assets/twitter-logo.png"),
  },
  {
    name: "youtube",
    link: "https://www.youtube.com/@anupaatnivesh",
    logo: require("../src/assets/youtube.png"),
  },
  {
    name: "linkedin",
    link: "https://www.linkedin.com/company/anupaatnivesh/",
    logo: require("../src/assets/linkedin.png"),
  },
];


/*=====================LOAN AGAINST SECURITIES PAGE DATA============================*/

export const expenseTypeCardsData = [
  {
    name:'Medical Expense',
    icon:require('./assets/Icons/bill.png'),
    colorTheme:'#EEF8F9',
  },
  {
    name:'Travel Expense',
    icon:require('./assets/Icons/travel-location.png'),
    colorTheme:'#fcf2f2',
  },
  {
    name:'Renovation Expense',
    icon:require('./assets/Icons/home-renovation.png'),
    colorTheme:'#f2f2ff',
  },
  {
    name:'Education Expense',
    icon:require('./assets/Icons/education.png'),
    colorTheme:'#fefbec',
  },
]

export const cardsData = [
  {
    title:'Get LAS Limit the same day',
    description:'No need to wait for days. Complete simple steps to get an overdraft limit against shares the same day using the MAFS mobile app. Your application will be processed instantly to provide you with a limit the same day.',
    icon:require("./assets/Icons/loanAgainstSecurities/timer.png"),
  },
  {
    title:'Zero Prepayment/ Foreclosure Charges',
    description:"No lock-in, no prepayment & no foreclosure charges if you decide to repay your outstanding's early.",
    icon:require("./assets/Icons/loanAgainstSecurities/zero.png"),
  },
  {
    title:'Instant Disbursal',
    description:'Get access to funds whenever you need them. Get the required amount credited directly to your provided bank account on the same day.',
    icon:require("./assets/Icons/loanAgainstSecurities/money.png"),
  },
  {
    title:'Large List of Approved Securities',
    description:'Select from a list of approved shares held in the Demat account with NSDL only.',
    icon:require("./assets/Icons/loanAgainstSecurities/approval.png"),
  },
  {
    title:'100% Digital Process',
    description:'No need of visiting branches or reaching out to relationship managers. With our mobile app, you can complete your entire journey online from your mobile device without any need of submitting physical documents.',
    icon:require("./assets/Icons/loanAgainstSecurities/mobile.png"),
  },
  {
    title:'Retain Ownership',
    description:'Allow your investments in shares to continue to generate wealth. You continue to retain ownership of your shares and reap all the benefits that are associated with them.',
    icon:require("./assets/Icons/loanAgainstSecurities/owner.png"),
  },
  {
    title:'Attractive Interest Rate',
    description:'Avail loan at an attractive Interest rate starting at 9% p.a with a Flexi payment option. Unlike term loans, interest on LAS is levied only on the amount you use and for the number of days you utilize.',
    icon:require("./assets/Icons/loanAgainstSecurities/interestRate.png"),
  },
  {
    title:'Loan Tenure',
    description:'The overdraft limit provided against your shares has a tenure of 12 months and is renewed thereafter.',
    icon:require("./assets/Icons/loanAgainstSecurities/hourglass.png"),
  },
  {
    title:'Higher Loan Value',
    description:'Avail LAS limit up to Rs 1Cr against approved shares.',
    icon:require("./assets/Icons/loanAgainstSecurities/diagram.png"),
  },
  {
    title:'Easy Repayment',
    description:'Manage your funds with more flexibility. You are required to service the interest amount accrued as per utilization on a monthly basis.',
    icon:require("./assets/Icons/loanAgainstSecurities/exchange.png"),
  }
];


