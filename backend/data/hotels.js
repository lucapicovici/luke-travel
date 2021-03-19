const hotels = [
  {
    name: "Dorsett City London",
    type: "Hotel",
    address: "9 Aldgate High Street, City of London, London, EC3N 1AH, United Kingdom",
    images: [
        {src: "https://r-cf.bstatic.com/images/hotel/max1280x900/130/130867441.jpg"},
        {src: "https://r-cf.bstatic.com/images/hotel/max1280x900/245/245147790.jpg"}
    ],
    description: "Featuring a garden and views of city, Dorsett City London is a 4-star hotel set in London, an 8-minute walk from Sky Garden. Among the facilities at this property are a 24-hour front desk and a business centre, along with free Wi-Fi throughout the property. The on-site restaurant serves Chinese cuisine.",
    amenities: [
        "Wi-fi",
        "Hotel Bar",
        "Fitness Center",
        "Restaurant"
    ],
    rating: 4,
    roomTypes: [
      {
        name: "Superior Double Room",
        beds: "1 large double bed",
        peopleCount: 2,
        availableRooms: 7,
        facilities: [
            "22 m^2",
            "Air conditioning",
            "Minibar",
            "Soundproofing",
            "Wi-Fi",
            "Private bathroom"
        ],
        images: [
            {src: "https://r-cf.bstatic.com/images/hotel/max1280x900/186/186450237.jpg"}
        ],
        price: 139
      },
      {
        name: "Deluxe room",
        beds: "1 large double bed",
        peopleCount: 2,
        availableRooms: 5,
        facilities: [
            "22 m^2",
            "Landmark view",
            "City view",
            "Air conditioning",
            "Minibar",
            "Soundproofing",
            "Wi-Fi",
            "Private bathroom"
        ],
        images: [
            {src: "https://r-cf.bstatic.com/images/hotel/max1280x900/130/130867441.jpg"}
        ],
        price: 169
      }
    ]
  },
];

export default hotels;