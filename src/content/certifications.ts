import type { Certification } from "./types";

/**
 * `image` is a filename under public/certificates/. The file may not exist —
 * assets.server.ts resolves existence at build time and CertificateCard renders
 * the designed hatch fallback rather than a broken image.
 */
export const certifications: Certification[] = [
  {
    id: "aws-ccp",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Jul 2023",
    image: "aws_cloud_practitioner.jpg",
  },
  {
    id: "smartbridge",
    title: "Applied Data Science Externship (powered by Google)",
    issuer: "SmartBridge",
    date: "Jul 2023",
    image: "smartbridge_externship.jpg",
  },
  {
    id: "leaps",
    title: "Fundamentals of Data Analytics",
    issuer: "LEAPS by Analyttica",
    date: "May 2023",
    image: "leaps_analyttica.jpg",
  },
  {
    // Date corrected from "Apr 2023": the certificate itself is dated
    // 21/05/2023 (FutureSkills Prime ref FSP/2023/5/3714427).
    id: "nasscom",
    title: "Fundamentals of Data Analytics",
    issuer: "NASSCOM FutureSkills",
    date: "May 2023",
    image: "nasscom_futureskills.jpg",
  },
  {
    id: "kaggle-python",
    title: "Python Certification",
    issuer: "Kaggle",
    date: "Dec 2022",
    image: "kaggle_python.jpg",
  },
  {
    id: "aws-mla",
    title: "AWS Certified Machine Learning Engineer – Associate (MLA-C01)",
    issuer: "Amazon Web Services",
    date: "Targeted",
    inProgress: true,
  },
];
