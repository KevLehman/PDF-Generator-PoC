import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 25,
        textAlign: 'left',
        flexGrow: 1,
        fontSize: 18,
        width: '90%',
    },
    description: {
        paddingLeft: 8,
    },
  });

  const InvoiceTableHeader = ({ values }: { values: {key: string; value: string }[] }) => (
    <View style={styles.container}>
        <Text style={{...styles.description, width: '60%'}}><strong><Text>{values[0].key}</Text></strong>{values[0].value}</Text>
        <Text style={{...styles.description, width: '40%'}}><strong><Text>{values[1].key}</Text></strong>{values[1].value}</Text>
    </View>
  );
  
  export default InvoiceTableHeader