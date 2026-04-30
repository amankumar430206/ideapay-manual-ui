import React from "react";
import { useSelector } from "react-redux";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { ViewUserDetails } from "../../components/users/ViewUserDetails";

export const ProfilePage = () => {
  const currentUser = useSelector((s) => s.auth.currentUser);

  return (
    <PageContent>
      {/* Page Header */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Profile</h3>
        </div>
      </Section>

      <Section>
        <ViewUserDetails id={currentUser?._id} />
      </Section>
    </PageContent>
  );
};

export default ProfilePage;
