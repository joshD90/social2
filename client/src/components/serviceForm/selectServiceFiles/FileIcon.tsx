import { FC } from "react";
import { findIconsOnExtensions } from "./fileIconImages";

type Props = { file: File };

const FileIcon: FC<Props> = ({ file }) => {
  return (
    <div>
      <div>{findIconsOnExtensions(file)}</div>
    </div>
  );
};

export default FileIcon;
