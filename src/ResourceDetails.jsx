import tractor1 from "./assets/tractor1.png";
import sprayer1 from "./assets/sprayer1.png";
import tanker1 from "./assets/tanker1.png";
import harvester1 from "./assets/harvester1.png";
import tools1 from "./assets/tools1.png";
import hall1 from "./assets/hall1.png";

function ResourceDetails({ resource, onBack, onBooking }) {

  const getResourceImage = () => {
    // If database has an image, use it
    if (resource.image) {
      return resource.image;
    }

    // Otherwise use image according to category
    if (resource.category === "Tractor") {
      return tractor1;
    }

    if (resource.category === "Sprayer") {
      return sprayer1;
    }

    if (resource.category === "Tanker") {
      return tanker1;
    }

    if (resource.category === "Harvester") {
      return harvester1;
    }

    if (resource.category === "Tools") {
      return tools1;
    }

    if (resource.category === "Hall") {
      return hall1;
    }

    return tractor1;
  };

  return (
    <div className="details-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Resources
      </button>

      <div className="details-card">

        {/* RESOURCE IMAGE */}
        <div className="details-image">
          <img
            src={getResourceImage()}
            alt={resource.name}
          />
        </div>

        {/* RESOURCE DETAILS */}
        <div className="details-content">

          <h1>
            {resource.icon} {resource.name}
          </h1>

          <p className="details-location">
            📍 {resource.location}
          </p>

          <p className="details-owner">
            👤 Owner: {resource.owner}
          </p>

          <div className="details-price">
            ₹{resource.price}
            <span> / day</span>
          </div>

          <hr />

          <h3>
            Resource Information
          </h3>

          <p>
            This resource is available for sharing
            with people in nearby villages.
            You can request this resource by
            selecting your required booking dates.
          </p>

          <button
            className="booking-btn"
            onClick={onBooking}
          >
            Request Booking
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResourceDetails;