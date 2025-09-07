import samplePdf from "../../assets/samplePDF.pdf";
import aadharImg from "../../assets/aadharImg.svg";
export default [
  {
    id: "#1234",
    file: "Aadhaar Card",
    risk: "High",
    checks: ["fail", "fail", "fail", "pass", "-", "fail"],
    url: aadharImg,
  },
  {
    id: "#1234",
    file: "PAN Card",
    risk: "Medium",
    checks: ["pass", "pass", "pass", "pass", "-", "fail"],
    url: samplePdf,
  },
  {
    id: "#1234",
    file: "Passport",
    risk: "Low",
    checks: ["pass", "pass", "fail", "pass", "-", "pass"],
  },
  {
    id: "#1234",
    file: "Voter ID Card",
    risk: "High",
    checks: ["fail", "fail", "fail", "pass", "-", "fail"],
  },
  {
    id: "#1234",
    file: "Driving License",
    risk: "Medium",
    checks: ["pass", "fail", "fail", "pass", "-", "fail"],
  },
  {
    id: "#1234",
    file: "Birth Certificate",
    risk: "Low",
    checks: ["pass", "pass", "pass", "pass", "-", "pass"],
  },
  {
    id: "#1234",
    file: "Annual Reports",
    risk: "High",
    checks: ["fail", "fail", "fail", "pass", "-", "fail"],
  },
  {
    id: "#1234",
    file: "Aadhaar Card",
    risk: "Medium",
    checks: ["pass", "fail", "fail", "pass", "-", "fail"],
  },
  {
    id: "#1234",
    file: "PAN Card",
    risk: "Low",
    checks: ["pass", "pass", "fail", "pass", "-", "fail"],
  },
  {
    id: "#1234",
    file: "Passport",
    risk: "Low",
    checks: ["pass", "pass", "fail", "pass", "-", "fail"],
  },
  {
    id: "#1234",
    file: "Driving License",
    risk: "Low",
    checks: ["pass", "pass", "pass", "pass", "-", "pass"],
  },
  {
    id: "#1234",
    file: "PAN Card",
    risk: "Low",
    checks: ["pass", "pass", "fail", "pass", "-", "fail"],
  },
  {
    id: "#1234",
    file: "Driving License",
    risk: "Low",
    checks: ["pass", "pass", "pass", "pass", "-", "pass"],
  },
  {
    id: "#1234",
    file: "PAN Card",
    risk: "Low",
    checks: ["pass", "pass", "fail", "pass", "-", "fail"],
  },
];
