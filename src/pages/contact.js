import emailjs, { init } from "@emailjs/browser";
import { graphql } from "gatsby";
import React, { useEffect, useState } from "react";
import HelmetWrapper from "../components/helmetWrapper";
import Layout from "../components/layout";

const RequiredWarning = ({ fieldName }) => {
  return (
    <span style={{ color: "#ff4542" }}>{` — ${fieldName} is required!`}</span>
  );
};

const ContactPage = ({ data: { site } }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [formError, setFormError] = useState([]);

  useEffect(() => {
    init(process.env.GATSBY_EMAILJS_USER_ID);
  }, []);

  return (
    <Layout>
      <HelmetWrapper
        title={`Contact | ${site.siteMetadata.title}`}
        description={"Contact page of " + site.siteMetadata.description}
      />
      <div className="two-grids -contact">
        <div>
          <h1 className="post-title">Contact us</h1>
          <div className="primary-content">
            If you are interested to join the lab, collaborate, or inquire,
            please do not hesitate to send Titipat an email (titipat.ach [AT]
            mahidol [DOT] edu) or using the form in this page &rarr;
          </div>
          <div className="primary-content">
            <b>Undergraduate students: </b>
            To discuss potential research projects or ideas, feel free to reach
            out to Titipat and arrange a brief meeting.
          </div>
          <div className="primary-content">
            <b>Graduate students: </b>
            Prospective students interested in pursuing a Masters or PhD program
            in Biomedical Engineering at Mahidol University can submit a CV
            along with a brief statement of their research interests before
            applying. Additionally, they can arrange a discussion with Titipat
            in advance. Titipat is also available for co-advising in various
            departments outside Mahidol University, such as the Department of
            Computer Engineering at Mahidol University, Vidyasirimedhi Institute
            of Science and Technology (VISTEC), or Chulalongkorn University,
            Thailand, providing multiple options for interested students.
          </div>
          <div className="primary-content">
            <b>Other positions: </b>The lab is always actively looking for
            interns, researchers, and developers. If you are interested in doing
            these position (locally or remotely), please also do not hesitate to
            email Titipat to discuss.
          </div>
          <div className="primary-content">
            <b>Office: </b>
            Mahidol University, Engineering Building 3, 3rd Floor 999
            Phutthamonthon 4 Road, Salaya, Nakhon Pathom, Thailand 73170
          </div>
        </div>
        <div>
          <form
            className="form-container"
            onSubmit={e => {
              e.preventDefault();

              const formdata = new FormData(e.target);

              const templateParams = {
                name: formdata.get("w3lName"),
                replyTo: formdata.get("w3lSender"),
                subject: formdata.get("w3lSubject"),
                message: formdata.get("w3lMessage"),
              };

              // check required fields
              let checkedFields = [];

              Object.entries(templateParams).forEach(([key, value]) => {
                if (!value) {
                  checkedFields.push(key);
                } else {
                  checkedFields = checkedFields.filter(field => field !== key);
                }
              });

              // set state as batch to avoid race condition
              setFormError(checkedFields);

              // if there are no errors, send email
              if (checkedFields.length === 0) {
                setIsSending(true);

                emailjs
                  .send(
                    process.env.GATSBY_EMAILJS_SERVICE_ID,
                    process.env.GATSBY_EMAILJS_TEMPLATE_ID,
                    templateParams,
                  )
                  .then(
                    () => {
                      setSubmitted(true);
                    },
                    rej => {
                      console.log("failed with result:", rej);
                    },
                  );
              }
            }}
          >
            {submitted ? (
              <p style={{ margin: 0, lineHeight: "1.5em" }}>
                Your message has successfully been sent to Titipat! It generally
                takes one to two days for him to reply.
              </p>
            ) : (
              <>
                <div>
                  <label htmlFor="w3lName">
                    Name{" "}
                    {formError.includes("name") && (
                      <RequiredWarning fieldName={"Name"} />
                    )}
                  </label>
                  <input type="text" name="w3lName" id="w3lName" />
                </div>
                <div>
                  <label htmlFor="w3lSender">
                    Email
                    {formError.includes("replyTo") && (
                      <RequiredWarning fieldName={"Email"} />
                    )}
                  </label>
                  <input type="email" name="w3lSender" id="w3lSender" />
                </div>
                <div>
                  <label htmlFor="w3lSubject">
                    Subject
                    {formError.includes("subject") && (
                      <RequiredWarning fieldName={"Subject"} />
                    )}
                  </label>
                  <input type="text" name="w3lSubject" id="w3lSubject" />
                </div>
                <div>
                  <label htmlFor="w3lMessage">
                    Message
                    {formError.includes("message") && (
                      <RequiredWarning fieldName={"Message"} />
                    )}
                  </label>
                  <textarea name="w3lMessage" id="w3lMessage"></textarea>
                </div>
                {!isSending && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <input
                      type="submit"
                      className="button -primary"
                      style={{ marginRight: 0 }}
                      disabled={isSending}
                    />
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
export const pageQuery = graphql`
  query ContactPageQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
