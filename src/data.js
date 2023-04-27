import team from "../src/assets/Icons/team.png";
import consultation from "../src/assets/Icons/consultation.png";
import ratio from "../src/assets/Icons/ratio.png";
import india from "../src/assets/Icons/india.png";
import tech from "../src/assets/Icons/tech.png";
import framework from "../src/assets/Icons/framework.png";

import earning from "../src/assets/Icons/earning.png";

import tax from "../src/assets/Icons/tax.png";
import shortterm from "../src/assets/Icons/short-term.png";
import retirement from "../src/assets/Icons/retirement.png";

import donut from "../src/assets/Icons/graph.png";
import equity2 from '../src/assets/equity2.png';
import equity3 from '../src/assets/equity3.png';
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
      label: 'Core Portfolio (5FF)',
      data: [25, 20, 20, 20, 15],
      backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(255, 25, 86)',
          'rgb(25, 205, 86)',
      ],
      hoverOffset: 4
  }],
  labels: [
      ' Parag Parikh Flexi Cap ',
      'Canara Robeco Emerging Equity  ',
      ' ICICI Prudential Value Fund',
      'Kotak Emerging Equity Fund ',
      'UTI Nifty 50 Index Fund '
  ]
};


const data2 = {

  datasets: [{
      label: 'Tax-Saver',
      data: [30,30,40],
      backgroundColor: [
         
          'rgb(255, 205, 86)',
          'rgb(255, 25, 86)',
          'rgb(25, 205, 86)',
          
      ],
      hoverOffset: 4
  }],
  labels: [
      '  Parag Parikh Tax-saver plan   ',
      'Mirae Asset Tax-saver       ',
     
      ' Kotak Tax-saver    '
      
  ]
};
const data3 = {

  datasets: [{
      label: 'Active-Passive Combo',
      data: [35,25,20,20],
      backgroundColor: [
         
          'rgb(255, 205, 86)',
          'rgb(255, 25, 86)',
          'rgb(25, 205, 86)',
          'rgb(54, 162, 235)'
      ],
      hoverOffset: 4
  }],
  labels: [
      ' UTI nifty 50 index fund    ',
      'Kotak Nifty next 50 index fund  ',
      ' Mirae Mid cap   ',
      'ICICI Prudential Multi-asset  '
     
  ]
};
const data4 = {

  datasets: [{
      label: 'Income Generation',
      data: [35,35,30],
      backgroundColor: [
         
          'rgb(255, 205, 86)',
          'rgb(255, 25, 86)',
          'rgb(25, 205, 86)',
      ],
      hoverOffset: 4
  }],
  labels: [
      'ICICI prudential Multi-asset ',
      ' Canara Hybrid equity ',
     
      ' Parag parikh flexi cap '
     
  ]
};
/*========================CHART DATA ENDS HERE =====================*/



export const mutualFundData = [
  {
    id: 1,
    icon: earning,
    title: "Core Portfolio (5FF)",
    chart:data1,
    description: "Inflation beating growth while managing risk",
  },
  {
    id: 2,
    icon: tax,
    title: "Tax-Saver",
    chart:data2,
    description: "Achieve short term goals and get better taxation than FDs",
  },
  {
    id: 3,
    icon: tax,
    title: "Active-Passive Combo",
    chart:data3,
    description: "Save taxes AND grow your wealth with LESS funds",
  },
  {
    id: 4,
    icon: retirement,
    title: "Income Generation",
    chart: data4,
    description: "Plan and invest for hassle-free sunset years",
  }
  
];


export const equityBasketData = [
  {
    id: 1,
    icon: equity2,
    title: "Provide Unique oppurtunities to your clients",
   
    description: "Inflation beating growth while managing risk",
  },
  {
    id: 2,
    icon:equity3,
    title: "Increase your share of client wallet",
  
    description: "Achieve short term goals and get better taxation than FDs",
  },
  {
    id: 3,
    icon:equity3,
    title: "Make every part of your client's portfolio productive",
   
    description: "Save taxes AND grow your wealth with LESS funds",
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



