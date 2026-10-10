import { useEffect, useState } from "react";

function MyBookings({ onBack }) {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const savedUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );

    if (!savedUser) {
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8080/api/bookings/user/${savedUser.name}`
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        return response.json();
      })
      .then((data) => {

        setBookings(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(error);
        setLoading(false);

      });

  }, []);

  // CANCEL BOOKING
  const cancelBooking = async (bookingId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText || "Unable to cancel booking.");
        return;
      }

      const updatedBooking = await response.json();

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === updatedBooking.id
            ? updatedBooking
            : booking
        )
      );

      alert("Booking cancelled successfully.");

    } catch (error) {

      console.error(error);
      alert("Unable to connect to the backend.");

    }
  };

  return (
    <div className="bookings-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Home
      </button>

      <div className="bookings-header">

        <h1>
          My Bookings
        </h1>

        <p>
          Track your resource booking requests
        </p>

      </div>

      {loading ? (

        <p className="no-bookings">
          Loading bookings...
        </p>

      ) : bookings.length === 0 ? (

        <p className="no-bookings">
          No bookings found.
        </p>

      ) : (

        <div className="bookings-list">

          {bookings.map((booking) => (

            <div
              className="booking-list-card"
              key={booking.id}
            >

              <div className="booking-info">

                <h2>
                  {booking.resourceName}
                </h2>

                <p>
                  👤 {booking.name}
                </p>

                <p>
                  📱 {booking.phone}
                </p>

                <p>
                  📅 {booking.startDate}
                  {" → "}
                  {booking.endDate}
                </p>

                {booking.message && (
                  <p>
                    💬 {booking.message}
                  </p>
                )}

              </div>

              <div className="booking-status">

                {booking.status === "PENDING" && (
                  <>
                    <span>
                      🟡 Waiting for Owner Approval
                    </span>

                    <button
                      className="cancel-booking-btn"
                      onClick={() =>
                        cancelBooking(booking.id)
                      }
                    >
                      ❌ Cancel Booking
                    </button>
                  </>
                )}

                {booking.status === "APPROVED" && (
                  <span>
                    🟢 Booking Confirmed
                  </span>
                )}

                {booking.status === "REJECTED" && (
                  <span>
                    🔴 Booking Rejected
                  </span>
                )}

                {booking.status === "CANCELLED" && (
                  <span>
                    ⚪ Booking Cancelled
                  </span>
                )}

                {booking.status === "RETURNED" && (
                  <span>
                    ↩️ Resource Returned
                  </span>
                )}

                {booking.status === "COMPLETED" && (
                  <span>
                    ✅ Booking Completed
                  </span>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyBookings;