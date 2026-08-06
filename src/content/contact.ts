import type { Contact } from "./types";

export const contact: Contact = {
  heading: "Let's build something measurable.",
  formTitle: "Send Me a Message",
  fields: [
    { id: "name", label: "Full Name", type: "text" },
    { id: "email", label: "Email Address", type: "email" },
    { id: "subject", label: "Subject", type: "text" },
    { id: "message", label: "Message", type: "textarea" },
  ],
  submitLabel: "Send Message",
  submittingLabel: "Sending",
  successLabel: "Message sent",
  errors: {
    unconfigured:
      "Message didn't send. Try again, or email me directly.",
    network: "Message didn't send. Try again, or email me directly.",
    timeout: "Message didn't send. Try again, or email me directly.",
    rejected: "Message didn't send. Try again, or email me directly.",
  },
  validation: {
    required: "Required",
    email: "Enter a valid email address",
  },
  infoTitle: "Contact Information",
  cvLabel: "Download CV",
  cvUnavailableLabel: "Request CV",
  mailtoLabel: "Email me directly",
};
