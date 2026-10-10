import { useEffect, useState } from "react";

function OwnerBookings({ onBack }) {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {

    const savedUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );

    if (!savedUser) {
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8080/api/bookings/owner/${savedUser.email}`
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
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateBookingStatus = async (id, action) => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/bookings/${id}/${action}`,
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      alert(
        action === "approve"
          ? "Booking approved successfully!"
          : "Booking rejected successfully!"
      );

      loadBookings();

    } catch (error) {

      console.error(error);
      alert("Unable to update booking.");

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
          📋 Booking Requests
        </h1>

        <p>
          Manage booking requests for your resources
        </p>

      </div>

      {loading ? (

        <p className="no-bookings">
          Loading booking requests...
        </p>

      ) : bookings.length === 0 ? (

        <p className="no-bookings">
          No booking requests for your resources.
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
                  👤 Requested by: {booking.name}
                </p>

                <p>
                  📞 Phone: {booking.phone}
                </p>

                <p>
                  📅 From: {booking.startDate}
                </p>

                <p>
                  📅 To: {booking.endDate}
                </p>

                {booking.message && (
                  <p>
                    💬 Message: {booking.message}
                  </p>
                )}

                <p>
                  📌 Status: {booking.status}
                </p>

              </div>

              <div className="booking-status">

                {booking.status === "PENDING" && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "approve"
                        )
                      }
                    >
                      ✅ Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "reject"
                        )
                      }
                    >
                      ❌ Reject
                    </button>
                  </>
                )}

                {booking.status === "APPROVED" && (
  <>
    <span className="approved-status">
      ✅ Approved
    </span>

    <button
      className="return-btn"
      onClick={() =>
        updateBookingStatus(
          booking.id,
          "return"
        )
      }
    >
      ↩️ Mark as Returned
    </button>
  </>
)}

{booking.status === "RETURNED" && (
  <>
    <span className="approved-status">
      ↩️ Resource Returned
    </span>

    <button
      className="return-btn"
      onClick={() =>
        updateBookingStatus(
          booking.id,
          "complete"
        )
      }
    >
      ✅ Mark as Completed
    </button>
  </>
)}

{booking.status === "REJECTED" && (
  <span className="rejected-status">
    ❌ Rejected
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

export default OwnerBookings;
