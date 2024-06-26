const mongoose = require('mongoose');
const Concert = require('./models/Concerts');

mongoose.connect(process.env.MONGODB_URI)//to connect to db

const sampleConcerts = [//13
  {
    title: 'Drake & J. Cole - Its All a Blur Tour',
    date: new Date('2024-06-10'),
    location: 'Denver, San Antonio, Oklahoma City, New Orleans, LA Tampa, Nashville, St. Louis, Pittsburgh, olumbus, Cleveland, Buffalo, Kansas City, Memphis, Lexington, Belmont Park, State College, PA Sunrise, Birmingham, AL',
    artist: 'Drake, J. Cole',
    cover:'uploads/drake-all-blur-tour.jpg'
  },
  {
    title: 'Nicki Minaj - Pink Friday 2 World Tour',
    date: new Date('2024-05-01'),
    location: 'Various cities across North America and Europe',
    artist: 'Nicki Minaj',
    cover:'uploads/Nicki_Minaj_-_Pink_Friday_2.png'
  },
  {
    title: 'Doja Cat - The Scarlet Tour (European Leg)',
    date: new Date('2024-06-15'),
    location: 'Various cities across Europe',
    artist: 'Doja Cat',
    cover:'uploads/doja-cat.jpg'
  },
  {
    title: 'Travis Scott - Circus Maximus Tour',
    date: new Date('2024-07-01'),
    location: 'Various US cities and Europe',
    artist: 'Travis Scott',
    cover:'uploads/travis-scott-tour-tgj.jpeg'
  },
  {
    title: 'Future One Big Party Tour',
    date: new Date('2024-07-05'),
    location: 'Various US cities',
    artist: 'Future',
    cover:'uploads/future-tour-poster-2023-billboard-1240.webp'
  },
  {
    title: 'Childish Gambino',
    date: new Date('2024-07-10'),
    location: 'Various US cities',
    artist: 'Childish Gambino',
    cover:'uploads/LA_Childish_Gambino_2_72.jpg'
  },
  {
    title: 'Tyler, The Creator - Festivals',
    date: new Date('2024-10-01'),
    location: 'Various US cities',
    artist: 'Tyler, The Creator',
    cover:'uploads/2015FestivalBigPic_tylerthecreator_Coachella_pg-6170915-1.jpg'
  },
  {
    title: 'Masters of Ceremony with Pusha T, Ja Rule, Fabolous, DaBaby and more',
    date: new Date('2024-06-29'),
    location: 'Brooklyn, NY',
    artist: 'Pusha T, Ja Rule, Fabolous, DaBaby',
    cover:'uploads/Pusha-T.webp'
  },
  {
    title: 'Vince Staples - Black In Europa Tour',
    date: new Date('2024-06-11'),
    location: 'Berlin, Germany',
    artist: 'Vince Staples',
    cover:'uploads/vince-staples-2024-tour-uk-696x442.jpg'
  },
  {
    title: 'Killer Mike - The Down By Law Tour',
    date: new Date('2024-08-23'),
    location: 'London, UK',
    artist: 'Killer Mike',
    cover:'uploads/Killer+Mike+by+Jonathan+Mannion.jpg'
  },
  {
    title: 'Nas',
    date: new Date('2024-10-24'),
    location: 'Stockholm, Sweden',
    artist: 'Nas',
    cover:'uploads/Nas-tour.jpg'
  },
  {
    title: 'PARTYNEXTDOOR',
    date: new Date('2024-10-25'),
    location: 'Stockholm, Sweden',
    artist: 'PARTYNEXTDOOR',
    cover:'uploads/Sat_KennyAllstar_Main_VF-0073+(1).jpg'
  },
  {
    title: 'Noname',
    date: new Date('2024-07-01'),
    location: 'Leeds, UK',
    artist: 'Noname',
    cover:'uploads/NONAME_3.jpg'
  }  
];

const insertSampleData = async () => {
  try {
    await Concert.deleteMany({});
    await Concert.insertMany(sampleConcerts);
    console.log('Sample data inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting sample data:', error);
    mongoose.connection.close();
  }
};

insertSampleData();
