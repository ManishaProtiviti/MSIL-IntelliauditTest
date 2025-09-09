import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

/*
  NOTE: intentionally NOT registering fonts here to avoid the Buffer/split errors.
  react-pdf font registration with remote URLs can trigger Buffer usage in the browser.
*/

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, color: "#000" },
  header: { flexDirection: "row", justifyContent: "space-between", borderBottom: "1 solid #ccc", paddingBottom: 6, marginBottom: 10 },
  logo: { fontSize: 14, fontWeight: "bold", color: "#012378" },
  userInfo: { fontSize: 9, lineHeight: 1.4 },
  statBoxRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  statBox: { border: "1 solid #012378", borderRadius: 4, padding: 6, alignItems: "center", width: 100 },
  statValue: { fontSize: 12, fontWeight: "bold", color: "#012378" },
  sectionTitle: { fontSize: 11, fontWeight: "bold", color: "#012378", marginTop: 10, marginBottom: 4 },
  outcomeRow: { flexDirection: "row", justifyContent: "space-between" },
  chartBox: { border: "1 solid #ccc", height: 150, width: "48%", justifyContent: "center", alignItems: "center" },
  table: { width: "100%", border: "1 solid #000", borderRight: 0, borderBottom: 0, marginTop: 6 },
  tableRow: { flexDirection: "row" },
  tableCol: { flex: 1, borderRight: "1 solid #000", borderBottom: "1 solid #000", padding: 3, textAlign: "center", fontSize: 8 },
  tableHeader: { backgroundColor: "#eee", fontWeight: "bold" },
  footer: { fontSize: 7, color: "#666", marginTop: 10, textAlign: "left" },
});

const renderCheck = (val) => {
  if (val === "Yes") return "✘";
  if (val === "No") return "✔";
  return "-";
};

const isValidDataUrl = (v) => typeof v === "string" && /^data:image\/(png|jpeg|jpg);base64,/.test(v);

const PdfTemplate = ({ responseData = {}, userData = {}, processingTime = "", pieChartDataUrl, barChartDataUrl }) => {
  const transactions = responseData.transactions || [];
  const status = responseData.status_data?.[0] || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>MARUTI SUZUKI</Text>
          <View style={styles.userInfo}>
            <Text>{userData?.name || ""}</Text>
            <Text>#{userData?.employeeId || ""} – {userData?.email || ""}</Text>
            <Text>Department: {userData?.department || "DX3"}</Text>
            <Text>Access: {userData?.access || "Enterprise"}</Text>
          </View>
        </View>

        <View style={styles.statBoxRow}>
          <View style={styles.statBox}><Text style={{ fontSize: 8 }}>Size of files</Text><Text style={styles.statValue}>{status?.Total_Size_Upload || "0 MB"}</Text></View>
          <View style={styles.statBox}><Text style={{ fontSize: 8 }}>No of files</Text><Text style={styles.statValue}>{status?.Total_Documents_Upload || transactions.length}</Text></View>
        </View>

        <View style={{ marginTop: 10, fontSize: 8 }}>
          <Text>Login Time Stamp: {status?.Login_Timestamp || "-"}</Text>
          <Text>Execution Time Stamp: {status?.Process_End_Time || "-"}</Text>
          <Text>Process Duration: {processingTime || "-"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Outcome overview</Text>
        <View style={styles.outcomeRow}>
          <View style={styles.chartBox}>
            {isValidDataUrl(pieChartDataUrl) ? <Image src={pieChartDataUrl} style={{ width: "100%", height: "100%" }} /> : <Text>No Pie Chart Available</Text>}
          </View>
          <View style={styles.chartBox}>
            {isValidDataUrl(barChartDataUrl) ? <Image src={barChartDataUrl} style={{ width: "100%", height: "100%" }} /> : <Text>No Bar Chart Available</Text>}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Transactional outcome</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableHeader, { flex: 0.5 }]}>S.No</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>File Name</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Checks Failed</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>De-Duplication</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>PDF Edit</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Copy Move</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Metadata</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>QR Code</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Image Edit</Text>
          </View>

          {transactions.map((row, i) => {
            const checksFailed = Object.values(row).filter((v) => v === "Yes").length;
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCol, { flex: 0.5 }]}>{i + 1}</Text>
                <Text style={styles.tableCol}>{row?.Document_Name || "-"}</Text>
                <Text style={styles.tableCol}>{checksFailed}/5</Text>
                <Text style={styles.tableCol}>{renderCheck(row?.Duplicate_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderCheck(row?.PDF_Edit_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderCheck(row?.Copy_Move_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderCheck(row?.MetaData_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderCheck(row?.QR_Code_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderCheck(row?.Image_Edit_Exception_Flag)}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.footer}>Results are AI-generated and may vary. Check for inaccuracies.</Text>
      </Page>
    </Document>
  );
};

export default PdfTemplate;
