import { FaFilePdf, FaFilePowerpoint } from "react-icons/fa6";
import { FaFileWord, FaFileAlt } from "react-icons/fa";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

export const fileIcons = new Map<string, JSX.Element>();

fileIcons.set("pdf", <FaFilePdf />);
fileIcons.set("ppt", <FaFilePowerpoint />);
fileIcons.set("txt", <FaFileWord />);
fileIcons.set("excel", <PiMicrosoftExcelLogoFill />);
fileIcons.set("other", <FaFileAlt />);

export const findIconsOnExtensions = (fileName: string) => {
  const extension = fileName.split(".")[fileName.split(".").length - 1];
  let keySearch = "";

  switch (extension) {
    case "ppt":
      keySearch = "ppt";
      break;
    case "pptx":
      keySearch = "ppt";
      break;
    case "doc":
      keySearch = "txt";
      break;
    case "txt":
      keySearch = "txt";
      break;
    case "docx":
      keySearch = "txt";
      break;
    case "pdf":
      keySearch = "pdf";
      break;
    case "xls":
      keySearch = "excel";
      break;
    case "xlsx":
      keySearch = "excel";
      break;
    default:
      keySearch = "other";
      break;
  }

  return fileIcons.get(keySearch);
};
