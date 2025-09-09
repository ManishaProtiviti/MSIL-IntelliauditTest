import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 9, color: "#000", fontFamily: "Helvetica" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  logo: { fontSize: 14, fontWeight: "bold", color: "#012378" },
  powered: { fontSize: 8, color: "#555" },
  userInfo: { fontSize: 9, lineHeight: 1.4, marginTop: 4 },

  statRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 4 },
  statBox: {
    backgroundColor: "#fff",
    border: "1 solid #012378",
    borderRadius: 6,
    padding: 6,
    marginLeft: 6,
    alignItems: "center",
    width: 80,
  },
  statValue: { fontSize: 11, fontWeight: "bold", color: "#012378" },
  statLabel: { fontSize: 7, color: "#012378" },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#012378",
    marginTop: 12,
    marginBottom: 6,
  },

  chartsRow: { flexDirection: "row", justifyContent: "space-between" },
  chartBox: {
    border: "1 solid #ccc",
    borderRadius: 6,
    height: 150,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  legendRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    marginBottom: 10,
    fontSize: 8,
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  circle: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },

  table: {
    width: "100%",
    border: "1 solid #000",
    borderRight: 0,
    borderBottom: 0,
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    flex: 1,
    borderRight: "1 solid #000",
    borderBottom: "1 solid #000",
    padding: 3,
    textAlign: "center",
    fontSize: 7,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    fontSize: 7,
  },

  footer: {
    fontSize: 7,
    color: "#666",
    marginTop: 10,
    textAlign: "left",
  },
});

// ----------------- Helpers -----------------
const renderMarker = (val) => {
  if (val === "No") {
    return <View style={[styles.circle, { backgroundColor: "#3CD188" }]} />;
  }
  if (val === "Yes") {
    return <View style={[styles.circle, { backgroundColor: "#F44336" }]} />;
  }
  return <View style={[styles.circle, { backgroundColor: "#bbb" }]} />;
};

const isValidDataUrl = (v) =>
  typeof v === "string" && /^data:image\/(png|jpeg|jpg);base64,/.test(v);

// ----------------- Template -----------------
const PdfTemplate = ({
  responseData = {},
  userData = {},
  processingTime = "",
  pieChartDataUrl,
  barChartDataUrl,
}) => {
  const transactions = responseData.transactions || [];
  const status = responseData.status_data?.[0] || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>MARUTI SUZUKI</Text>
          <View>
            <Text style={styles.powered}>Powered by DE</Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text>{userData?.name || ""}</Text>
          <Text>
            #{userData?.employeeId || ""} – {userData?.email || ""}
          </Text>
          <Text>Department: {userData?.department || "DX3"}</Text>
          <Text>Access: {userData?.access || "Enterprise"}</Text>
          <Text>Login Time Stamp: {status?.Login_Timestamp || "-"}</Text>
          <Text>Execution Time Stamp: {status?.Process_End_Time || "-"}</Text>
          <Text>Process Duration: {processingTime || "-"}</Text>
        </View>

        {/* Stat Boxes */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {status?.Total_Size_Upload
                ? `${(parseFloat(status.Total_Size_Upload) || 0).toFixed(1)} GB`
                : "0.0 GB"}
            </Text>
            <Text style={styles.statLabel}>Size of files</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {status?.Total_Documents_Upload || transactions.length}
            </Text>
            <Text style={styles.statLabel}>No of files</Text>
          </View>
        </View>

        {/* Charts */}
        <Text style={styles.sectionTitle}>Outcome overview</Text>
        <View style={styles.chartsRow}>
          <View style={styles.chartBox}>
            {isValidDataUrl(pieChartDataUrl) ? (
              <Image src={pieChartDataUrl} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text>No Pie Chart Available</Text>
            )}
          </View>
          <View style={styles.chartBox}>
            {isValidDataUrl(barChartDataUrl) ? (
              <Image src={barChartDataUrl} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text>No Bar Chart Available</Text>
            )}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.circle, { backgroundColor: "#3CD188" }]} />
            <Text>Pass</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.circle, { backgroundColor: "#F44336" }]} />
            <Text>Fail</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.circle, { backgroundColor: "#bbb" }]} />
            <Text>Not selected</Text>
          </View>
        </View>

        {/* Transactional Table */}
        <Text style={styles.sectionTitle}>Transactional outcome</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {["S.No", "File Name", "Checks Failed", "De-Duplication", "PDF Edit", "Copy Move", "Metadata", "QR Code", "Image Edit"].map((h, i) => (
              <Text key={i} style={[styles.tableCol, styles.tableHeader]}>
                {h}
              </Text>
            ))}
          </View>

          {transactions.map((row, i) => {
            const checksFailed = Object.values(row).filter((v) => v === "Yes").length;
            const totalChecks = Object.values(row).filter(
              (v) => v === "Yes" || v === "No"
            ).length;

            return (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCol}>{i + 1}</Text>
                <Text style={styles.tableCol}>{row?.Document_Name || "-"}</Text>
                <Text style={styles.tableCol}>
                  {checksFailed}/{totalChecks}
                </Text>
                <Text style={styles.tableCol}>{renderMarker(row?.Duplicate_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderMarker(row?.PDF_Edit_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderMarker(row?.Copy_Move_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderMarker(row?.MetaData_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderMarker(row?.QR_Code_Exception_Flag)}</Text>
                <Text style={styles.tableCol}>{renderMarker(row?.Image_Edit_Exception_Flag)}</Text>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Results are AI-generated and may vary. Check for inaccuracies.
        </Text>
      </Page>
    </Document>
  );
};

export default PdfTemplate;
