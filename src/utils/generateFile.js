export const FILE_TYPES = {
  PDF: "pdf",
  JPG: "jpg",
  JPEG: "jpeg",
  PNG: "png",
};

export const generateFileMetaData = {
  [FILE_TYPES.PDF]: () => {
    return {
      fileType: FILE_TYPES.PDF,
      baseSrc: "data:application/pdf;base64,",
    };
  },
  [FILE_TYPES.PNG]: () => {
    return {
      fileType: FILE_TYPES.PNG,
      baseSrc: "data:image/png;base64,",
    };
  },
  [FILE_TYPES.JPG]: () => {
    return {
      fileType: FILE_TYPES.JPG,
      baseSrc: "data:image/jpeg;base64,",
    };
  },
  [FILE_TYPES.JPEG]: () => {
    return {
      fileType: FILE_TYPES[FILE_TYPES.JPEG],
      baseSrc: "data:image/jpeg;base64,",
    };
  },
};

export const getFileMeta = ({ fileName = "" }) => {
  const fileType = fileName?.split(".").pop();
  return generateFileMetaData[fileType];
};
