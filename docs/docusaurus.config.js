/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "ExVTOP",
  // tagline: "",
  url: "https://sudonims.tech/exvtop",
  baseUrl: "/vtop-da-deadline/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "sudonims", // Usually your GitHub org/user name.
  projectName: "vtop-da-deadline", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Extended VTOP",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          label: "Privacy Policy",
          href: "/privacy",
          position: "right",
        },
        {
          href: "https://github.com/sudonims/vtop-da-deadline",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} ExVTOP. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
