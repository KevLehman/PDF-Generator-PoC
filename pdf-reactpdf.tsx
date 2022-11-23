import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";

import InvoiceTableHeader from "./InvoiceTableHeader";
import { messages } from "./messages";
import { measurePerformance } from "./performance";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#F7F8FA",
    display: "flex",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  logo: {
    marginVertical: 15,
    marginHorizontal: 100,
    height: 50,
    width: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    margin: 5,
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    borderWidth: 0,
    marginLeft: 5,
  },
  messagesContainer: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    height: "100%",
    marginTop: 30,
    marginBottom: 30,
    width: "100%",
    paddingBottom: 30,
  },
  message: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    wordWrap: "break-word",
    fontSize: "12",
    textAlign: 'justify',
  },
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <div>
          <header style={styles.header}>
            <Image style={styles.logo} src="logo.png" />
            <View style={{ flexDirection: "column" }}>
              <Text>Rocket.Chat</Text>
              <Text>Chat Transcript</Text>
            </View>
          </header>
        </div>
        <div>
          <View style={styles.tableContainer}>
            <InvoiceTableHeader
              values={[
                { key: "Agent: ", value: "Christian Castro" },
                { key: "Date: ", value: "Nov 21, 2022" },
              ]}
            />
            <InvoiceTableHeader
              values={[
                { key: "Customer: ", value: "Juanito Verdulero de Ponce" },
                { key: "Time: ", value: "11:00 AM" },
              ]}
            />
          </View>
        </div>
        <div>
          <View style={styles.messagesContainer}>
            {messages.map((message, index) => (
              <View style={styles.message} id={`${index}`}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>{message.user}</Text>
                  <Text style={{ marginLeft: 10, color: "#9e9e9e" }}>
                    {message.ts}
                  </Text>
                </View>
                <View style={{ marginTop: 10, flexDirection: "column" }}>
                  <Text>{message.msg}</Text>
                </View>
                {message.attachments && (
                  message.attachments.map((attachment, index) => (
                    <View style={{ marginTop: 10, flexDirection: "column" }} id={`attachment-${index}`}>
                      <Text style={{ color: "#9e9e9e", marginBottom: 0 }}>{attachment.name}</Text>
                      <Image style={{ width: 200 }} src={attachment.url} />
                    </View>
                  ))
                )}
              </View>
            ))}
          </View>
        </div>
      </View>
    </Page>
  </Document>
);

const cpuUsage = process.cpuUsage();

function create100PDFs() {
  const promises = [];
  // Change this to 100 to see get more PDFs :)
  for (let i = 0; i < 1; i++) {
    promises.push(ReactPDF.render(<MyDocument />, `./example${Date.now()}.pdf`));
  }

  return Promise.all(promises);
}

create100PDFs().then(() => {
  measurePerformance(cpuUsage);
});
