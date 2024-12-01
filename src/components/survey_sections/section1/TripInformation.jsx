import React from "react";

const TripInformation = ({ setOrigin, setDestination }) => {
  // const
  const originOptions = {
    "North Kolkata": [
      "Dum Dum",
      "Shyambazar",
      "Hatibagan",
      "Maniktala",
      "Kankurgachi",
      "Rajabazar",
      "Shobhabazar",
      "Shyampukur",
      "Tala",
      "Sonagachi",
      "Kumortuli",
      "Bagbazar",
      "Jorabagan",
      "Burrabazar",
      "Jorasanko",
      "Phoolbagan",
      "Ultadanga",
      "Chitpur",
      "Nagerbazar",
      "Lake Town",
      "Bangur Avenue",
      "Pathuriaghata",
      "Cossipore",
      "Belgachia",
      "Sinthee",
      "Baranagar",
    ],
    "South Kolkata": [
      "Ballygunge",
      "Alipore",
      "New Alipore",
      "Lansdowne",
      "Bhawanipore",
      "Kalighat",
      "Gariahat",
      "Southern Avenue",
      "Chetla",
      "Jodhpur Park",
      "Lake Gardens",
      "South City",
      "Jadavpur",
      "Dhakuria",
      "Tollygunge",
    ],
    "East Kolkata": [
      "Topsia",
      "Picnic Garden",
      "Tangra",
      "Gobra",
      "Kustia",
      "Tiljala",
      "Anandapur",
      "East Kolkata Twp",
      "Panchasayar",
      "Garia",
      "Madurdaha",
      "Nayabad",
      "Kalikapur",
      "Purbalok",
      "Mukundapur",
      "Ajoy Nagar",
      "Hiland Park",
      "Chak Garia",
      "Patuli",
      "Newtown",
    ],
    "Central Kolkata": [
      "West Bengal Secretariat",
      "General Post Office",
      "Reserve Bank of India",
      "High Court",
      "Lalbazar Police Headquarters",
      "Esplanade",
      "Park Street",
      "Chowringhee",
      "Camac Street",
      "Wood Street",
      "Loudon Street",
      "Shakespeare Sarani",
      "A. J. C. Bose Road",
      "Maidan",
      "Victoria Memorial",
      "Kolkata Race Course",
      "Park Circus",
      "Sealdah",
      "Beliaghata",
      "College Street",
      "Burrabazar",
      "Bowbazar",
      "Taltala",
      "Janbazar",
      "Entally",
      "Chandni Chowk",
      "Lalbazar",
      "Chowringhee",
      "Dharmatala",
      "Rabindra Sadan",
      "Tiretti Bazaar",
      "Bow Barracks",
      "Babughat",
      "Princep Ghat",
      "Hastings",
      "Millennium Park",
    ],
  };

  return (
    <section id="trip-info" className="py-4 ">
      {/* Origin Dropdown */}
      <label htmlFor="origin" className="block">
        Q.1 Select your typical origin location:
      </label>
      <select
        id="origin"
        className="border rounded w-full mt-2 p-2"
        onChange={(e) => setOrigin(e.target.value)}
      >
        <option value="" disabled selected>
          Select your origin location
        </option>
        {Object.keys(originOptions).map((region) => (
          <optgroup label={region} key={region}>
            {originOptions[region].map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Destination Dropdown */}
      <label htmlFor="destination" className="block mt-4">
        Q.2 Select your typical destination location:
      </label>
      <select
        id="destination"
        className="border rounded w-full mt-2 p-2"
        onChange={(e) => setDestination(e.target.value)}
      >
        <option value="" disabled selected>
          Select your destination location
        </option>
        {Object.keys(originOptions).map((region) => (
          <optgroup label={region} key={region}>
            {originOptions[region].map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </section>
  );
};

export default TripInformation;
