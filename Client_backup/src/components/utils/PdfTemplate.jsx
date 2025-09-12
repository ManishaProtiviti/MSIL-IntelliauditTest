import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import marutiBlueLogo from "../../assets/maruti-blue-logo.png";
import deLogo from "../../assets/power-by-DE-logo.png";
import {
  convertTimestampToNormal,
  convertTimestampToNormalWithoutMS,
} from "./timeStampFormatter";

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
  powered: { fontSize: 8, color: "#555", width: "20%", height: "100%", marginTop: 0 },
  userInfo: { fontSize: 9, lineHeight: 1.4, marginTop: 4, marginBottom: 4 },

  statRow: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 4,
    gap: 2,
  },
  statBox: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    textAlign: "center",
    border: "1 solid #012386",
    borderRadius: 2,
    justifyContent: "space-between",
    width: "150px",
  },
  statValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#012378",
    padding: 2,
    width: "50%",
  },
  statLabel: {
    fontSize: 8,
    fontWeight: "bold",
    backgroundColor: "#012386",
    color: "#fff",
    padding: 2,
    width: "50%",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#012378",
    // marginTop: 12,
    // marginBottom: 2,
  },
  sectionTitle1: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#012378",
    marginTop: 12,
    marginBottom: 2,
  },
  sectionSubTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#012378",
    marginTop: 8,
    marginBottom: 2,
  },

  chartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 4,
  },
  chartBox: {
    border: "1 solid #ccc",
    borderRadius: 2,
    height: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 4,
  },

  legendRow: {
    flexDirection: "row",
    gap: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
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
  // const userData = sessionStorage.getItem("session");
  console.log(transactions, "-->", status);
  const truncate = (text, maxLenth= 10) => {
    return text && text.length > maxLenth ? text.slice(0, maxLenth) + "..." : text;
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            src={marutiBlueLogo}
            style={{ width: "30%", height: "60%", marginTop: 10 }}
          />
          {/* <View> */}
          <Image src={deLogo} style={styles.powered} />
          {/* </View> */}
        </View>

        {/* User Info */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.userInfo}>
            <Text style={{fontSize: 10}}>{userData?.givenName || ""}</Text>
            <Text>#UserId-{userData?.employeeEmailId || ""}</Text>
            <Text>Department: {userData?.department || "DX3"}</Text>
            <Text style={{ marginBottom: "5px" }}>
              Access: {userData?.access || "Enterprise"}
            </Text>
            <Text>
              Login Time Stamp:{" "}
              {userData?.loginTime
                ? convertTimestampToNormalWithoutMS(userData?.loginTime, true)
                : "-"}
            </Text>
            <Text>
              Execution Time Stamp:{" "}
              {status?.Process_End_Time
                ? convertTimestampToNormalWithoutMS(Date(userData?.Process_End_Time), false)
                : "-"}
            </Text>
            <Text>Process Duration: {processingTime || "-"}</Text>
          </View>

          {/* Stat Boxes */}
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {status?.Total_Size_Upload
                  ? `${(parseFloat(status.Total_Size_Upload) || 0).toFixed(
                      1
                    )} MB`
                  : "0.0 MB"}
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
        </View>

        {/* Charts */}
        <Text style={styles.sectionTitle1}>Outcome overview</Text>

        <View style={styles.chartsRow}>
          <View style={{ width: "100%" }}>
            <Text style={styles.sectionSubTitle}>Pass / Fail Split</Text>
            <View style={styles.chartBox}>
              {isValidDataUrl(pieChartDataUrl) ? (
                <Image
                  src={pieChartDataUrl}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Text>No Pie Chart Available</Text>
              )}
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <Text style={styles.sectionSubTitle}>Check Wise Files Failed</Text>
            <View style={styles.chartBox}>
              {isValidDataUrl(barChartDataUrl) ? (
                <Image
                  src={barChartDataUrl}
                  style={{ width: "100%", height: "100%", fontSize: 4 }}
                />
              ) : (
                <Text>No Bar Chart Available</Text>
              )}
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15, marginBottom: 7, alignContent: 'center', textAlign: 'center' }}>
        <Text style={styles.sectionTitle}>Transactional outcome</Text>
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
        </View>

        {/* Transactional Table */}
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {[
              "S.No",
              "File Name",
              "Checks Failed",
              "De-Duplication",
              "PDF Edit",
              "Copy Move",
              "Metadata",
              "QR Code",
              "Image Edit",
            ].map((h, i) => (
              <Text key={i} style={[styles.tableCol, styles.tableHeader]}>
                {h}
              </Text>
            ))}
          </View>

          {transactions.map((row, i) => {
            const checksFailed = Object.values(row).filter(
              (v) => v === "Yes"
            ).length;
            const totalChecks = Object.values(row).filter(
              (v) => v === "Yes" || v === "No"
            ).length;

            return (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCol}>{i + 1}</Text>
                <Text style={styles.tableCol}>{truncate(row?.Document_Name, 13) || "-"}</Text>
                <Text style={styles.tableCol}>
                  {checksFailed}/{totalChecks}
                </Text>
                <View style={styles.tableCol}>
                  {renderMarker(row?.Duplicate_Exception_Flag)
                  }
                </View>
                <View style={styles.tableCol}>
                  {renderMarker(row?.PDF_Edit_Exception_Flag)}
                </View>
                <View style={styles.tableCol}>
                  {renderMarker(row?.Copy_Move_Exception_Flag)}
                </View>
                <View style={styles.tableCol}>
                  {renderMarker(row?.MetaData_Exception_Flag)}
                </View>
                <View style={styles.tableCol}>
                  {renderMarker(row?.QR_Code_Exception_Flag)}
                </View>
                <View style={styles.tableCol}>
                  {renderMarker(row?.Image_Edit_Exception_Flag)}
                </View>
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
