import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// @react-pdf/renderer utiliza su propio sistema de estilos basado en Flexbox
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#2B5897', // Shield Blue de tu paleta principal
    },
    text: {
        fontSize: 12,
        color: '#333333',
    }
});

interface MyDedicatedPDFProps {
    data: any; // Lo definiremos más adelante
}

export const MyDedicatedPDF = ({ data }: MyDedicatedPDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Reporte Mensual</Text>
                <Text style={styles.text}>Este es el título y contenido inicial del PDF.</Text>
                {/* Más adelante mapearemos 'data' aquí */}
            </View>
        </Page>
    </Document>
);