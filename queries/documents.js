const { db, pgp } = require("../dbConnection");

exports.queryToInsertDocument = (document) => {
  return db.none(
    `INSERT 
      INTO
      cook_county_land_documents (
        doc_date,
        doc_type,
        doc_number,
        pin,
        address,
        city,
        zipcode,
        parties_involved
      )
      VALUES (
        $/docDate/,
        $/docType/,
        $/docNumber/,
        $/PIN/,
        $/Address/,
        $/City/,
        $/Zipcode/,
        $/Parties/
      )
    `,
    { ...document }
  );
};
