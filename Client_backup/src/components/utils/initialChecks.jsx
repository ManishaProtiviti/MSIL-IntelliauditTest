import deDuplicacyIcon from "../../assets/analytical-icons/de-duplicacy-icon.svg";
import pdfEditIcon from "../../assets/analytical-icons/pdf-edit-icon.svg";
import copyMoveIcon from "../../assets/analytical-icons/copy-move-icon.svg";
import qrCodeIcon from "../../assets/analytical-icons/qr-code-icon.svg";
import metaDataIcon from "../../assets/analytical-icons/metadata-check-icon.svg";
import imageTampIcon from "../../assets/analytical-icons/image-tampering-icon.svg";
import copyMoveBg from "../../assets/analytical-icons/copy-move-bg.svg";
import deDuplicacyBg from "../../assets/analytical-icons/de-duplicacy-bg.svg";
import qrCodeBg from "../../assets/analytical-icons/qr-code-bg.svg";
import metaDataBg from "../../assets/analytical-icons/metadata-bg.svg";
import pdfForgeryBg from "../../assets/analytical-icons/pdf-forgery-bg.svg";
import imageTampBg from "../../assets/analytical-icons/image-tamp-bg.svg";

export default [
  {
    id: "deduplication",
    title: "De-duplication",
    description: "Detect similar or duplicate documents",
    checked: false,
    icon: deDuplicacyIcon,
    background: deDuplicacyBg,
  },
  {
    id: "pdf-edit",
    title: "PDF edit forgery",
    description: "Detect edits in PDF files via pixel analysis",
    checked: false,
    icon: pdfEditIcon,
    background: pdfForgeryBg,
  },
  {
    id: "copy-move",
    title: "Copy move forgery",
    description: "Find copied-pasted sections within the same document",
    checked: false,
    icon: copyMoveIcon,
    background: copyMoveBg,
  },
  {
    id: "metadata",
    title: "Metadata check",
    description: "Reveal non-system document creators and modification traces",
    checked: false,
    icon: metaDataIcon,
    background: metaDataBg,
  },
  {
    id: "qr-code",
    title: "QR code reader",
    description: "Verify QR code authenticy",
    checked: false,
    icon: qrCodeIcon,
    background: qrCodeBg,
  },
  {
    id: "image-tampering",
    title: "Image Tampering",
    description: "Spot altered image regions through pixel variation",
    checked: false,
    icon: imageTampIcon,
    background: imageTampBg,
  },
];
