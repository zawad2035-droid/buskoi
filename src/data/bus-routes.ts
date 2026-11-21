// Source: the user's uploaded Dhaka bus route list (one entry per operator).
export type RawBus = {
  name: string;
  nameBn?: string;
  endpoints: string;
  stops: string[];
};

export const RAW_BUSES: RawBus[] = [
  {
    "name": "Safety Druti",
    "endpoints": "Mirpur 14 ↔ Azimpur",
    "stops": [
      "Mirpur 14",
      "Mirpur 10",
      "Mirpur 2",
      "Mirpur 1",
      "Technical",
      "Kallyanpur",
      "Shyamoli",
      "Asad Gate",
      "Kalabagan",
      "Science Lab",
      "New Market",
      "Nilkhet",
      "Azimpur"
    ],
    "nameBn": "সেফটি দ্রুতি"
  },
  {
    "name": "Sakalpa",
    "endpoints": "Chiriyakhana ↔ Kamalapur",
    "stops": [
      "Chiriyakhana",
      "Mirpur 1",
      "Mirpur 10",
      "Agargaon",
      "Bijoy Sarani",
      "Farmgate",
      "Bangla Motor",
      "Mogbazar",
      "Malibagh",
      "Kamalapur"
    ],
    "nameBn": "সকল্প"
  },
  {
    "name": "Salsabil",
    "endpoints": "Postagola ↔ Gazipur Chourasta",
    "stops": [
      "Postagola",
      "Jatrabari",
      "Sayedabad",
      "Mugdapara",
      "Bashabo",
      "Khilgaon",
      "Malibagh",
      "Rampura",
      "Badda",
      "Notun Bazar",
      "Kuril Bishwa Road",
      "Khilkhet",
      "Airport",
      "Uttara",
      "Abdullahpur",
      "Tongi",
      "Board Bazar",
      "Gazipur Chourasta"
    ],
    "nameBn": "সালসাবিল"
  },
  {
    "name": "Savar Paribahan",
    "endpoints": "Chandra ↔ Sadarghat",
    "stops": [
      "Chandra",
      "Nandan Park",
      "Zirani Bazar",
      "Baipayl",
      "Nobinagar",
      "Savar",
      "Hemayetpur",
      "Amin Bazar",
      "Gabtoli",
      "Technical",
      "Kallyanpur",
      "Shyamoli",
      "Asad Gate",
      "Kalabagan",
      "Science Lab",
      "Shahbag",
      "High Court",
      "Gulistan",
      "Naya Bazar",
      "Sadarghat"
    ],
    "nameBn": "সাভার পরিবহন"
  },
  {
    "name": "Shadhin",
    "endpoints": "Bosila ↔ Demra Staff Quarter",
    "stops": [
      "Bosila",
      "Mohammadpur",
      "Asad Gate",
      "Khamar Bari",
      "Farmgate",
      "Kawran Bazar",
      "Bangla Motor",
      "Mogbazar",
      "Mouchak",
      "Malibagh Railgate",
      "Hazipara",
      "Rampura Bazar",
      "Rampura Bridge",
      "Banasree",
      "Demra Staff Quarter"
    ],
    "nameBn": "স্বাধীন"
  },
  {
    "name": "Shetu",
    "endpoints": "Gulistan ↔ Narayanganj",
    "stops": [
      "Gulistan",
      "Jatrabari",
      "Shonir Akhra",
      "Sign Board",
      "Jalkuri",
      "Chashara",
      "Narayanganj"
    ],
    "nameBn": "সেতু"
  },
  {
    "name": "Shikhor Paribahan",
    "endpoints": "Mirpur 12 ↔ Jatrabari",
    "stops": [
      "Mirpur 12",
      "Pallabi",
      "Purobi",
      "Mirpur 11",
      "Mirpur 10",
      "Kazipara",
      "Shewrapara",
      "Taltola",
      "Agargaon",
      "Bijoy Sarani",
      "Farmgate",
      "Kawran Bazar",
      "Bangla Motor",
      "Shahbag",
      "Matsya Bhaban",
      "High Court",
      "Press Club",
      "Paltan",
      "GPO",
      "Gulistan",
      "Janapath Moor",
      "Sayedabad",
      "Jatrabari"
    ],
    "nameBn": "শিখর"
  },
  {
    "name": "Shishir",
    "endpoints": "Chittagong Road ↔ Abdullahpur",
    "stops": [
      "Chittagong Road",
      "Sign Board",
      "Jatrabari",
      "Sayedabad",
      "Gulistan",
      "Paltan",
      "Kakrail",
      "Shantinagar",
      "Malibagh",
      "Mouchak",
      "Rampura",
      "Badda",
      "Notun Bazar",
      "Kuril Bishwa Road",
      "Airport",
      "Uttara",
      "Azampur",
      "Abdullahpur"
    ],
    "nameBn": "শিশির"
  },
  {
    "name": "Somoy",
    "endpoints": "Gulistan ↔ Nandan Park",
    "stops": [
      "Gulistan",
      "Shahbag",
      "Science Lab",
      "Kalabagan",
      "Asad Gate",
      "Shyamoli",
      "Technical",
      "Gabtoli",
      "Savar",
      "Nobinagar",
      "Baipayl",
      "Nandan Park"
    ],
    "nameBn": "সময়"
  },
  {
    "name": "Sonargaon Express",
    "endpoints": "Gulistan ↔ Meghna Ghat",
    "stops": [
      "Gulistan",
      "Jatrabari",
      "Chittagong Road",
      "Kanchpur",
      "Madanpur",
      "Darikandi",
      "Meghna Ghat"
    ]
  },
  {
    "name": "Suchona BRF",
    "endpoints": "Azimpur ↔ Uttara House Building",
    "stops": [
      "Azimpur Etimkhana Moor",
      "Nilkhet",
      "New Market",
      "Kalabagan",
      "Asad Gate",
      "Khamar Bari",
      "Farmgate",
      "Mohakhali",
      "Banani",
      "Airport",
      "Uttara House Building"
    ],
    "nameBn": "সূচনা"
  },
  {
    "name": "Suprovat",
    "endpoints": "Sadarghat ↔ Gazipur / Uttara",
    "stops": [
      "Sadarghat",
      "Naya Bazar",
      "Gulistan",
      "Paltan",
      "Kakrail",
      "Shantinagar",
      "Malibagh",
      "Mouchak",
      "Rampura",
      "Badda",
      "Notun Bazar",
      "Kuril Bishwa Road",
      "Khilkhet",
      "Airport",
      "Uttara",
      "Tongi",
      "Gazipur"
    ],
    "nameBn": "সুপ্রভাত"
  },
  {
    "name": "Swajan",
    "endpoints": "Azimpur ↔ Abdullahpur",
    "stops": [
      "Azimpur",
      "New Market",
      "Science Lab",
      "Shahbag",
      "Kawran Bazar",
      "Farmgate",
      "Mohakhali",
      "Banani",
      "Kuril Bishwa Road",
      "Airport",
      "Uttara",
      "Abdullahpur"
    ],
    "nameBn": "স্বজন"
  },
  {
    "name": "Taranga Plus",
    "endpoints": "Mohammadpur ↔ South Banasree",
    "stops": [
      "Mohammadpur",
      "Shankar",
      "Dhanmondi 15",
      "Jigatola",
      "City College",
      "Science Lab",
      "Shahbag",
      "Kakrail",
      "Shantinagar",
      "Malibagh",
      "Mouchak",
      "Malibagh Railgate",
      "Rampura",
      "Banasree",
      "South Banasree"
    ],
    "nameBn": "তরঙ্গ প্লাস"
  },
  {
    "name": "Tetulia",
    "endpoints": "Shia Mosque ↔ Abdullahpur",
    "stops": [
      "Shia Mosque",
      "Shyamoli",
      "Agargaon",
      "Kazipara",
      "Shewrapara",
      "Mirpur 10",
      "Kalshi",
      "ECB Square",
      "Kuril Bishwa Road",
      "Khilkhet",
      "Airport",
      "Uttara",
      "Abdullahpur"
    ],
    "nameBn": "তেঁতুলিয়া"
  },
  {
    "name": "Thikana",
    "endpoints": "Jatrabari ↔ Chandra",
    "stops": [
      "Jatrabari",
      "Sayedabad",
      "Gulistan",
      "Shahbag",
      "Science Lab",
      "Kalabagan",
      "Asad Gate",
      "Shyamoli",
      "Technical",
      "Gabtoli",
      "Savar",
      "Nobinagar",
      "Baipayl",
      "Nandan Park",
      "Chandra"
    ],
    "nameBn": "ঠিকানা"
  },
  {
    "name": "Titas",
    "endpoints": "Chiriyakhana ↔ Chandra",
    "stops": [
      "Chiriyakhana",
      "Mirpur 1",
      "Technical",
      "Gabtoli",
      "Amin Bazar",
      "Savar",
      "Nobinagar",
      "Baipayl",
      "Nandan Park",
      "Chandra"
    ],
    "nameBn": "তিতাস"
  },
  {
    "name": "Transilva",
    "endpoints": "Mirpur 1 ↔ Jatrabari",
    "stops": [
      "Mirpur 1",
      "Technical",
      "Kallyanpur",
      "Asad Gate",
      "Kalabagan",
      "Science Lab",
      "Shahbag",
      "Press Club",
      "Paltan",
      "Gulistan",
      "Motijheel",
      "Ittefaq Moor",
      "Sayedabad",
      "Jatrabari"
    ],
    "nameBn": "ট্রান্সসিলভা"
  },
  {
    "name": "Trust Line",
    "endpoints": "Mirpur 10 ↔ Notun Bazar",
    "stops": [
      "Mirpur 10",
      "Mirpur 14",
      "Kachukhet",
      "Cantonment",
      "Sainik Club",
      "Banani",
      "Gulshan 2",
      "Notun Bazar"
    ],
    "nameBn": "ট্রাস্ট লাইন"
  },
  {
    "name": "Turag / Great Turag",
    "endpoints": "Jatrabari ↔ Tongi",
    "stops": [
      "Jatrabari",
      "Sayedabad",
      "Mugdapara",
      "Bashabo",
      "Khilgaon",
      "Malibagh Railgate",
      "Rampura Bazar",
      "Rampura Bridge",
      "Merul Badda",
      "Badda",
      "Uttar Badda",
      "Notun Bazar",
      "Nadda",
      "Bashundhara",
      "Kuril Bishwa Road",
      "Khilkhet",
      "Airport",
      "Jashimuddin (Uttara)",
      "Rajlakshmi",
      "Azampur",
      "House Building",
      "Abdullahpur",
      "Tongi"
    ],
    "nameBn": "তুরাগ"
  },
  {
    "name": "Ullash",
    "endpoints": "Gulistan ↔ Narayanganj",
    "stops": [
      "Gulistan",
      "Jatrabari",
      "Shonir Akhra",
      "Sign Board",
      "Jalkuri",
      "Shib Market",
      "Chashara",
      "Narayanganj"
    ],
    "nameBn": "উল্লাস"
  },
  {
    "name": "Victor Classic",
    "endpoints": "Sadarghat ↔ Diabari (Uttara)",
    "stops": [
      "Sadarghat",
      "Ray Saheb Bazar",
      "Naya Bazar",
      "Golap Shah Mazar",
      "GPO",
      "Paltan",
      "Kakrail",
      "Shantinagar",
      "Malibagh Moor",
      "Mouchak",
      "Malibagh Railgate",
      "Hazipara",
      "Rampura Bazar",
      "Rampura Bridge",
      "Merul Badda",
      "Badda",
      "Uttar Badda",
      "Shahjadpur",
      "Bashtola",
      "Notun Bazar",
      "Nadda",
      "Bashundhara",
      "Jamuna Future Park",
      "Kuril Bishwa Road",
      "Khilkhet",
      "Airport",
      "Jashimuddin (Uttara)",
      "Rajlakshmi",
      "Azampur",
      "House Building",
      "Diabari"
    ],
    "nameBn": "ভিক্টর ক্লাসিক"
  },
  {
    "name": "VIP 27",
    "endpoints": "Azimpur ↔ Gazipur Chourasta",
    "stops": [
      "Azimpur",
      "Nilkhet",
      "New Market",
      "City College",
      "Kalabagan",
      "Dhanmondi 27",
      "Khamar Bari",
      "Farmgate",
      "Jahangir Gate",
      "Mohakhali",
      "Banani",
      "Kakali",
      "Kuril Bishwa Road",
      "Khilkhet",
      "Airport",
      "Uttara",
      "Abdullahpur",
      "Tongi",
      "Board Bazar",
      "Gazipur Chourasta"
    ],
    "nameBn": "ভিআইপি ২৭"
  },
  {
    "name": "Welcome",
    "endpoints": "Gulistan ↔ Nandan Park",
    "stops": [
      "Gulistan",
      "Shahbag",
      "Science Lab",
      "Kalabagan",
      "Asad Gate",
      "Shyamoli",
      "Technical",
      "Gabtoli",
      "Amin Bazar",
      "Hemayetpur",
      "Savar",
      "Nobinagar",
      "Baipayl",
      "Zirani Bazar",
      "Nandan Park"
    ],
    "nameBn": "ওয়েলকাম"
  },
  {
    "name": "Winner",
    "endpoints": "Azimpur ↔ Kuril Bishwa Road",
    "stops": [
      "Azimpur",
      "City College",
      "Kalabagan",
      "Rasel Square",
      "Panthapath",
      "Bashundhara City",
      "Kawran Bazar",
      "Satrasta",
      "Tibbat",
      "Nabisco",
      "Mohakhali",
      "Wireless Gate",
      "Gulshan 1",
      "Badda",
      "Shahjadpur",
      "Notun Bazar",
      "Nadda",
      "Kuril Bishwa Road"
    ],
    "nameBn": "উইনার"
  }
];
