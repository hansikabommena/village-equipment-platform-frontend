import { useState } from "react";

function Booking({ resource, onBack }) {
  const savedUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const [name, setName] = useState(savedUser?.name || "");
  const [phone, setPhone] = useState(savedUser?.phone || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!name || !phone || !startDate || !endDate) {
      alert("Please fill all required details.");
      return;
    }

    // Phone number validation
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Start date validation
    if (
      new Date(startDate) <
      new Date().setHours(0, 0, 0, 0)
    ) {
      alert("Start date cannot be in the past.");
      return;
    }

    // End date validation
    if (new Date(startDate) > new Date(endDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    const bookingData = {
      resourceId: resource.id,
      resourceName: resource.name,
      name: name,
      phone: phone,
      startDate: startDate,
      endDate: endDate,
      message: message
    };

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookingData)
        }
      );

      // Duplicate / overlapping booking
      if (!response.ok) {
        alert(
          "This resource is already booked for the selected dates."
        );
        return;
      }

      await response.json();

      setSubmitted(true);

    } catch (error) {
      console.error(error);
      alert("Unable to connect to the backend.");

    } finally {
      setLoading(false);
    }
  };

  // Booking successful
  if (submitted) {
    return (
      <div className="booking-page">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Booking Request Sent!
          </h1>

          <p>
            Your booking request for
            <strong> {resource.name} </strong>
            has been sent successfully.
          </p>

          <div className="success-booking-details">

            <p>
              📦 Resource:{" "}
              <strong>{resource.name}</strong>
            </p>

            <p>
              📅 From:{" "}
              <strong>{startDate}</strong>
            </p>

            <p>
              📅 To:{" "}
              <strong>{endDate}</strong>
            </p>

            <p>
              📌 Status: <strong>PENDING</strong>
            </p>

          </div>

          <p className="success-info">
            The resource owner will review your
            request and respond soon.
          </p>

          <button
            className="back-home-btn"
            onClick={onBack}
          >
            ← Back to Resource
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="booking-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Resource
      </button>

      <div className="booking-card">

        <h1>
          Request Booking
        </h1>

        <div className="booking-resource">

          <img
            src={resource.image}
            alt={resource.name}
          />

          <div>

            <h2>
              {resource.icon} {resource.name}
            </h2>

            <p>
              📍 {resource.location}
            </p>

            <p className="booking-price">
              ₹{resource.price} / day
            </p>

          </div>

        </div>

        <hr />

        <h3>
          Booking Details
        </h3>

        <form onSubmit={handleBooking}>

          {/* Name */}
          <label>
            Your Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            readOnly
          />

          {/* Phone */}
          <label>
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          {/* Dates */}
          <div className="date-row">

            <div>

              <label>
                Start Date
              </label>

              <input
                type="date"
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />

            </div>

            <div>

              <label>
                End Date
              </label>

              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
              />

            </div>

          </div>

          {/* Message */}
          <label>
            Message
          </label>

          <textarea
            placeholder="Enter any additional request..."
            rows="4"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          ></textarea>

          {/* Submit */}
          <button
            type="submit"
            className="confirm-booking-btn"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Request Booking"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Booking;