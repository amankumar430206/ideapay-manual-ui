import CardService from "../api/card-service";
import {
  CARDS_API_URL,
  CUSTOMER_API_URL,
  MERCHANT_API_URL,
  PRODUCT_API_URL,
  WALLET_API_URL,
} from "../api/urlMetaData";
import WalletService from "../api/wallet-service";
import { getCurrentFormattedDate } from "./utils";
import { downloadFile } from "./downloadFile";
import CustomerService from "../api/customer-service";
import MerchantService from "../api/merchant-service";
import ReportService from "../api/report-service";
import ProductService from "../api/product-service";

// B2B Payments - Report Download
export const downloadReportB2B = async ({
  filename = "B2B_Report",
  email = "",
  clientHashId,
  userHashId,
  dateRange,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_B2B_REPORT}?clientHashId=${clientHashId}&userHashId=${userHashId}&daterange=${dateRange}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `B2B_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Reports : Card Load
export const downloadReportingCardLoad = async ({
  filename = "Card_Load_Report",
  userHashId,
  dateRange,
  username,
  email = "",
}) => {
  try {
    const url = `${
      CARDS_API_URL.DOWNLOAD_CARD_LOAD_REPORT
    }?daterange=${dateRange}&username=${username}&fromUserHashId=${userHashId}&report=${true}`;

    const res = await ReportService.post(url);
    if (res.data) {
      filename = `Card_Load_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res?.data;
  } catch (error) {}
};

