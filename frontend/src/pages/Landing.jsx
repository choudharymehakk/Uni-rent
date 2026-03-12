import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import Navbar from "../components/Navbar";

function Landing() {
  useReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero-bg">
        <div className="hero-card">
          <h1 className="floating-title">
            Rent smarter.<br />Share easier.
          </h1>

          <p className="floating-subtitle">
            UniRent is a student-first peer-to-peer rental platform that helps
            you access essentials without owning them.
          </p>



          <div className="hero-actions">
            <Link to="/signup" className="btn primary">Get Started</Link>
            <Link to="/dashboard" className="btn ghost">View Listings</Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about">
        <h2>About UniRent</h2>

        <p style={{ maxWidth: "700px", margin: "20px auto", color: "#aaa" }}>
          UniRent is a student-driven rental marketplace that connects
          university students who want to rent, lend, and share everyday
          essentials.
          <br /><br />
          By enabling peer-to-peer rentals within campuses, UniRent helps
          students save money, reduce waste, and access items easily without
          needing to buy them.
        </p>
      </section>

      {/* WHY CHOOSE */}
      <section className="section why">
        <h2>Why Choose UniRent?</h2>

        <div className="card-grid">

          <div className="info-card reveal">
            <h3>🎓 Campus Exclusive</h3>
            <p>
              A closed marketplace only for students — safer and more
              trustworthy.
            </p>
          </div>

          <div className="info-card reveal">
            <h3>💰 Affordable Access</h3>
            <p>
              Get what you need without paying the full ownership cost.
            </p>
          </div>

          <div className="info-card reveal">
            <h3>♻️ Smart Sharing Economy</h3>
            <p>
              Reduce waste and promote reuse within your campus community.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how">
        <h2>How UniRent Works</h2>

        <div className="steps">

          <div className="step-card reveal">
            <span>01</span>
            <h3>Create Your Account</h3>
            <p>
              Sign up using your student details and join the UniRent community
              within your campus.
            </p>
          </div>

          <div className="step-card reveal">
            <span>02</span>
            <h3>Rent or List Items</h3>
            <p>
              Browse available items posted by other students or list your own
              items to earn extra money.
            </p>
          </div>

          <div className="step-card reveal">
            <span>03</span>
            <h3>Use & Return</h3>
            <p>
              Pick up the item, use it when needed, and return it after the
              rental period ends.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start Renting Today</h2>

        <p style={{ color: "#aaa" }}>
          Join UniRent and start sharing resources within your campus.
        </p>

        <div className="hero-actions">
          <Link to="/signup" className="btn primary">Get Started</Link>
          <Link to="/login" className="btn ghost">Login</Link>
        </div>
      </section>

    </>
  );
}

export default Landing;