function OwnerDashboard({ onBack, onBookingRequests, onMyResources }) {
  return (
    <div className="profile-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Home
      </button>

      <div className="profile-card">

        <div className="profile-icon">🏠</div>

        <h1>Owner Dashboard</h1>

        <p className="profile-subtitle">
          Manage your resources and booking requests
        </p>

        {/* ONE BOOKING REQUEST BUTTON */}
        <button
          className="edit-profile-btn"
          onClick={onBookingRequests}
        >
          📋 Booking Requests
        </button>

        {/* MY RESOURCES */}
        <button
          className="edit-profile-btn"
          onClick={onMyResources}
        >
          📦 My Resources
        </button>

        <button
          className="logout-btn"
          onClick={onBack}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default OwnerDashboard;