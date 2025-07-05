const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const generarPDFVenta = async (venta, detalles, cliente, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(25).text('Ferreteria Santo Cristo', { align: 'center' });

    doc.fontSize(20).text('Comprobante de Venta', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Fecha: ${moment().format("DD/MM/YYYY")}`);
    doc.text(`Cliente: ${cliente.nombre} - ${cliente.tipoDoc}: ${cliente.nroDoc}`);
    doc.text(`Correo: ${cliente.correo || 'N/A'} - Teléfono: ${cliente.telefono || 'N/A'}`);
    doc.text(`${venta.tipoComprobante} : ${venta.serie}-${venta.nroComprobante}`);
    doc.text(`Método de Pago: ${venta.metodoPago}`);
    doc.moveDown();

    doc.text('Detalle de la venta:', { underline: true });
    detalles.forEach(det => {
      doc.text(`${det.cantidad} x ${det.producto.nombre} - S/. ${det.producto.precio} = S/. ${det.subtotal}`);
      // Mostrar distrito y costoL solo si existen
      if (det.distrito && det.costoL !== undefined && det.costoL !== null) {
        doc.text(`${det.cantidad} x ${det.distrito} - S/. ${det.costoL} = S/. ${det.subtotal}`);
      }
    });

    doc.moveDown();
    doc.text(`IGV: S/. ${venta.total*0.18}`, { align: 'right', bold: true });
    doc.text(`Total: S/. ${venta.total + venta.total*0.18}`, { align: 'right', bold: true });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', (err) => reject(err));
  });
};

module.exports = generarPDFVenta;
