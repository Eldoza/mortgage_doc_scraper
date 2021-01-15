const xlsx = require("node-xlsx");
const axios = require("axios");
const fs = require("fs");
const { queryToInsertDocument } = require("./queries/documents");

// PIN 1083852 already in DB 
// 1-10
// 11-100
// 101-500


let counter = 500
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

      console.log({ documentResults });
    });
};


const runFetchDocsJob = async () => {
  while (counter < 500){
    getXLS();
    await delay(1000)
    counter += 1
    
    console.log('COUNTER CURRENTLY AT ===>', counter)
  }
}

runFetchDocsJob()