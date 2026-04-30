import { PageContent } from "../../components/PageContent";
import { Navbar } from "../../components/Navbar";
import SignUpForm from "../../components/users/SignUpForm";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import Logo from "../../static/rbp-light.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="shadow-sm p-5 bg-primary text-center">
        <img
          className="img-fluid mb-4"
          src={Logo}
          alt="myntpe-logo"
          style={{ height: "3rem" }}
        />
        <h4 className="text-center text-primary fw-light text-light">
          Sign Up Now and Experience the Future of Banking with{" "}
          <span className="fw-bold"> RBP!</span>
        </h4>
      </div>
      <PageContent>
        <div className="container">
          <h5 className="text-center mt-5">Sign Up</h5>
          <div className="row my-5">
            <div className="col-sm-12 col-md-12 col-lg-6 offset-lg-3">
              <div className="alert alert-info">
                We will contact you prior to full account activation to request
                any additional information that might be required.
              </div>
              <SignUpForm />
            </div>
          </div>
        </div>
      </PageContent>
      <footer className="bg-light border border-top p-5">
        <p className="text-center">RBP | Online Banking Platform</p>
      </footer>
    </>
  );
};

export default RegisterPage;
