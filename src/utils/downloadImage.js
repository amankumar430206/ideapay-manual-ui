import CustomerService from "../api/customer-service";
import { CUSTOMER_API_URL } from "../api/urlMetaData";

export const downloadImage = async ({ fileName }) => {
  return await CustomerService.post(CUSTOMER_API_URL.DOWNLOAD_IMAGE, {
    fileName,
  });
};
