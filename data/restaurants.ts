export interface Restaurant {
    id: string;
    name: string;
    address: string;
    city: string;
    canton: string;
    openingHours: string;
    lat: number;
    lng: number;
    placeId: string;
  }
  
  export const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Halal Delight',
      address: '123 Rue du Rhône',
      city: 'Geneva',
      canton: 'Geneva',
      openingHours: 'Mon-Sat: 11:00-22:00, Sun: Closed',
      lat: 46.2043907,
      lng: 6.1431577,
      placeId: 'ChIJ3fFTb9Yjr0cRn1gTa1V9_Eo'
    },
    {
      id: '2',
      name: 'Kebab Palace',
      address: '456 Bahnhofstrasse',
      city: 'Zurich',
      canton: 'Zurich',
      openingHours: 'Mon-Sun: 10:00-23:00',
      lat: 47.3769,
      lng: 8.5417,
      placeId: 'ChIJe2d4qnMKkEcRQHQqoHvKwv0'
    },
    {
      id: '3',
      name: 'Moroccan Oasis',
      address: '789 Marktgasse',
      city: 'Bern',
      canton: 'Bern',
      openingHours: 'Tue-Sun: 12:00-22:30, Mon: Closed',
      lat: 46.9480,
      lng: 7.4474,
      placeId: 'ChIJ02_G-pQ_xkcR-o_e_s_s_00'
    },
    {
      id: '4',
      name: 'Turkish Delights',
      address: '101 Centralbahnplatz',
      city: 'Basel',
      canton: 'Basel-Stadt',
      openingHours: 'Mon-Sat: 11:30-21:00, Sun: 12:00-20:00',
      lat: 47.5476,
      lng: 7.5890,
      placeId: 'ChIJb9_a-f8_xkcR7o_e_s_s_00'
    },
    {
      id: '5',
      name: 'Halal Haven',
      address: '202 Via Nassa',
      city: 'Lugano',
      canton: 'Ticino',
      openingHours: 'Mon-Sun: 11:00-22:00',
      lat: 46.0037,
      lng: 8.9511,
      placeId: 'ChIJ-z_a-f8_xkcR7o_e_s_s_00'
    },
    {
      id: '6',
      name: 'Spice of Arabia',
      address: '303 Rue de Lausanne',
      city: 'Geneva',
      canton: 'Geneva',
      openingHours: 'Mon-Sun: 11:30-23:00',
      lat: 46.2189,
      lng: 6.1480,
      placeId: 'ChIJ-z_b-f8_xkcR7o_f_s_s_00'
    },
    {
      id: '7',
      name: 'Halal Grill House',
      address: '404 Langstrasse',
      city: 'Zurich',
      canton: 'Zurich',
      openingHours: 'Mon-Sun: 12:00-00:00',
      lat: 47.3782,
      lng: 8.5308,
      placeId: 'ChIJ-z_c-f8_xkcR7o_g_s_s_00'
    },
    {
      id: '8',
      name: 'Aladdin\'s Feast',
      address: '505 Spitalgasse',
      city: 'Bern',
      canton: 'Bern',
      openingHours: 'Mon-Sat: 11:00-22:00, Sun: 12:00-21:00',
      lat: 46.9479,
      lng: 7.4446,
      placeId: 'ChIJ-z_d-f8_xkcR7o_h_s_s_00'
    },
    {
      id: '9',
      name: 'Mecca Bites',
      address: '606 Freie Strasse',
      city: 'Basel',
      canton: 'Basel-Stadt',
      openingHours: 'Mon-Sun: 10:30-22:30',
      lat: 47.5584,
      lng: 7.5865,
      placeId: 'ChIJ-z_e-f8_xkcR7o_i_s_s_00'
    },
    {
      id: '10',
      name: 'Halal Corner',
      address: '707 Piazza Riforma',
      city: 'Lugano',
      canton: 'Ticino',
      openingHours: 'Mon-Sat: 11:00-23:00, Sun: 12:00-22:00',
      lat: 46.0037,
      lng: 8.9511,
      placeId: 'ChIJ-z_f-f8_xkcR7o_j_s_s_00'
    },
    {
      id: '11',
      name: 'Saffron Delights',
      address: '808 Quai du Mont-Blanc',
      city: 'Geneva',
      canton: 'Geneva',
      openingHours: 'Mon-Sun: 11:00-23:30',
      lat: 46.2076,
      lng: 6.1484,
      placeId: 'ChIJ-z_g-f8_xkcR7o_k_s_s_00'
    },
    {
      id: '12',
      name: 'Halal Express',
      address: '909 Niederdorfstrasse',
      city: 'Zurich',
      canton: 'Zurich',
      openingHours: 'Mon-Sun: 10:00-00:00',
      lat: 47.3725,
      lng: 8.5443,
      placeId: 'ChIJ-z_h-f8_xkcR7o_l_s_s_00'
    }
  ];
  
  