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
          <h1>
            Rent smarter.<br />Share easier.
          </h1>

          <p>
            Uni-Rent is a student-first peer-to-peer rental platform that helps
            you access essentials without owning them.
          </p>

          <div className="hero-actions">
            <button className="btn primary">Get Started</button>
            <button className="btn ghost">View Listings</button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
<section className="section about">
  <h2>About Uni-Rent</h2>

  <div className="card-grid">
    <div className="info-card reveal">
  <h3>Student-Centric</h3>
  <p>Built exclusively for students.</p>
</div>

    <div className="info-card reveal">
      <h3>Cost Efficient</h3>
      <p>
        Save money by renting items instead of buying things you barely use.
      </p>
    </div>

    <div className="info-card reveal">
      <h3>Sustainable</h3>
      <p>
        Reduce waste and promote reuse through a smart sharing economy.
      </p>
    </div>
  </div>
</section>

{/* HOW IT WORKS */}
<section className="section how">
  <h2>How It Works</h2>

  <div className="steps">
    <div className="step-card reveal">
      <span>01</span>
      <h3>Create Account</h3>
      <p>Sign up using your student credentials.</p>
    </div>

    <div className="step-card reveal">
      <span>02</span>
      <h3>Rent or List</h3>
      <p>Browse items or list your own for rent.</p>
    </div>

    <div className="step-card reveal">
      <span>03</span>
      <h3>Use & Return</h3>
      <p>Enjoy the item and return it after use.</p>
    </div>
  </div>
</section>

{/* WHY CHOOSE */}
<section className="section why">
  <h2>Why Choose Uni-Rent</h2>

  <div className="reason-cards">
    <div className="reason-card">Verified student users</div>
    <div className="reason-card">Transparent pricing</div>
    <div className="reason-card">No middlemen</div>
    <div className="reason-card">Secure transactions</div>
  </div>
</section>


{/* SUBSCRIPTIONS */}
<section className="section subscription">
  <h2>Subscription Plans</h2>

  <div className="plans">
    <div className="plan">
      <h3>Free</h3>
      <p>Basic renting & listing</p>
      <span>₹0 / month</span>
    </div>

    <div className="plan featured">
      <h3>Student Plus</h3>
      <p>Priority access & longer rentals</p>
      <span>₹199 / month</span>
    </div>

    <div className="plan">
      <h3>Pro</h3>
      <p>Unlimited listings & support</p>
      <span>₹399 / month</span>
    </div>
  </div>
  {/* CTA */}
<section className="cta">
  <h2>Get Started for Free</h2>
  <p>Join Uni-Rent and start renting smarter today.</p>
  <div className="hero-actions">
  <Link to="/signup" className="btn primary">Get Started</Link>
  <Link to="/login" className="btn ghost">Login</Link>
</div>

</section>
   </section>
    </>
  );
}

export default Landing;
