import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Easy to Use",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        The extension is built with ease of use in mind. Do operations easily.
        Makes the vtop platform experience more comfortable
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    imageUrl: "img/undraw_docusaurus_tree.svg",
    description: <>Focus on Assignments. Lemme worry about due dates.</>,
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--6", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <img src="https://i.ibb.co/3zWbR2w/Screenshot-from-2020-08-13-22-11-58.png" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1>Features: </h1>
            <p>See DA dates easily</p>
            <p>Sync with Google calendar</p>
            <p>Navigate between VTOP conveniently</p>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
