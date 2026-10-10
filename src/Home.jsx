import { useState, useRef, useEffect } from "react";

import logo from "./assets/logo.png";

import ResourceDetails from "./ResourceDetails";
import Booking from "./Booking";
import MyBookings from "./MyBookings";
import AddResource from "./AddResource";

import tractor1 from "./assets/tractor1.png";
import tractor2 from "./assets/tractor2.png";
import tractor3 from "./assets/tractor3.png";
import tractor4 from "./assets/tractor4.png";
import tractor5 from "./assets/tractor5.png";

import sprayer1 from "./assets/sprayer1.png";
import sprayer2 from "./assets/sprayer2.png";
import sprayer3 from "./assets/sprayer3.png";
import sprayer4 from "./assets/sprayer4.png";
import sprayer5 from "./assets/sprayer5.png";

import tanker1 from "./assets/tanker1.png";
import tanker2 from "./assets/tanker2.png";
import tanker3 from "./assets/tanker3.png";
import tanker4 from "./assets/tanker4.png";
import tanker5 from "./assets/tanker5.png";

import harvester1 from "./assets/harvester1.png";
import harvester2 from "./assets/harvester2.png";
import harvester3 from "./assets/harvester3.png";
import harvester4 from "./assets/harvester4.png";
import harvester5 from "./assets/harvester5.png";

import tools1 from "./assets/tools1.png";
import tools2 from "./assets/tools2.png";
import tools3 from "./assets/tools3.png";
import tools4 from "./assets/tools4.png";
import tools5 from "./assets/tools5.png";

import hall1 from "./assets/hall1.png";
import hall2 from "./assets/hall2.png";
import hall3 from "./assets/hall3.png";
import hall4 from "./assets/hall4.png";
import hall5 from "./assets/hall5.png";


