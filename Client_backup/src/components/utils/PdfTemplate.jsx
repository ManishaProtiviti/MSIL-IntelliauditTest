import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Create styles for your document
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica"
  },
  header: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 8
  },
  section: {
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  card: {
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    textAlign: 'justify',
  },
});

const PdfTemplate = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>My PDF Report</Text>
          <Text style={styles.text}>This is the content for my PDF.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplate;