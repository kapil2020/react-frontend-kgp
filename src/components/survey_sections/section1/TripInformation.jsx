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
      "Ultadanga",
      "Belgachia",
      "Baranagar",
      "Bagbazar",
      "Cossipore",
      "Lake Town",
      "Nagerbazar",
      "Sinthee",
      "Shobhabazar",
      "Sonagachi",
      "Kumortuli",
      "Jorabagan",
      "Jorasanko",
      "Phoolbagan",
      "Chitpur",
      "Pathuriaghata",
      "Shyampukur",
      "Tala",
      "Burrabazar",
    ],
    "South Kolkata": [
      "Ballygunge",
      "Alipore",
      "New Alipore",
      "Bhawanipore",
      "Kalighat",
      "Gariahat",
      "Southern Avenue",
      "Jodhpur Park",
      "Lake Gardens",
      "South City",
      "Jadavpur",
      "Dhakuria",
      "Tollygunge",
      "Hazra",
      "Golf Green",
      "Prince Anwar Shah Road",
      "Garia",
      "Mukundapur",
      "Behala",
      "Barisha",
      "Chetla",
      "Lansdowne",
    ],
    "East Kolkata": [
      "Salt Lake (Bidhannagar)",
      "New Town (Rajarhat)",
      "Topsia",
      "Picnic Garden",
      "Tangra",
      "Tiljala",
      "Anandapur",
      "East Kolkata Township",
      "Panchasayar",
      "Madurdaha",
      "Nayabad",
      "Kalikapur",
      "Purbalok",
      "Ajoy Nagar",
      "Hiland Park",
      "Chak Garia",
      "Patuli",
    ],
    "Central Kolkata": [
      "Esplanade",
      "Park Street",
      "Chowringhee",
      "Maidan",
      "Victoria Memorial",
      "Park Circus",
      "Sealdah",
      "College Street",
      "Bowbazar",
      "Rabindra Sadan",
      "Princep Ghat",
      "Millennium Park",
      "B.B.D. Bagh (Dalhousie Square)",
      "Lalbazar",
      "Chandni Chowk",
      "Entally",
      "Janbazar",
      "Taltala",
      "Dharmatala",
      "Babughat",
      "Hastings",
      "Tiretti Bazaar",
      "Bow Barracks",
    ],
  };

  return (
    <section id="trip-info" className="py-4 ">
      {/* Origin Dropdown */}
      <label htmlFor="origin" className="block">
        Q.1 Select your typical origin location
        <span className="text-red-600">*</span>
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
        Q.2 Select your typical destination location
        <span className="text-red-600">*</span>
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
