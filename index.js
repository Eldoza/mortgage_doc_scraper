const xlsx = require("node-xlsx");
const axios = require("axios");
const fs = require("fs");

const getXLS = () => {
  return axios
    .request({
      responseType: "arraybuffer",
      url: "http://www.ccrecorder.org/parcels/excel/parcel/1083852/",
      method: "get",
      headers: {
        "Content-Type": "blob",
      },
    })
    .then((result) => {
      const workSheetsFromBuffer = xlsx.parse(result.data, { cellDates: true });

      const dataFromSheet = workSheetsFromBuffer[0].data;
      const results = [];

      for (let i = 1; i < dataFromSheet.length; i++) {
        const columns = dataFromSheet[0];
        const currentElement = dataFromSheet[i];

        const newElement = Object.assign(
          ...columns.map((k, i) => ({ [k]: currentElement[i] }))
        );

        results.push(newElement);
      }
      
      console.log({ results });

      // return outputFilename;
    });
};

getXLS();