function Home({
  onProfile,
  onLogout,
  onOwnerBookings,
  onOwnerDashboard,
  onAdminDashboard
}) {

  const savedUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingResource, setBookingResource] = useState(null);

  const [showBookings, setShowBookings] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);

  const resourcesRef = useRef(null);

  const [resources, setResources] = useState([]);


  /* =========================
     LOAD RESOURCES FROM BACKEND
  ========================= */

  useEffect(() => {

    fetch("http://localhost:8080/api/resources")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        return response.json();

      })

      .then((data) => {

        console.log(
          "Resources from backend:",
          data
        );

        setResources(data);

      })

      .catch((error) => {

        console.error(
          "Error loading resources:",
          error
        );

      });

  }, []);


  /* =========================
     GET CATEGORY IMAGES
     5 IMAGES FOR EACH CATEGORY
  ========================= */

  const getResourceImage = (
    resource,
    currentIndex
  ) => {

    const category = resource.category;

    const sameCategoryCount = resources
      .slice(0, currentIndex)
      .filter(
        (item) =>
          item.category === category
      ).length;

    const imageIndex =
      sameCategoryCount % 5;


    if (category === "Tractor") {

      const images = [
        tractor1,
        tractor2,
        tractor3,
        tractor4,
        tractor5
      ];

      return images[imageIndex];
    }


    if (category === "Sprayer") {

      const images = [
        sprayer1,
        sprayer2,
        sprayer3,
        sprayer4,
        sprayer5
      ];

      return images[imageIndex];
    }


    if (category === "Tanker") {

      const images = [
        tanker1,
        tanker2,
        tanker3,
        tanker4,
        tanker5
      ];

      return images[imageIndex];
    }


    if (category === "Harvester") {

      const images = [
        harvester1,
        harvester2,
        harvester3,
        harvester4,
        harvester5
      ];

      return images[imageIndex];
    }


    if (category === "Tools") {

      const images = [
        tools1,
        tools2,
        tools3,
        tools4,
        tools5
      ];

      return images[imageIndex];
    }


    if (category === "Hall") {

      const images = [
        hall1,
        hall2,
        hall3,
        hall4,
        hall5
      ];

      return images[imageIndex];
    }


    return tractor1;
  };


  /* =========================
     FILTER RESOURCES
  ========================= */

  const filteredResources =
    resources.filter((resource) => {

      const categoryMatch =
        selectedCategory === "All" ||
        resource.category ===
          selectedCategory;

      const searchMatch =
        resource.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        categoryMatch &&
        searchMatch
      );

    });


  /* =========================
     CATEGORIES
  ========================= */

  const categories = [
    "All",
    "Tractor",
    "Sprayer",
    "Tanker",
    "Harvester",
    "Tools",
    "Hall"
  ];


  const handleCategory = (
    category
  ) => {

    setSelectedCategory(category);
    setSearch("");

  };


  /* =========================
     SCROLL TO RESOURCES
  ========================= */

  const scrollToResources = () => {

    resourcesRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  };


  /* =========================
     ADD RESOURCE PAGE
  ========================= */

  if (showAddResource) {

    return (

      <AddResource

        onBack={() =>
          setShowAddResource(false)
        }

        onAddResource={(newResource) => {

          setResources(
            (previousResources) => [
              ...previousResources,
              newResource
            ]
          );

          setShowAddResource(false);

        }}

      />

    );

  }


  /* =========================
     MY BOOKINGS PAGE
  ========================= */

  if (showBookings) {

    return (

      <MyBookings

        onBack={() =>
          setShowBookings(false)
        }

      />

    );

  }


  /* =========================
     BOOKING PAGE
  ========================= */

  if (bookingResource) {

    return (

      <Booking

        resource={bookingResource}

        onBack={() =>
          setBookingResource(null)
        }

      />

    );

  }


  /* =========================
     RESOURCE DETAILS
  ========================= */

  if (selectedResource) {

    return (

      <ResourceDetails

        resource={selectedResource}

        onBack={() =>
          setSelectedResource(null)
        }

        onBooking={() => {

          setSelectedResource(null);

          setBookingResource(
            selectedResource
          );

        }}

      />

    );

  }


  return (

    <div className="home-page">


      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="logo-section">

          <img
  src="/logo.png"
  alt="Village Equipment"
  className="logo-image"
/>

<span className="logo-text">
  Village Equipment
</span>

        </div>


        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="nav-actions">


          {/* ADD RESOURCE */}

          {savedUser?.role === "OWNER" && (

            <button
              onClick={() =>
                setShowAddResource(true)
              }
            >
              + Add Resource
            </button>

          )}


          {/* MY BOOKINGS */}

          <button
            onClick={() =>
              setShowBookings(true)
            }
          >
            My Bookings
          </button>


          {/* PROFILE */}

          <button
            onClick={onProfile}
          >
            👤 Profile
          </button>


          {/* OWNER DASHBOARD */}

          {savedUser?.role === "OWNER" && (

            <button
              onClick={onOwnerDashboard}
            >
              🏠 Owner Dashboard
            </button>

          )}


          {/* ADMIN DASHBOARD */}

          {savedUser?.role === "ADMIN" && (

            <button
              onClick={onAdminDashboard}
            >
              👨‍💼 Admin Dashboard
            </button>

          )}


          {/* LOGOUT - LAST BUTTON */}

          <button
            className="logout-nav-btn"
            onClick={() => {

              localStorage.removeItem(
                "loggedInUser"
              );

              onLogout();

            }}
          >
            🚪 Logout
          </button>


        </div>

      </nav>


      {/* =========================
          CATEGORY BAR
      ========================= */}

      <div className="category-bar">

        {categories.map(
          (category) => (

            <button
              key={category}

              className={
                selectedCategory === category
                  ? "active-category"
                  : ""
              }

              onClick={() =>
                handleCategory(category)
              }
            >

              {category === "All" &&
                "🏠 "}

              {category === "Tractor" &&
                "🚜 "}

              {category === "Sprayer" &&
                "🌱 "}

              {category === "Tanker" &&
                "💧 "}

              {category === "Harvester" &&
                "🌾 "}

              {category === "Tools" &&
                "🛠️ "}

              {category === "Hall" &&
                "🏢 "}

              {category}

            </button>

          )
        )}

      </div>


      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <h1>

            Share Resources.

            <br />

            Grow Together.

          </h1>


          <p>

            Find and share useful equipment
            and resources within your village.

          </p>


          <button
            className="hero-btn"
            onClick={scrollToResources}
          >

            Explore Resources →

          </button>

        </div>


        <div className="hero-image">

          <img
            src={logo}
            alt="VillageShare Logo"
          />

        </div>

      </section>


      {/* =========================
          RESOURCE SECTION
      ========================= */}

      <section
        className="resources-section"
        ref={resourcesRef}
      >


        <div className="section-heading">

          <div>

            <h2>
              Available Resources
            </h2>

            <p>
              Find equipment and resources
              available near you
            </p>

          </div>


          <span className="resource-count">

            {filteredResources.length}
            {" "}
            Resources

          </span>

        </div>


        {filteredResources.length === 0 ? (

          <div className="no-results">

            <h2>
              No Resources Found
            </h2>

            <p>
              Try another search or category.
            </p>

          </div>

        ) : (

          <div className="resource-grid">

            {filteredResources.map(
              (resource, index) => (

                <div
                  className="resource-card"
                  key={
                    resource.id
                      ? resource.id
                      : `${resource.name}-${index}`
                  }
                >


                  {/* RESOURCE IMAGE */}

                  <div className="resource-image">

                    <img
                      src={
                        resource.image
                          ? resource.image
                          : getResourceImage(
                              resource,
                              resources.indexOf(
                                resource
                              )
                            )
                      }
                      alt={resource.name}
                    />

                  </div>


                  {/* RESOURCE INFORMATION */}

                  <div className="resource-info">

                    <h3>

                      {resource.category ===
                        "Tractor"
                        ? "🚜"
                        : resource.category ===
                          "Sprayer"
                        ? "🌱"
                        : resource.category ===
                          "Tanker"
                        ? "💧"
                        : resource.category ===
                          "Harvester"
                        ? "🌾"
                        : resource.category ===
                          "Tools"
                        ? "🛠️"
                        : "🏠"}

                      {" "}

                      {resource.name}

                    </h3>


                    <p>

                      📍 {resource.location}

                    </p>


                    <p className="owner-name">

                      👤 {resource.owner}

                    </p>


                    <div className="resource-bottom">

                      <span className="price">

                        ₹{resource.price}

                        <small>
                          {" "}
                          / day
                        </small>

                      </span>


                      <button
                        className="details-btn"
                        onClick={() =>
                          setSelectedResource(
                            resource
                          )
                        }
                      >

                        View Details

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <div>

          <h2>
            🌾 VillageShare
          </h2>

          <p>
            Connecting villages through
            resource sharing.
          </p>

        </div>


        <div>

          <h3>
            Quick Links
          </h3>

          <p
            onClick={scrollToResources}
          >
            Browse Resources
          </p>


          <p
            onClick={() =>
              setShowAddResource(true)
            }
          >
            Add Resource
          </p>


          <p
            onClick={() =>
              setShowBookings(true)
            }
          >
            My Bookings
          </p>

        </div>


        <div>

          <h3>
            Contact
          </h3>

          <p>
            📧 support@villageshare.com
          </p>

          <p>
            📱 +91 9876543210
          </p>

        </div>

      </footer>

    </div>

  );

}


export default Home;