import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { RequestData } from "@/App";
import logo from "@/assets/meezanHeader.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    paddingBottom: 10,
    marginBottom: 20,
  },
  companyLogo: {
    width: 1200,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  column: {
    width: "50%",
    paddingRight: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 3,
  },
  value: {
    fontSize: 10,
    marginBottom: 8,
    borderBottom: "1px solid #ccc",
    paddingBottom: 4,
  },
  table: {
    width: "100%",
    marginTop: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%",
    padding: 3,
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    borderTop: "1px solid #000",
    paddingTop: 10,
  },
});

const MyDocument = ({ details }: { details: RequestData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image src={logo} style={styles.companyLogo} />
      </View>
      <Text style={styles.title}>Asset Request Form</Text>

      {/* Requester Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requester Information</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}> Name:</Text>
            <Text style={styles.value}>{details?.name}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Employee ID:</Text>
            <Text style={styles.value}>{details.EmployID}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>cnic:</Text>
            <Text style={styles.value}>{details.cnic}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Request Date:</Text>
            <Text style={styles.value}>{details.createdAt}</Text>
          </View>
        </View>
      </View>

      {/* Asset Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asset Details</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Asset Type</Text>
            <Text style={styles.tableCol}>Specification</Text>
            <Text style={styles.tableCol}>Quantity</Text>
            <Text style={styles.tableCol}>Urgency</Text>
          </View>
          {/* Table Content */}
          {/* {details.assets.map((asset, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{asset.type}</Text>
              <Text style={styles.tableCol}>{asset.specification}</Text>
              <Text style={styles.tableCol}>{asset.quantity}</Text>
              <Text style={styles.tableCol}>{asset.urgency}</Text>
            </View>
          ))} */}
        </View>
      </View>

      {/* Justification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Justification</Text>
        <Text style={[styles.value, { height: 50 }]}>Justification</Text>
      </View>

      <View>
        <Text>
          I hereby request to purchase from Meezan Bank Limited, a specific
          asset selected by me from the available models of the mutually agreed
          price on installments basis.
        </Text>
      </View>

      {/* Approvals Section */}
      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text style={styles.label}>Requester Signature:</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={styles.label}>Approver Signature:</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