// Card Load - Report Download
export const downloadReportCardLoad = async ({
  filename = "Card_Load_Report",
  userHashId,
  dateRange,
  email = "",
}) => {
  try {
    const url = `${CARDS_API_URL.DOWNLOAD_CARD_LOAD_REPORT_CLIENT}/${userHashId}?daterange=${dateRange}`;
    const res = await CardService.get(url);
    if (res.data) {
      filename = `Card_Load_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res?.data;
  } catch (error) {}
};

// Prefund - Report Download
export const downloadReportPrefund = async ({
  filename = "Prefund_Report",
  email = "",
  clientHashId = "all",
  dateRange,
  userType,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_PREFUND_REPORT}/${clientHashId}/program/all/prefundList/${userType}?daterange=${dateRange}`;
    const res = await ReportService.get(url);
    if (res.data) {
      filename = `Prefund_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Earnings - Report Download
export const downloadReportEarnings = async ({
  filename = "Earnings_Report",
  email = "",
  dateRange,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_EARNINGS_REPORT}?daterange=${dateRange}`;
    const res = await WalletService.post(url);
    if (res.data) {
      filename = `Earnings_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Ledger - Report Download
export const downloadReportLedger = async ({
  filename = "Ledger_Report",
  email = "",
  userHashId,
  dateRange,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_LEDGER_REPORT}?userHashId=${userHashId}&daterange=${dateRange}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `Ledger_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Driver Payment Request - Report Download
export const downloadReportDriverPaymentRequest = async ({
  filename = "Driver_Payment_Req",
  email = "",
  dateRange,
  userType,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_DPREQ_REPORT}/admin?daterange=${dateRange}&userType=${userType}`;
    const res = await ReportService.get(url);
    if (res.data) {
      filename = `Driver_Payment_Req_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Driver Payment Request - Report Download
export const downloadPrefundRequestReport = async ({
  filename = "Prefund_Request_Report",
  email = "",
  userHashId,
  dateRange,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_PREFUND_REQ_REPORT}/${userHashId}?daterange=${dateRange}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `Prefund_Request_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Merchants - Report Download
export const downloadReportMerchants = async ({
  filename = "Merchants_Report",
  email = "",
  dateRange,
}) => {
  try {
    const url = `${MERCHANT_API_URL.DOWNLOAD_MERCHANTS_REPORT}?dateRange=${dateRange}`;
    const res = await MerchantService.post(url);
    if (res.data) {
      filename = `Merchants_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Account Receivable - Report Download
export const downloadReportReceivable = async ({
  filename = "Account_Receivables_Report",
  email = "",
  dateRange,
}) => {
  try {
    const url = `${MERCHANT_API_URL.DOWNLOAD_RECEIVABLE_REPORT}?dateRange=${dateRange}`;
    const res = await MerchantService.get(url);
    if (res.data) {
      filename = `Account_Receivables_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Requests Page

// B2B Payments - Report Download
export const downloadReportB2BRequests = async ({
  filename = "B2B_Requests_Report",
  email = "",
  userHashId,
  dateRange,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_B2B_REQS_REPORT}?approverUserHashId=${userHashId}&daterange=${dateRange}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `B2B_Requests_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// BRequests Page : Driver Payment Request Report Download
export const DownloadDriverPaymentRequestReport = async ({
  filename = "Driver_Payment_Request_Report",
  email = "",
  clientHashId,
  dateRange,
  userType,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_DRIVER_REQS_REPORT}?approverUserHashId=${clientHashId}&daterange=${dateRange}&userType=${userType}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `Driver_Payment_Request_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

export const DownloadTransactionsReport = async ({
  filename = "Transactions_Report",
  dateRange,
  email,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_TRANSACTIONS_REPORT}?daterange=${dateRange}`;
    const res = await ReportService.get(url);
    if (res.data) {
      filename = `Transactions_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

export const DownloadSignUpListReport = async ({
  filename = "Signup_List_Report",
  dateRange,
  email,
}) => {
  try {
    const url = `${CUSTOMER_API_URL.DOWNLOAD_SIGNUP_LIST_REPORT}?daterange=${dateRange}`;
    const res = await CustomerService.post(url);
    if (res.data) {
      filename = `Signup_List_Report${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Drivers List - Report Download
export const downloadDriversList = async ({
  filename = "Drivers_List",
  email = "",
  dateRange,
}) => {
  try {
    const url = `${CUSTOMER_API_URL.DOWNLOAD_DRIVERS_LIST}?daterange=${dateRange}`;
    const res = await ReportService.get(url);
    if (res.data) {
      filename = `Drivers_List_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Cards List - Report Download
export const downloadCardsListReport = async ({
  filename = "Cards_List",
  email = "",
  dateRange,
}) => {
  try {
    const url = `${CARDS_API_URL.DOWNLOAD_CARDS_LIST}?daterange=${dateRange}`;
    const res = await ReportService.get(url);
    if (res.data) {
      filename = `Cards_List_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

export const DownloadPointRedemptionReport = async ({
  filename = "Point_Redemption_Report",
  dateRange,
  email,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_POINT_REDEMPTION_REPORT}?daterange=${dateRange}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `Point_Redemption_Report${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

export const DownloadRankSortedDriverListCampaign = async ({
  filename = "SORTED_DRIVER_LIST_CAMPAIGN",
  dateRange,
  email,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_RANK_SORTED_DRIVER_LIST}?dateRange=${dateRange}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `SORTED_DRIVER_LIST_CAMPAIGN${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

export const DownloadRankSortedMerchantListCampaign = async ({
  filename = "SORTED_MERCHANT_LIST_CAMPAIGN",
  dateRange,
  email,
}) => {
  try {
    const url = `${WALLET_API_URL.DOWNLOAD_RANK_SORTED_MERCHANT_LIST}?dateRange=${dateRange}`;
    const res = await WalletService.get(url);
    if (res.data) {
      filename = `SORTED_MERCHANT_LIST_CAMPAIGN${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};

// Trasnsporter List - Report Download
export const DownloadTransporterList = async ({
  filename = "Transporter_List",
  email = "",
  dateRange,
}) => {
  try {
    const url = `${PRODUCT_API_URL.DOWNLOAD_TRANSPORTER_LIST}?daterange=${dateRange}`;
    const res = await ProductService.get(url);
    if (res.data) {
      filename = `Transporter_List_Report_${email}_${getCurrentFormattedDate()}.csv`;
      downloadFile(res.data, filename);
    }
    return res.status === 200;
  } catch (error) {}
};
