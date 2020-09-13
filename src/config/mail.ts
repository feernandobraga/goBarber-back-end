interface IMailConfig {// used to guarantee that the driver can only be either ethereal or ses
  
  driver: "ethereal" | "ses"; // gets the driver set in the mail config or uses ethereal as default

  defaults: {
    from: {
      email: string;
      name: string;
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || "ethereal",

  defaults: { // default fields for sending the email
    from: {
      email: "contact@fernandobraga.me",
      name: 'Fernando Braga'
    },
  },
} as IMailConfig;
