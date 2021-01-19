const xlsx = require("node-xlsx");
const axios = require("axios");
const fs = require("fs");
const { queryToInsertDocument } = require("./queries/documents");

// PIN 1083852 already in DB 
// 1-10
// 11-100
// 101-500
// 500-1684
// 1685-2000
// 2000-2100
// 2101 - 46253
// 46253 - 50000
// 50,000 - 100,000
// 100,000 - 200,000
// 200,000 - 210,000
// 210,000 - 250,000 
// 250,000 - 300,000 
// 300,000 - 301,400 
// 301,400 - 400,000 
/// 400,000 - 500,000 
// 500,000 - 600,000
// 600,000 - 700,000

let counter = 700000
const delay = interval => new Promise(resolve => setTimeout(resolve, interval))

const getXLS = () => {
  return axios
    .request({
      responseType: "arraybuffer",
      url: `http://www.ccrecorder.org/parcels/excel/parcel/${counter}/`,
      method: "get",
      headers: {
        "Content-Type": "blob",
      },
    })
    .then(async (result) => {
      const workSheetsFromBuffer = xlsx.parse(result.data, { cellDates: true });

      const dataFromSheet = workSheetsFromBuffer[0].data;
      const documentResults = [];

      for (let i = 1; i < dataFromSheet.length; i++) {
        const columns = dataFromSheet[0];
        const currentElement = dataFromSheet[i];

        const newDocument = Object.assign(
          ...columns.map((k, i) => ({ [k]: currentElement[i] }))
        );

        const formattedDocument = {
          docDate: newDocument["Doc Date"] || null,
          docType: newDocument["Doc Type"] || null,
          docNumber: newDocument["Doc Number"] || null,
          ...newDocument,
        };

        documentResults.push(formattedDocument);
        await queryToInsertDocument(formattedDocument);
      }

      // console.log({ documentResults });
      console.log('NEW RECORD INSERTED ==>')
    });
};


const runFetchDocsJob = async () => {
  while (counter < 800000){
    getXLS();
    await delay(100)
    counter += 1
    
    console.log('COUNTER CURRENTLY AT ===>', counter)
  }
}

runFetchDocsJob()