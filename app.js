const express = require('express')
const fs = require('fs');
const fontkit = require('@pdf-lib/fontkit')
const { PDFDocument, rgb } = require('pdf-lib');
const uuid = require('uuid')
const path = require('path')
var dayjs = require('dayjs')


const app = express()
app.use(express.json())

app.post('/', (req, res) => {
    if (req.body) {
        const { name, quant, possibleBy } = req.body
        const incomingData = {
            id: uuid.v4(),
            name,
            possibleBy,
            quant,
        }
        generatePDF(incomingData)
        res.status(200).send('ok')
    } else {
        res.status(404);
    }
})

const generatePDF = async (person) => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(`${__dirname}/assets/tree_certificate_clean_0419.pdf`));
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync(path.join(__dirname, '/assets/Brown-Regular.ttf'));
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    firstPage.drawText(person.name, {
        x: 48,
        y: 400,
        size: 30,
        font: customFont,
        color: rgb(1, 1, 1),
    })

    firstPage.drawText(person.possibleBy, {
        x: 48,
        y: 130,
        size: 30,
        font: customFont,
        color: rgb(0.14, 0.22, 0.39)
    })

    firstPage.drawText(person.quant, {
        x: 159,
        y: height / 2 + 5,
        size: 15,
        font: customFont,
        color: rgb(0.14, 0.22, 0.39)
    })

    firstPage.drawText(dayjs().format('M-D-YYYY'), {
        x: 85,
        y: 54,
        size: 12,
        font: customFont,
        color: rgb(0.14, 0.22, 0.39)
    })

    const pdfBytes = await pdfDoc.save();
    const newFilePath = `${__dirname}/assets/tree-certificate-${person.id}.pdf`;
    fs.writeFileSync(newFilePath, pdfBytes);

}

app.listen(3030, () => {
    console.log('running on port 3030')
})