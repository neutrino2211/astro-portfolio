export type Project = {
  title: string;
  tech: {
    name: string;
    image: string;
  };
  link: string;
  description: string;
};

const projects: Project[] = [
  {
    title: "Scryer",
    tech: {
      name: "Python",
      image: "/python-3.svg"
    },
    link: "https://github.com/neutrino2211/scryer",
    description: "Scryer is a network-based intrusion detection system (IDS) designed to protect your network from external threats."
  },
  {
    title: "Gecko",
    tech: {
      name: "Golang",
      image: "/golang.svg"
    },
    link: "https://github.com/neutrino2211/gecko",
    description: "A programming language designed for writing low level and highly performant applications using a beginner friendly syntax.",
  },
  {
    title: "NomadDB",
    tech: {
      name: "Golang",
      image: "/golang.svg"
    },
    link: "https://github.com/neutrino2211/NomadDB",
    description: "A decentralised P2P database format designed with an emphasis on ownership and anonymity."
  },
];

export default projects;
