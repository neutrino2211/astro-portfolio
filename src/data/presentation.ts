type Social = {
  label: string;
  link: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
  profile?: string;
};

const presentation: Presentation = {
  mail: "tsowamainasara@gmail.com",
  title: "Hi, I’m Mainasara 👋",
  profile: "https://res.cloudinary.com/practicaldev/image/fetch/s--sqLLTrfj--/c_fill,f_auto,fl_progressive,h_640,q_auto,w_640/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/134911/76ef9492-59b9-4126-a757-7a2d64b12cec.jpeg",
  description:
    "Hello, i'm a *backend developer* with over *4 years* of experience with *Go, Python, Node.js and Typescript*. Outside of work I work on my hobby projects and play a lot of Football Manager",
  socials: [
    {
      label: "Twitter",
      link: "https://twitter.com/neutrino2211",
    },
    {
      label: "Dev.to",
      link: "https://dev.to/neutrino2211",
    },
    {
      label: "Github",
      link: "https://github.com/neutrino2211",
    },
  ],
};

export default presentation;
